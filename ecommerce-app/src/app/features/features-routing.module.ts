import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard } from '../core/guards/admin.guard';
import { AuthGuard } from '../core/guards/auth.guard';

import { DashHomeComponent } from '../shared/components/dashboard/dash-home/dash-home.component';
import { AdminDashboardComponent } from '../shared/components/dashboard/dashboard.component';

import { ManageProductsComponent } from './products/product-management/product-management.component';
import { ManageOrdersComponent } from './orders/order-management/order-management.component';

const routes: Routes = [

  //user routes 
  {
    path: 'about',
    loadChildren: () => import('../shared/about/about.module').then(m => m.AboutModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./cart/cart.module').then(m => m.CartModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'checkout',
    loadChildren: () => import('./checkout/checkout.module').then(m => m.CheckoutModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'orders',
    loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule),
    canActivate: [AuthGuard]
  },

  //admin routes 
  {
    path: 'admin',
    component: DashHomeComponent,   
    canActivate: [AdminGuard],
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'products', component: ManageProductsComponent },
      { path: 'orders', component: ManageOrdersComponent },

      //Lazy Users Module
      {
        path: 'users',
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturesRoutingModule {}
