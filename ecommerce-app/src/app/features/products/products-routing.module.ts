import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductListComponent } from './product-lists/product-lists.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ManageProductsComponent } from './product-management/product-management.component';
import { WisualListComponent } from './wishual-list/wishual-list.component';
import { FeaturedProductsComponent } from './future-products/future-products.component';

import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { AdminGuard } from 'src/app/core/guards/admin.guard';

const routes: Routes = [
  // PUBLIC ROUTES (NO LOGIN)
  { path: '', component: ProductListComponent },
  { path: 'details/:id', component: ProductDetailsComponent },

  //  USER ONLY ROUTES (LOGIN REQUIRED)
  { path: 'wishlist', component: WisualListComponent, canActivate: [AuthGuard] },
  { path: 'featured', component: FeaturedProductsComponent, canActivate: [AuthGuard] },

  //  ADMIN ONLY ROUTE
  { path: 'admin/manage', component: ManageProductsComponent, canActivate: [AdminGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule {}
