import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  canActivate(): boolean {
    const user = this.auth.getCurrentUser();

    if (user && user.role === 'admin') {
      return true;
    }

    this.router.navigate(['/login']);
        this.toastr.error('Admin access only!', 'Access Denied');

    return false;
  }
}
