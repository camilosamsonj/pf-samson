import { createAction, createActionGroup, emptyProps, props } from "@ngrx/store";
import { IUser } from "../../layouts/dashboard/pages/users/models";
import { ILoginData } from "../../layouts/auth/models";


export const login = createAction('[Auth] Login', props<{ payload: ILoginData }>());
export const loginSuccess = createAction('[Auth] Login Success', props<{data: IUser}>());
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: unknown }>());

export const getLoggedInUserFailure = createAction('[Auth] Get Logged In User Failure', props<{ error: unknown }>());

export const logout = createAction('[Auth] Logout');
export const logoutFailure = createAction('[Auth] Logout Failure', props<{error: unknown}>());

export const logoutSuccess = createAction('Auth, Logout Success', props<{mssg: 'Ha cerrado sesión'}>());

