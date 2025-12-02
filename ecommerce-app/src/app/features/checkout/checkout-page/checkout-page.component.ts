import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/core/services/cart.service';
import { OrderService } from 'src/app/core/services/order.service';
import { ToastrService } from 'ngx-toastr';
import { WisualListService } from 'src/app/core/services/wishual-list.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css']
})
export class CheckoutPageComponent {
//   checkoutItems: any[] = [];
//   fromBuyNow = false;
//   paymentMethod: string = 'COD';
//   upiId: string = '';
//   loading = false;

//   addressModel = {
//     fullName: '',
//     phone: '',
//     address: '',
//     city: '',
//     state: '',
//     pincode: ''
//   };

//   states: string[] = [
//     'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
//     'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
//     'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
//     'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
//     'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
//     'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
//     'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
//     'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
//   ];

//   constructor(
//     private route: ActivatedRoute,
//     private cartService: CartService,
//     private orderService: OrderService,
//     private toastr: ToastrService,
//     private router: Router,
//     private vishuallist:WisualListService,
//     private authService: AuthService
//   ) {}

//   ngOnInit(): void {
//     const from = this.route.snapshot.queryParamMap.get('from');

//     if (from === 'buy-now') {
//       this.fromBuyNow = true;
//       const raw = localStorage.getItem('buyNowProduct');

//       if (raw) {
//         try {
//           const p = JSON.parse(raw);
//           p.quantity = p.quantity ?? 1;
//           p.productId = p.productId ?? p.id ?? String(p.id);
//           this.checkoutItems = [p];
//         } catch {
//           this.checkoutItems = [];
//         }
//       } else {
//         this.loadCartItems();
//       }
//     } else {
//       this.loadCartItems();
//     }
//   }

//   private loadCartItems() {
//     this.cartService.getCartItems().subscribe(items => {
//       this.checkoutItems = items.map(i => ({ ...i }));
//     });
//   }

//   getTotal(): number {
//     return this.checkoutItems.reduce((s, it) => s + (it.price * (it.quantity || 1)), 0);
//   }

//   placeOrder() {
//     if (
//       !this.addressModel.fullName ||
//       !this.addressModel.phone ||
//       !this.addressModel.address ||
//       !this.addressModel.city ||
//       !this.addressModel.state ||
//       !this.addressModel.pincode
//     ) {
//       this.toastr.warning('Please fill all address details.');
//       return;
//     }

//     if (this.checkoutItems.length === 0) {
//       this.toastr.warning('No items to checkout');
//       return;
//     }

//     this.loading = true;

//     const userId = this.authService.getUserId();
//     if (!userId) {
//       this.toastr.error('Please log in to place an order.');
//       this.router.navigate(['/login']);
//       return;
//     }

//     // ⭐ FINAL: CATEGORY INCLUDED HERE
//     const orderPayload = {
//       id: this.generateId(),
//       userId: String(userId).trim(),
//       items: this.checkoutItems.map(it => ({
//         productId: String(it.productId ?? it.id),
//         name: it.name,
//         price: it.price,
//         quantity: it.quantity || 1,
//         image: it.image || '',
//         category: it.category || 'Unknown'   // ⭐ add category
//       })),
//       total: this.getTotal(),
//       address: this.addressModel,
//       paymentMethod: this.paymentMethod,
//       date: new Date().toISOString(),
//       status: 'Pending'
//     };

//     this.orderService.createOrder(orderPayload).subscribe({
//       next: () => {
//         if (this.fromBuyNow) {
//           localStorage.removeItem('buyNowProduct');
//         } else {
//           this.checkoutItems.forEach((it: any) => {
//             if (it.id) this.cartService.removeFromCart(it.id).subscribe();
//           });
//         }

//         this.toastr.success('Order placed successfully!');
//         this.loading = false;
//         this.router.navigate(['/orders']);
//       },
//       error: (err) => {
//         console.error(err);
//         this.loading = false;
//         this.toastr.error('Failed to place order. Try again.');
//       }
//     });
//   }

//   showStateDropdown = false;

//   toggleStateDropdown() {
//     this.showStateDropdown = !this.showStateDropdown;
//   }

//   selectState(state: string) {
//     this.addressModel.state = state;
//     this.showStateDropdown = false;
//   }

//   private generateId(): string {
//     return Math.random().toString(16).slice(2, 8);
//   }
// }
}