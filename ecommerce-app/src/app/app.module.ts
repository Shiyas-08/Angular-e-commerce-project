  import { NgModule } from '@angular/core';
  import { BrowserModule } from '@angular/platform-browser';
  import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
  import { ToastrModule } from 'ngx-toastr'; 

  import { AppRoutingModule } from './app-routing.module';
  import { AppComponent } from './app.component';

  import { FormsModule } from '@angular/forms';
  import { HttpClientModule } from '@angular/common/http';

  import { HideLayoutDirective } from './core/directives/hide-layout.directive';
  import { SharedModule } from './shared/shared.module';
  import { AuthModule } from './features/auth/auth.module';
  import { NotFoundComponent } from './shared/components/not-found/not-found.component';

  import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HideAdminLayoutDirective } from './core/directives/hide-admin-layout.directive';

  @NgModule({
    declarations: [
      AppComponent,
      HideLayoutDirective,
      NotFoundComponent,
     HideAdminLayoutDirective,

    ],
    imports: [
      BrowserModule,
      BrowserAnimationsModule,
      AppRoutingModule,
      FormsModule,
      HttpClientModule,
      AuthModule,
      SharedModule,

      FontAwesomeModule,

      ToastrModule.forRoot({
        timeOut: 1000,
        positionClass: 'toast-top-right',
        preventDuplicates: true
      }),
    ],
    bootstrap: [AppComponent]
  })
  export class AppModule {}
