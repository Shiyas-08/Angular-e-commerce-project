import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, map, catchError, of } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role?: 'user' | 'admin';
  isBlocked?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userApi = 'http://localhost:3000/users';
  private adminApi = 'http://localhost:3000/admins';
  private tokenKey = 'authToken';
  private userKey = 'currentUser';
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    const id = this.getUserId();
    const token = localStorage.getItem(this.tokenKey);

    if (id && token) {
      const adminReq = this.http.get<User>(`${this.adminApi}/${id}`).pipe(
        catchError(() => of(null))
      );
      const userReq = this.http.get<User>(`${this.userApi}/${id}`).pipe(
        catchError(() => of(null))
      );

      forkJoin([adminReq, userReq]).subscribe({
        next: ([adminData, userData]) => {
          //  Give admin priority
          const found: User | null = adminData?.id
            ? { ...adminData, role: 'admin' as const }
            : userData?.id
              ? { ...userData, role: 'user' as const }
              : null;
          this.userSubject.next(found);
        },
        error: () => this.userSubject.next(null)
      });
    }
  }

  // Register user 
  registerUser(userData: Partial<User>): Observable<User> {
    const finalUser = { ...userData, role: (userData.role || 'user') as 'user' };
    return this.http.post<User>(this.userApi, finalUser);
  }

  //  Login for both user & admin
  loginUser(email: string, password: string): Observable<User | null> {
    const userReq = this.http.get<User[]>(`${this.userApi}?email=${email}&password=${password}`);
    const adminReq = this.http.get<User[]>(`${this.adminApi}?email=${email}&password=${password}`);

    return forkJoin([userReq, adminReq]).pipe(
      map(([users, admins]) => {
        let found: User | null = null;

        //Admin first
        if (admins.length > 0) {
          found = { ...admins[0], role: 'admin' as const };
        } else if (users.length > 0) {
          found = { ...users[0], role: 'user' as const };

          //  Check if user is blocked
          if (found.isBlocked) {
            console.warn('Blocked user tried to log in:', found.email);
            throw new Error('BLOCKED_USER');
          }
        }

        if (found) {
          const token = this.generateToken();
          localStorage.setItem(this.tokenKey, token);
          localStorage.setItem(this.userKey, JSON.stringify({ id: String(found.id), role: found.role }));
          this.userSubject.next(found);
          return found;
        }

        return null;
      }),
      catchError((err) => {
        if (err.message === 'BLOCKED_USER') {
          //  Return "blocked user" info for toastr
          return of({ id: '', name: '', email: '', role: 'user', isBlocked: true } as User);
        }
        return of(null);
      })
    );
  }

  private generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  getUserId(): string | null {
    try {
      const raw = localStorage.getItem(this.userKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.id) return String(parsed.id).trim();
      }
      return null;
    } catch {
      return null;
    }
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  getRole(): 'user' | 'admin' | null {
    const user = this.getCurrentUser();
    return user?.role || null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.userSubject.next(null);
  }
}
