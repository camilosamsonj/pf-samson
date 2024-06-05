import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/admin.guard';

const routes: Routes = [
  
    {
    path: 'home',
    data: {
      title: 'Inicio'
    },
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
  },

  {
    path: 'students',
    data: {
      title: 'Alumnos'
    },
    loadChildren: () =>
        import('./pages/students/students.module').then((m) => m.StudentsModule),
  },
  {
    path: 'courses',
    data: {
      title: 'Cursos'
    },
    loadChildren: ()=>
        import('./pages/courses/courses.module').then((m)=>m.CoursesModule),
  },
  {
    path: 'enrollment',
    data: {
      title: 'Inscripciones'
    },
    loadChildren: ()=>
      import('./pages/enrollment/enrollment.module').then((m)=>m.EnrollmentModule)
  },
  {
    path: 'users',
    canActivate: [adminGuard],
    data: {
      title: 'Usuarios'
    },
    loadChildren: ()=>
      import('./pages/users/users.module').then((m)=>m.UsersModule)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',

  },
  {
    path: '**',
    redirectTo: 'home',

  }


 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
