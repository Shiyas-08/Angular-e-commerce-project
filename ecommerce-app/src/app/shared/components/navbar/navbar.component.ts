import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { CartService } from 'src/app/core/services/cart.service';
import { WisualListService } from 'src/app/core/services/wishual-list.service';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { faCartShopping, faUser } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

showUserPopup = false;

openUserPopup() {
  this.showUserPopup = true;
}

closeUserPopup() {
  this.showUserPopup = false;
}

logoutFromPopup() {
  this.logout();
  this.closeUserPopup();
}



  
  showSearch = false;
  showDropdown = false;
  showMobileMenu = false;
  cartCount = 0;
  visualListCount = 0;
  isLoggedIn = false;
  userData: any = null;

  searchQuery: string = '';
  private subs: Subscription[] = [];
  isLoading = true;
    constructor(
    private authService: AuthService,
    private router: Router,
    private cartService: CartService,
    private visualListService: WisualListService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.listenToAuthChanges();  
    this.listenToServices();
      setTimeout(() => {
      this.isLoading = false;
    }, 800); // 0.8 seconds
  
  }

  listenToAuthChanges() {
    const authSub = this.authService.user$.subscribe(user => {
      if (user) {
        this.isLoggedIn = true;
        // fetch user details if needed
        this.http.get(`http://localhost:3000/users/${user.id}`).subscribe(u => this.userData = u);
      } else {
        this.isLoggedIn = false;
        this.userData = null;
      }
    });
    this.subs.push(authSub);
  }

  listenToServices() {
    const cartSub = this.cartService.cart$.subscribe(cart => {
      const userId = this.authService.getUserId();
      this.cartCount = cart.filter(item => item.userId === userId).length;
    });
    this.subs.push(cartSub);

    const visualSub = this.visualListService.visualList$.subscribe(list => {
      const userId = this.authService.getUserId();
      this.visualListCount = list.filter(item => item.userId === userId).length;
    });
    this.subs.push(visualSub);

    // initial load
    this.cartService.loadCart();
    this.visualListService.loadVisualList();
  }

  toggleSearch() { this.showSearch = !this.showSearch; }
  toggleDropdown() { this.showDropdown = !this.showDropdown; }
  toggleMobileMenu() { this.showMobileMenu = !this.showMobileMenu; }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.userData = null;
    this.showDropdown = false;
    this.router.navigate(['/login']);
  }

  onSearch() {
    const query = this.searchQuery.trim();
    if (query) {
      this.router.navigate(['/products'], { queryParams: { q: query } });
      this.showSearch = false;
      this.searchQuery = '';
    }
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }
}
