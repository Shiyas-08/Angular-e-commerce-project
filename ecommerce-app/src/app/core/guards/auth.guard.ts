import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  canActivate(): boolean {
    const user = this.auth.getCurrentUser();

    if (user && user.role === 'user') {
      return true;
    }

    // 🔥 Toastr message
    this.toastr.warning(
      'Please login first to continue',
      'Login Required',
      {
        timeOut: 1500,
        positionClass: 'toast-top-right'
      }
    );

    // redirect to login
    this.router.navigate(['/login']);
    return false;
  }
}
