import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from 'src/app/core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  total = 0;

  constructor(private cartService: CartService, private toastr: ToastrService,private router:Router) {}

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  calculateTotal(): void {
    this.total = this.cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  }

  increaseQty(item: CartItem) {
    item.quantity = (item.quantity || 1) + 1;
    this.cartService.updateCartItemQuantity(item.id!, item.quantity).subscribe(() => this.calculateTotal());
  }

  decreaseQty(item: CartItem) {
    if ((item.quantity || 1) > 1) {
      item.quantity = (item.quantity || 1) - 1;
      this.cartService.updateCartItemQuantity(item.id!, item.quantity).subscribe(() => this.calculateTotal());
    }
  }

  removeItem(item: CartItem) {
    if (!item.id) return;
    this.cartService.removeFromCart(item.id).subscribe(() => {
      this.toastr.error('Cart item deleted successfully!', 'Deleted ', {
        timeOut: 1000,
        positionClass: 'toast-top-right'
      });
    });
  }
    goToCheckout() {
    if (this.cartItems.length === 0) {
      this.toastr.warning('Your cart is empty!', 'Cannot Checkout');
      return;
    }
    this.router.navigate(['/checkout'], { queryParams: { from: 'cart' } });
  }
}
