import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { UsersService } from '../../users.service';
import { IUser } from '../../models';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent {

user$: Observable<IUser | undefined>;


constructor(
  private activatedRoute: ActivatedRoute,
  private usersService: UsersService
) {

  this.user$ = this.usersService.getUserById(this.activatedRoute.snapshot.params['id']);
}


}
