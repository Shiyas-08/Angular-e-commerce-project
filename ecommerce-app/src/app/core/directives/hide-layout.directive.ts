import { Directive, ElementRef, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Directive({
  selector: '[appHideLayout]'  // USER NAV + FOOTER
})
export class HideLayoutDirective implements OnInit {

  private hideUserOnRoutes = ['/admin'];   // hide user navbar in admin pages

  constructor(private el: ElementRef, private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;

        // If route starts with /login or /register or /admin → hide user navbar
        const shouldHide =
          url.startsWith('/login') ||
          url.startsWith('/register') ||
          url.startsWith('/admin');

        this.el.nativeElement.style.display = shouldHide ? 'none' : '';
      }
    });
  }
}
