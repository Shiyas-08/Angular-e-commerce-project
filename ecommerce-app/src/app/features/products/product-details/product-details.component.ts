import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/core/services/product.service';
import { Product } from 'src/app/core/models/product.model';
import { CartService } from 'src/app/core/services/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product!: Product;
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private ps: ProductService,
    private cartService: CartService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
  const rawId = this.route.snapshot.paramMap.get('id');
  if (!rawId) {
    this.toastr.error('Invalid product ID');
    return;
  }

  // Don't force it to Number
  this.ps.getProductById(rawId).subscribe({
    next: (res: Product) => {
      this.product = res;
    },
    error: (err) => {
      console.error('Error loading product details:', err);
      this.toastr.error('Product not found', 'Error');
    },
  });
}


  increaseQty() {
    this.quantity++;
  }

  decreaseQty() {
    if (this.quantity > 1) this.quantity--;
  }

  addToCart() {
    if (!this.product) {
      this.toastr.warning('Product not loaded yet. Please wait.');
      return;
    }

    const cartItem = {
      ...this.product,
      quantity: this.quantity
    };

    this.cartService.addToCart(cartItem).subscribe(() => {
      this.toastr.success(
        `${this.quantity} × ${this.product.name} added to cart! `
      );
    });
  }

  buyNow() {
    if (!this.product) {
      this.toastr.warning('Product not loaded yet. Please wait.');
      return;
    }

    const buyNowItem = {
      ...this.product,
      quantity: this.quantity
    };

    localStorage.setItem('buyNowProduct', JSON.stringify(buyNowItem));

    this.toastr.info(
      `Proceeding to buy ${this.quantity} × ${this.product.name}`,
      'Buy Now'
    );

    this.router.navigate(['/checkout'], { queryParams: { from: 'buy-now' } });
  }

  getTotal(item: any) {
    return item.price * item.quantity;
  }
}
