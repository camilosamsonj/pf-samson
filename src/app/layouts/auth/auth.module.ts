import { NgModule } from '@angular/core';
import { AuthComponent } from './auth.component';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';
import { AuthRoutingModule } from './auth-routing.module';




@NgModule({
  declarations: [
    AuthComponent,
    RegisterComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
