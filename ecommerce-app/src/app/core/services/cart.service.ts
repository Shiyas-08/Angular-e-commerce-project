// src/app/core/services/cart.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';
import { Product } from '../models/product.model';
import { AuthService } from './auth.service';

export interface CartItem {
  id?: number;
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  userId: string;
  category?: string;   
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3000/cart';
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient, private auth: AuthService) {
    this.auth.user$.subscribe(() => this.loadCart());
  }

  loadCart() {
    const userId = this.auth.getUserId();
    if (!userId) {
      this.cartSubject.next([]);
      return;
    }

    this.http.get<CartItem[]>(`${this.apiUrl}?userId=${userId}`).subscribe({
      next: (items) => this.cartSubject.next(items),
      error: () => this.cartSubject.next([])
    });
  }

  getCartItems(): Observable<CartItem[]> {
    this.loadCart();
    return this.cart$;
  }

  addToCart(product: Product): Observable<any> {
  const userId = String(this.auth.getUserId());
  if (!userId) return of(null);

  const productId = String(product.id);

  //  ALWAYS FETCH FULL PRODUCT FROM DB to get category
  return this.http.get<Product>(`http://localhost:3000/products/${productId}`).pipe(
    switchMap(fullProduct => {
      const selectedQty = product.quantity && product.quantity > 0 ? product.quantity : 1;

      return this.http.get<CartItem[]>(`${this.apiUrl}?userId=${userId}`).pipe(
        switchMap(cartItems => {
          const existing = cartItems.find(i => String(i.productId) === productId);

          if (existing) {
            const newQty = existing.quantity + selectedQty;
            return this.http.patch(`${this.apiUrl}/${existing.id}`, { quantity: newQty }).pipe(
              tap(() => this.loadCart())
            );
          }

          const newItem: CartItem = {
            productId,
            name: fullProduct.name,
            price: fullProduct.price,
            image: fullProduct.image,
            userId,
            quantity: selectedQty,
            category: fullProduct.category || 'Unknown'   
          };

          return this.http.post<CartItem>(this.apiUrl, newItem).pipe(
            tap(() => this.loadCart())
          );
        })
      );
    })
  );
}


  removeFromCart(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(tap(() => this.loadCart()));
  }

  updateCartItemQuantity(id: number, quantity: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}`, { quantity }).pipe(
      tap(() => this.loadCart())
    );
  }

  getCartCount(): number {
    return this.cartSubject.value.length;
  }

  removeProductFromCarts(productId: string): void {
    this.http.get<CartItem[]>(`${this.apiUrl}?productId=${productId}`).subscribe({
      next: (items) => {
        items.forEach((item) => {
          this.http.delete(`${this.apiUrl}/${item.id}`).subscribe(() => this.loadCart());
        });
      }
    });
  }
}
