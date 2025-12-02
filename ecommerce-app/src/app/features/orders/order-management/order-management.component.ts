import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OrderService, Order } from 'src/app/core/services/order.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-manage-orders',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.css']
})
export class ManageOrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  loading = false;
  selectedOrder: Order | null = null;

  // Order status options
  orderStatuses: string[] = [
    'Pending',
    'Order Placed',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered'
  ];

  constructor(
    private orderService: OrderService,
    private toastr: ToastrService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  // Load all orders 
  loadOrders(): void {
    this.loading = true;
    this.http.get<Order[]>('http://localhost:3000/orders').subscribe({
      next: (orders) => {
        this.orders = orders.reverse();
        this.filteredOrders = [...this.orders];
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Failed to load orders', 'Error');
        this.loading = false;
      },
    });
  }

  // Change status
  changeStatus(order: Order, newStatus: string): void {
    if (!order.id) return;

    this.orderService.updateOrderStatus(order.id, newStatus).subscribe({
      next: (updatedOrder) => {
        order.status = updatedOrder.status;
        this.toastr.success(`Status updated to "${newStatus}"`);
      },
      error: () => this.toastr.error('Failed to update order status'),
    });
  }

  //  View order details 
  viewOrder(order: Order): void {
    this.selectedOrder = order;
  }

  // /Close modal 
  closeModal(): void {
    this.selectedOrder = null;
  }
}
