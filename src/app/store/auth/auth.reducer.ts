import { createReducer, on } from "@ngrx/store";
import { IUser } from "../../layouts/dashboard/pages/users/models";
import * as actions from "./auth.actions";

export interface AuthState {
    isAuthenticated: boolean;
    authUser: null | IUser;
    error: unknown;
}

const initialState: AuthState = {
    isAuthenticated: false,
    authUser: null,
    error: null,
};

export const authFeatureName = 'auth'; 

export const authReducer = createReducer(
    initialState,

    on(actions.login, (state) => {
        localStorage.setItem('accessToken', 'abcdefghijklmnñopqrstuvwxyz');
        return {
            ...state,
            isAuthenticated: false,
            error: null
        }
    }),

    on(actions.loginSuccess, (state, action) => {
        return {
            ...state,
            isAuthenticated: true,
            authUser: action.data,
            error: null
        }
    }),

    on(actions.getLoggedInUserFailure, (state, action) => {
        return {
            ...state,
            isAuthenticated: false,
            authUser: null,
            error: action.error,   
        }
    }),

    on(actions.logout, (state) => {
        localStorage.removeItem('accessToken');
        return initialState
    }),

    on(actions.logoutFailure, (state, action) => {
        return {
            ...state,
            error: action.error
        }
    })


);