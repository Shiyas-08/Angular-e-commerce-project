import { Component, OnInit } from '@angular/core';
import { WisualListService } from 'src/app/core/services/wishual-list.service';
import { Router } from '@angular/router';
import { Product } from 'src/app/core/models/product.model';
import { CartService } from 'src/app/core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-visual-list',
  templateUrl: './wishual-list.component.html',
  styleUrls: ['./wishual-list.component.css']
})
export class WisualListComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private visualListService: WisualListService,
    private cartService: CartService,
    private toastr: ToastrService,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.auth.getUserId();
    if (!userId) {
      this.toastr.warning('Please login to view your wishlist');
      this.router.navigate(['/login']);
      return;
    }

    this.visualListService.visualList$.subscribe(res => {
      // Filter only current user’s visual list items
      const userItems = res.filter(item => item.userId === userId);
      
      // Convert VisualItem[] → Product[]
      this.products = userItems.map(item => ({
        id: Number(item.productId), //  Convert string → number
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1 // optional for cart
      }));
    });
  }


 viewDetails(id: number) {
  this.router.navigate(['/products/details', id]);
}
  addToCart(product: Product) {
    const userId = this.auth.getUserId();
    if (!userId) {
      this.toastr.warning('Please login to add products to cart');
      this.router.navigate(['/login']);
      return;
    }

    // No need to subscribe, BehaviorSubject updates instantly
    this.cartService.addToCart(product);
    this.toastr.success(`${product.name} added to cart!`);
  }

removeFromVisualList(productId: number) {
  this.visualListService.removeProduct(productId);
  this.toastr.info('Removed from visual list');
}

}





