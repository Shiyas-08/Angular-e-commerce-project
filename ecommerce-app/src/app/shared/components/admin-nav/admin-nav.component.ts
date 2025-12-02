import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService, User } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-nav.component.html',
  styleUrls: ['./admin-nav.component.css']
})
export class AdminNavbarComponent implements OnInit {
  adminName = '';
  adminEmail = '';
  dropdownOpen = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();
    if (user && user.role === 'admin') {
      this.adminName = user.name || 'Admin';
      this.adminEmail = user.email || '';
    }
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event): void {
    const target = event.target as HTMLElement;
    // Close only if clicking outside button or dropdown
    if (!target.closest('button') && !target.closest('.dropdown-menu')) {
      this.dropdownOpen = false;
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
