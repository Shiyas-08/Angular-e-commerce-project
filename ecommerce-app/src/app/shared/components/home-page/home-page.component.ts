import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomeComponent {
  images = [
    'assets/banner img/banner1.png',
    'assets/banner img/banner2.png',
    'assets/banner img/banner3.png'
  ];
  currentSlide = 0;
  private slideInterval: any;
    isLoading = true;

  ngOnInit() {

     setTimeout(() => {
      this.isLoading = false;
    }, 800); 
  
    // Auto slide every 3 seconds
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 3000);

  }

  ngOnDestroy() {
    // Stop the interval when component is destroyed
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.images.length;
  }

  prevSlide() {
    this.currentSlide =
      (this.currentSlide - 1 + this.images.length) % this.images.length;
  }
    goToSlide(index: number) {
    this.currentSlide = index;
  }
}


