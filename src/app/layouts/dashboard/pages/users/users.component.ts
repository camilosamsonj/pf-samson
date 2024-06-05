import { Component, OnInit } from '@angular/core';
import { IUser } from './models';
import { Observable, map, take, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from './users.service';
import { UsersDialogComponent } from './components/users-dialog/users-dialog.component';
import { Store } from '@ngrx/store';
import {
  selectLoadingUsers,
  selectUsersError,
  selectUsersList,
} from './store/users.selectors';
import { UsersActions } from './store/users.actions';
import { SweetAlertService } from '../../../../core/services/sweet-alert.service';
import { selectAuthUser } from '../../../../store/auth/auth.selectors';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'email',
    'role',
    'createdAt',
    'actions',
  ];

  loadingUsers$: Observable<boolean>;
  users$: Observable<IUser[]>;
  error$: Observable<unknown>;


  constructor(
    private matDialog: MatDialog,
    private store: Store,
    private sweetAlertService: SweetAlertService,
    private usersService: UsersService
  ) {
    this.error$ = this.store.select(selectUsersError);
    this.users$ = this.store.select(selectUsersList);
    this.loadingUsers$ = this.store.select(selectLoadingUsers);
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.store.dispatch(UsersActions.loadUsers());
  }

  openDialog(editingUser?: IUser): void {
    this.matDialog
      .open(UsersDialogComponent, { data: editingUser })
      .afterClosed()
      .subscribe({
        next: (result) => {
          if (result) {
            if (editingUser) {
              const updatedUser: IUser = { ...editingUser, ...result };
              this.usersService
                .updateUser(updatedUser)
                .pipe(
                  tap(
                    () =>
                      (this.users$ = this.users$.pipe(
                        map((users) =>
                          users.map((u) =>
                            u.id === editingUser.id ? { ...u, ...result } : u
                          )
                        )
                      ))
                  )
                )
                .subscribe({
                  next: () => {
                    this.sweetAlertService.showCustomAlert(
                      '¡Cambios aplicados!',
                      'El usuario se ha editado correctamente',
                      'success'
                    );
                  },
                  error: () => {
                    this.sweetAlertService.showCustomAlert(
                      'Error',
                      'Error al actualizar el usuario',
                      'error'
                    );
                  },
                });
            } else {
              const currentDate = new Date();
              const userToCreate: IUser = {
                ...result,
                createdAt: currentDate,
              };
              this.usersService.createUser(userToCreate).subscribe({
                next: (createdUser: IUser) => {
                  this.users$ = this.users$.pipe(
                    map((users: IUser[]) => [...users, createdUser])
                  );
                },
                error: (error) => {
                  this.sweetAlertService.showCustomAlert(
                    'Error',
                    `Error: ${error} al crear el usuario `,
                    'error'
                  );
                },
                complete: () => {
                  this.sweetAlertService.showCustomAlert(
                    'Usuario creado',
                    'El usuario se ha creado correctamente',
                    'success'
                  );
                },
              });
            }
          }
        },
      });
  }

  onDeleteUser(id: number): void {
    this.sweetAlertService
      .showConfirmation('¿Estás seguro?', '¡No podrás revertir esto!')
      .then((result) => {
        if (result) {
          if (this.users$) {
            this.usersService.deleteUser(id).subscribe({
              next: () => {
                this.users$ = this.users$.pipe(
                  map((users) => users.filter((user) => user.id !== id))
                );
              },
              error: () => {
                console.error('error');
              },
              complete: () => {
                this.sweetAlertService.showCustomAlert(
                  '¡Eliminado!',
                  'El usuario ha sido eliminado correctamente',
                  'success'
                );
              },
            });
          }
        } else {
          this.sweetAlertService.showCustomAlert(
            'Cancelado',
            'Ningún usuario fue elminado',
            'info'
          );
        }
      });
  }
}
