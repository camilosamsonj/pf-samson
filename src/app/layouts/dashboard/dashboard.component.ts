import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild, Inject, OnDestroy } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Observable, Subscription } from 'rxjs';
import { IUser } from './pages/users/models'
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild(MatDrawer, {static: true})
  drawer!: MatDrawer;

  authUser$ : Observable<IUser | null> ;
  authUserSubscription?: Subscription;

  constructor(
    private observer: BreakpointObserver,
    
    private authService: AuthService,
    private router: Router) {
        this.authUser$ = this.authService.authUser$;
        
    }

  ngOnInit(): void {
    this.observer.observe(["(max-width: 800px)"])
    .subscribe((res) => {
      if(res.matches) {
        this.drawer.mode="over"
        this.drawer.close();
      } else {
        this.drawer.mode = "side";
        this.drawer.open();
      }
    });
      this.authService.verifyToken();

  }

  ngOnDestroy(): void {
  }

  logout(): void {
    this.authService.logout();
  }

}
