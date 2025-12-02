
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface VisualItem {
  id?: number;
  productId: number;
  name: string;
  price: number;
  image?: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class WisualListService {
  private apiUrl = 'http://localhost:3000/visualList';
  private visualSubject = new BehaviorSubject<VisualItem[]>([]);
  visualList$ = this.visualSubject.asObservable();

  constructor(private http: HttpClient, private auth: AuthService) {

    this.auth.user$.subscribe(() => this.loadVisualList());
      this.auth.user$.subscribe(() => {
    this.loadVisualList(); // reload when user changes
  });
  }

  loadVisualList() {
    const userId = this.auth.getUserId();
    if (!userId) {
      this.visualSubject.next([]);
      return;
    }

    this.http.get<VisualItem[]>(`${this.apiUrl}?userId=${userId}`)
      .subscribe(items => this.visualSubject.next(items));
  }

  toggleProduct(product: any) {
    const userId = this.auth.getUserId();
    if (!userId) return;

    const current = this.visualSubject.value;
    const existing = current.find(p => p.productId === product.id && p.userId === userId);

    if (existing?.id) {
      this.http.delete(`${this.apiUrl}/${existing.id}`)
        .subscribe(() => this.loadVisualList());
    } else {
      const newItem: VisualItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        userId
      };
      this.http.post<VisualItem>(this.apiUrl, newItem)
        .subscribe(() => this.loadVisualList());
    }
  }

removeProduct(productId: number): void {
  const userId = this.auth.getUserId();
  if (!userId) return;

  // Find the visual list item for this user and product
  const target = this.visualSubject.value.find(
    (item) => item.userId === userId && Number(item.productId) === productId
  );

  if (target?.id) {
    this.http.delete(`${this.apiUrl}/${target.id}`).subscribe(() => {
      // After deleting, refresh the visual list
      this.loadVisualList();
    });
  }
}


  getCount() {
    return this.visualSubject.value.length;
  }

  isInVisualList(productId: number) {
    const userId = this.auth.getUserId();
    if (!userId) return false;
    return this.visualSubject.value.some(item => item.productId === productId && item.userId === userId);
  }
}
