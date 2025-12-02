import { Component, OnInit } from '@angular/core';
import { OrderService, Order } from 'src/app/core/services/order.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {

  orders: Order[] = [];
  trackingSteps = ['Order Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

  constructor(
    private orderService: OrderService,
    private auth: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const userId = this.auth.getUserId();
    if (userId) this.loadOrders(userId);
  }

  loadOrders(userId: string) {
    this.orderService.getOrdersByUser(userId).subscribe({
      next: res => this.orders = res.reverse(),
      error: err => console.log(err)
    });
  }

  isStepCompleted(order: Order, step: string): boolean {
    return this.trackingSteps.indexOf(order.status) >= this.trackingSteps.indexOf(step);
  }

  getProgress(order: Order): number {
    return ((this.trackingSteps.indexOf(order.status) + 1) / this.trackingSteps.length) * 100;
  }

  cancelOrder(order: Order) {
    if (order.status === 'Delivered' || order.status === 'Cancelled') {
      this.toastr.warning("Order can't be cancelled!");
      return;
    }

    this.orderService.updateOrderStatus(order.id!, 'Cancelled').subscribe(() => {
      order.status = 'Cancelled';
      this.toastr.info('Order cancelled successfully.');
    });
  }
}
