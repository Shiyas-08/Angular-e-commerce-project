import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UsersRoutingModule } from './users-routing.module';

import { UsersComponent } from './users.component';
import { ManageUsersComponent } from './user-management/user-management.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    UsersComponent,
    ManageUsersComponent,
  ],
  imports: [
    CommonModule,  
    FormsModule,  
    UsersRoutingModule,
    SharedModule
  ]
})
export class UsersModule { }
