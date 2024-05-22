import { NgModule } from '@angular/core';
import { UsersComponent } from './users.component';
import { UsersDialogComponent } from './components/users-dialog/users-dialog.component';
import { SharedModule } from '../../../../shared/shared.module'; 
import { UsersRoutingModule } from './users-routing-module';
import { UserDetailComponent } from './pages/user-detail/user-detail.component';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    UsersComponent,
    UsersDialogComponent,
    UsersDialogComponent,
    UserDetailComponent,

  ],
  imports: [
    CommonModule,
    SharedModule,
    UsersRoutingModule,
  ]
})
export class UsersModule { }
