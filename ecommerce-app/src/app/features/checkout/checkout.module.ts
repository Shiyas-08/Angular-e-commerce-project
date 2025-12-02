import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './checkout.component';
import { FormsModule } from '@angular/forms';
import { CheckoutPageComponent } from './checkout-page/checkout-page.component';


@NgModule({
  declarations: [
    CheckoutComponent,
    CheckoutPageComponent
    
  ],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    FormsModule
  ]
})
export class CheckoutModule { }
