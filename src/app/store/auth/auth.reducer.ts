import { createReducer, on } from "@ngrx/store";
import { IUser } from "../../layouts/dashboard/pages/users/models";
import { authActions } from "./auth.actions";
import swal from 'sweetalert2';

export interface AuthState {
    authUser: null | IUser;
}

const initialState: AuthState = {
    authUser: null,
};

const MOCK_AUTH_USER : IUser = {
id: 1,
createdAt: new Date(),
email: 'email@mail.com',
    firstName: 'Camilo',
    lastName: 'Samson',
    role: 'ADMIN'
  };

export const authFeatureName = 'auth'; 

export const authReducer = createReducer(
    initialState,
    on(authActions.login, (state, action) => {
        if
        (action.payload.email !=='camilosamson@outlook.com' && 
        action.payload.password !== '246810')
        {
            swal.fire({
                title: 'Correo o password incorrectos',
                icon: 'warning',
                text: 'Por favor intente nuevamente',
            });
            return state;         
          } else {
            localStorage.setItem('accessToken',
            'abcdefghijklmnñopqrstuvwxyz'
        );
                    
            return {
                authUser: MOCK_AUTH_USER
            };  
          }
        }),

    on(authActions.logout, () => {
        sessionStorage.removeItem('accessToken');
        return initialState;
    })
);