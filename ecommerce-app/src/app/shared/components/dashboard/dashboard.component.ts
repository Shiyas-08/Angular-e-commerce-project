import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  totalOrders = 0;
  totalUsers = 0;
  deliveredOrders = 0;
  pendingOrders = 0;
  totalRevenue = 0;

  categoryCounts: any = {};
  legendData: any[] = [];
  categoryChart: any;

  // monthly revenue chart instance
  monthlyChart: any;

  // Full month names (Option A)
  monthNamesFull = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  // Category colors
  categoryColors: any = {
    'Keyboard': '#8BC34A',
    'Mouse': '#FFB300',
    'Headphone': '#FF8F00',
    'Webcam': '#4DD0E1',
    'Chair': '#BA68C8',
    'Controller': '#29B6F6',
    'Monitor': '#9E9D24'
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Fetch orders and users in parallel-ish (sequential here)
    this.http.get<any[]>('http://localhost:3000/orders').subscribe((orders) => {

      // Basic counts
      this.totalOrders = orders.length;
      this.deliveredOrders = orders.filter(o => o.status?.toLowerCase() === 'delivered').length;
      this.pendingOrders = orders.filter(o => o.status?.toLowerCase() === 'pending').length;

      // Total revenue — only delivered orders
      this.totalRevenue = orders
        .filter(o => o.status?.toLowerCase() === 'delivered')
        .reduce((sum, order) => sum + (order.total || 0), 0);

      // CATEGORY counts (exclude cancelled)
      this.categoryCounts = {};
      orders
        .filter(o => o.status?.toLowerCase() !== 'cancelled')
        .forEach(order => {
          (order.items || []).forEach((item: any) => {
            const category = item.category;
            if (!category) return;
            if (!this.categoryCounts[category]) this.categoryCounts[category] = 0;
            this.categoryCounts[category] += item.quantity || 1;
          });
        });

      // Legend data (no Unknown)
      this.legendData = Object.keys(this.categoryCounts).map(cat => ({
        name: cat,
        color: this.categoryColors[cat] || '#999'
      }));

      // Draw donut
      this.renderDonutChart();

      // Prepare and draw monthly revenue chart
      const monthlyRevenue = this.calculateMonthlyRevenue(orders);
      this.renderMonthlyChart(monthlyRevenue);

    });

    // users
    this.http.get<any[]>('http://localhost:3000/users').subscribe((users) => {
      this.totalUsers = users.length;
    });
  }

  // returns array of 12 numbers (Jan..Dec) revenue for current year (delivered orders only)
  calculateMonthlyRevenue(orders: any[]): number[] {
    const now = new Date();
    const currentYear = now.getFullYear();

    const revenueByMonth = new Array(12).fill(0);

    orders.forEach(order => {
      if (!order.date) return;
      // only delivered orders
      if ((order.status || '').toLowerCase() !== 'delivered') return;

      const d = new Date(order.date);
      if (isNaN(d.getTime())) return; // invalid date

      if (d.getFullYear() !== currentYear) return; // only current year

      const monthIndex = d.getMonth(); // 0..11
      revenueByMonth[monthIndex] += (order.total || 0);
    });

    return revenueByMonth;
  }

  // render the donut chart (unchanged from before)
  renderDonutChart() {
    if (this.categoryChart) this.categoryChart.destroy();

    const labels = Object.keys(this.categoryCounts);
    const data = labels.map(cat => this.categoryCounts[cat]);
    const colors = labels.map(cat => this.categoryColors[cat] || '#999');

    const ctx = document.getElementById('categoryChart') as HTMLCanvasElement;
    this.categoryChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        cutout: '70%',
        plugins: { legend: { display: false } }
      }
    });
  }

  // render monthly revenue line chart — full month names (Option A)
  renderMonthlyChart(monthlyRevenue: number[]) {
    if (this.monthlyChart) this.monthlyChart.destroy();

    const labels = this.monthNamesFull; // January ... December
    const data = monthlyRevenue;

    const ctx = document.getElementById('monthlyRevenueChart') as HTMLCanvasElement;

    // create gradient for the line
    const gradient = ctx.getContext('2d')!.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(99,102,241,0.9)');  // indigo-ish
    gradient.addColorStop(1, 'rgba(139,92,246,0.12)'); // soft purple fade

    // create gradient fill under line
    const fillGradient = ctx.getContext('2d')!.createLinearGradient(0, 0, 0, 300);
    fillGradient.addColorStop(0, 'rgba(99,102,241,0.16)');
    fillGradient.addColorStop(1, 'rgba(99,102,241,0)');

    this.monthlyChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Revenue (₹)',
          data,
          fill: true,
          backgroundColor: fillGradient,
          borderColor: gradient,
          pointBackgroundColor: '#fff',
          pointBorderColor: gradient,
          pointRadius: 4,
          tension: 0.32,
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            grid: { display: false },
            ticks: { maxRotation: 0, autoSkip: true }
          },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(148,163,184,0.12)' },
            ticks: {
              callback: (value: any) => `₹${value}`
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx: any) => {
                const val = ctx.parsed.y || 0;
                return `Revenue: ₹${val}`;
              }
            }
          }
        }
      }
    });
  }
}
