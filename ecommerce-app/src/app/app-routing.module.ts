import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // AUTH MODULE 
  {
    path: '',
    loadChildren: () =>
      import('./features/auth/auth.module').then(m => m.AuthModule)
  },

  //  SHARED MODUL
  {
    path: '',
    loadChildren: () =>
      import('./shared/shared.module').then(m => m.SharedModule)
  },

  // FEATURE MODULES 
  {
    path: '',
    loadChildren: () =>
      import('./features/features.module').then(m => m.FeaturesModule)
  },

  
  { path: '**', redirectTo: 'not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
        scrollPositionRestoration: 'top'

  })],

  exports: [RouterModule]
})
export class AppRoutingModule {}
