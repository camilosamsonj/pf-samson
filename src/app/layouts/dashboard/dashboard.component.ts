import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Observable, filter, map } from 'rxjs';
import { IUser } from './pages/users/models';
import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute, Data, NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../store/auth/auth.selectors';
import { logout } from '../../store/auth/auth.actions';
import { SweetAlertService } from '../../core/services/sweet-alert.service';
import { TimeAndDateService } from '../../core/services/time-and-date.service';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild(MatDrawer, { static: true })
  drawer!: MatDrawer;

  
  authUser$: Observable<IUser | null>;

  routeData$: Observable<Data | undefined>;

  currentTime: Observable<Date>;
  currentDate: Observable<Date>;


  constructor(
    private observer: BreakpointObserver,

    private authService: AuthService,
    private router: Router,
    private store: Store,
    private sweetAlertService: SweetAlertService,
    private route: ActivatedRoute,
    private timeAndDateService: TimeAndDateService,
  ) {
    this.authUser$ = this.store.select(selectAuthUser);
    this.routeData$ = router.events.pipe(
      filter((ev) => ev instanceof NavigationEnd),
      map(() => route.firstChild?.snapshot.data)
    );
    this.currentTime = this.timeAndDateService.getCurrentTime();
    this.currentDate = this.timeAndDateService.getCurrentDate();

  }

  ngOnInit(): void {
    this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
      if (res.matches) {
        this.drawer.mode = 'over';
        this.drawer.close();
      } else {
        this.drawer.mode = 'side';
        this.drawer.open();
      }
    });
    this.authService.verifyToken();
   
  }

  logout(): void {
    this.store.dispatch(logout());
    this.sweetAlertService.showCustomToast('¡Hasta pronto!', 'info');
    this.router.navigate(['/auth']);
  }
}
