import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/core/services/product.service';
import { Product } from 'src/app/core/models/product.model';
import { ToastrService } from 'ngx-toastr';
import { CartService } from 'src/app/core/services/cart.service';

@Component({
  selector: 'app-manage-products',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css'],
})
export class ManageProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = false;
  searchText: string = '';

  showAddModal = false;
  showEditModal = false;

  showDeleteModal = false;
  deleteId: number | string | null = null;

  newProduct: Partial<Product> = {
    name: '',
    price: 0,
    description: '',
    category: '',
    image: '',
    rating: 0,
    quantity: 1,
    isFeatured: false,
    videoUrl: '',
  };

  editProductData: Partial<Product> = {};

  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  /** Load all products */
  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.products = res;
        this.filteredProducts = [...this.products];
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Failed to load products', 'Error');
        this.loading = false;
      },
    });
  }

  /** Search filter */
  filterProducts(): void {
    const query = this.searchText.toLowerCase().trim();

    if (!query) {
      this.filteredProducts = [...this.products];
      return;
    }

    this.filteredProducts = this.products.filter(
      (p) =>
        p.name?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query)
    );
  }

  /** Add Modal */
  openAddModal(): void {
    this.newProduct = {
      name: '',
      price: 0,
      description: '',
      category: '',
      image: '',
      rating: 0,
      quantity: 1,
      isFeatured: false,
      videoUrl: '',
    };
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  /** Save Product */
  saveProduct(): void {
    const { name, price, description, category, image } = this.newProduct;
    if (!name || !price || !description || !category || !image) {
      this.toastr.warning('All fields are required', 'Warning');
      return;
    }

    this.productService.addProduct(this.newProduct as Product).subscribe({
      next: (res) => {
        this.products.push(res);
        this.filteredProducts = [...this.products];
        this.showAddModal = false;
        this.toastr.success('Product added successfully!', 'Success');
      },
      error: () => this.toastr.error('Failed to add product', 'Error'),
    });
  }

  /** Edit Product */
  openEditModal(product: Product): void {
    this.editProductData = { ...product };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  updateProduct(): void {
    if (!this.editProductData.id) return;

    this.productService
      .updateProduct(this.editProductData.id, this.editProductData)
      .subscribe({
        next: (res) => {
          const index = this.products.findIndex((p) => p.id === res.id);
          if (index !== -1) this.products[index] = res;

          this.filteredProducts = [...this.products];
          this.showEditModal = false;
          this.toastr.success('Product updated successfully', 'Success');
        },
        error: () => this.toastr.error('Failed to update product', 'Error'),
      });
  }


  //  Open Delete Modal
  openDeleteModal(id: number | string): void {
    this.deleteId = id;
    this.showDeleteModal = true;
  }

  // Close Delete Modal
  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.deleteId = null;
  }

  // Confirm Delete 
  confirmDelete(): void {
    if (!this.deleteId) return;

    this.productService.deleteProduct(this.deleteId).subscribe({
      next: () => {
        // — Remove from product list
        this.products = this.products.filter((p) => p.id !== this.deleteId);
        this.filteredProducts = [...this.products];

        // Remove from all carts
        this.cartService.getCartItems().subscribe((cartItems) => {
          cartItems.forEach((item) => {
            if (String(item.productId) === String(this.deleteId)) {
              this.cartService.removeFromCart(item.id!).subscribe();
            }
          });
        });

        this.toastr.success('Product deleted successfully!', 'Deleted');

        this.showDeleteModal = false;
        this.deleteId = null;
      },
      error: () => this.toastr.error('Failed to delete product', 'Error'),
    });
  }
}
