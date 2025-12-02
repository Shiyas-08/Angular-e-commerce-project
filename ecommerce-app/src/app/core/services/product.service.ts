import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private api = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  //  User Side
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.api);
  }

  getFeatured(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.api}?isFeatured=true`);
  }

  getProductById(id: number | string): Observable<Product> {
    return this.http.get<Product>(`${this.api}/${id}`);
  }

  //  Admin Side
  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.api, product);
  }

  updateProduct(id: number | string, productData: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.api}/${id}`, productData);
  }

  deleteProduct(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
