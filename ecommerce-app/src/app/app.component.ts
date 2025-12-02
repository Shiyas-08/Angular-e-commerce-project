import { Component,OnInit } from '@angular/core';
import { ProductService } from './core/services/product.service';
import { Router, NavigationEnd } from '@angular/router';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

title = 'E-commerce-project';
isAuthPage() {
  return location.pathname === '/login' || location.pathname === '/register';
}


  showLayout = true;

  constructor(private router: Router)  {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const hiddenRoutes = ['/auth/login', '/auth/register'];
        this.showLayout = !hiddenRoutes.includes(event.url);
      }
    });
  }

}