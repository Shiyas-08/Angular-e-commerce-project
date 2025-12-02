import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './dash-home.component.html',
  styleUrls: ['./dash-home.component.css'],
 
})
export class DashHomeComponent {
  constructor(private auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
