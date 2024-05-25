import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { AuthComponent } from './layouts/auth/auth.component';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [

  {
    path: 'dashboard',
    // canActivate: [authGuard],
    component: DashboardComponent,
    loadChildren: ()=> 
      import('./layouts/dashboard/dashboard.module')
    .then((m)=>m.DashboardModule),
  },
  {
    path: 'auth',
    component: AuthComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth',
  },
  {
    path: '**',
    redirectTo: 'auth',
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
