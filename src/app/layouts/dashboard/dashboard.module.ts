import { NgModule } from "@angular/core";
import { DashboardComponent } from "./dashboard.component";
import { StudentsModule } from "./pages/students/students.module";
import { SharedModule } from "../../shared/shared.module";
import { HomeModule } from "./pages/home/home.module";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { CoursesModule } from "./pages/courses/courses.module";
import { UsersModule } from "./pages/users/users.module";
import { EnrollmentModule } from "./pages/enrollment/enrollment.module";
import { CommonModule } from "@angular/common";



@NgModule({
    declarations: [DashboardComponent ],
    imports: [
        CommonModule,
        SharedModule,
        HomeModule,
        DashboardRoutingModule,
        CoursesModule,
        UsersModule,
        EnrollmentModule,
        StudentsModule,
        
    ],

    exports: [DashboardComponent],
})
export class DashboardModule {}