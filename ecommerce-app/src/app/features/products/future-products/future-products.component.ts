import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/core/services/product.service';
import { Router } from '@angular/router';
import { Product } from 'src/app/core/models/product.model';

@Component({
  selector: 'app-featured-products',
  templateUrl: './future-products.component.html',
  styleUrls: ['./future-products.component.css']
})
export class FeaturedProductsComponent implements OnInit {
  featuredProducts: Product[] = [];

  constructor(private ps: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.ps.getProducts().subscribe({
      next: (res: Product[]) => {
        this.featuredProducts = res.filter(p => p.isFeatured);
      },
      error: (err) => console.error('Error loading featured products', err)
    });
  }

viewDetails(productId: string | number) {
  this.router.navigate(['products/details', productId]);
}
}
