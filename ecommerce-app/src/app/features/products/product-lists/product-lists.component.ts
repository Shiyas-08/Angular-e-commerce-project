import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/core/services/product.service';
import { Product } from 'src/app/core/models/product.model';
import { Router, ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { WisualListService } from 'src/app/core/services/wishual-list.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-lists.component.html',
  styleUrls: ['./product-lists.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = true;

  searchTerm = '';
  categoryFilter = '';
  sortOption = '';

  categories: string[] = [];

  currentPage = 1;
  itemsPerPage = 9;
  totalPages = 0;

  constructor(
    private ps: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private cartService: CartService,
    private toastr: ToastrService,
    public visualListService: WisualListService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProducts();

    // Listen to search query param
    this.route.queryParams.subscribe(params => {
      const q = params['q'];
      if (q) {
        this.searchTerm = q;
        this.currentPage = 1;

        // scroll to top when coming from navbar search
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  loadProducts() {
    this.ps.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.categories = Array.from(
          new Set(this.products.map(p => p.category).filter((cat): cat is string => !!cat))
        );
        this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.loading = false;
      }
    });
  }

  filteredProducts(): Product[] {
    let filtered = this.products;

    // Search filter
    if (this.searchTerm.trim()) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (p.category?.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (p.description?.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (this.categoryFilter) {
      filtered = filtered.filter(p => p.category === this.categoryFilter);
    }

    // Sorting
    if (this.sortOption === 'priceLow') {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (this.sortOption === 'priceHigh') {
      filtered = filtered.sort((a, b) => b.price - a.price);
    } else if (this.sortOption === 'ratingHigh') {
      filtered = filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;

    return filtered.slice(start, start + this.itemsPerPage);
  }

  // ⭐ FIXED: Scroll to top on pagination
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onSearchChange() {
    this.currentPage = 1;
  }

  onCategoryChange() {
    this.currentPage = 1;
  }

  onSortChange() {
    this.currentPage = 1;
  }

  viewDetails(id: number) {
    this.router.navigate(['/products/details', id]);
  }

  addToCart(product: Product) {
    if (!this.authService.isLoggedIn()) {
      this.toastr.warning('Please log in to add products to cart.');
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.addToCart(product).subscribe({
      next: () => this.toastr.success(`${product.name} added to cart`),
      error: () => this.toastr.error('Failed to add to cart')
    });
  }

  toggleVisualList(product: Product) {
    if (!this.authService.isLoggedIn()) {
      this.toastr.warning('Please log in to use wishlist.');
      this.router.navigate(['/login']);
      return;
    }
    this.visualListService.toggleProduct(product);
  }

  applyFilters() {
    this.currentPage = 1;
  }

  clearFilters() {
    this.searchTerm = '';
    this.categoryFilter = '';
    this.sortOption = '';
    this.currentPage = 1;

    this.ps.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
      }
    });
  }
}
