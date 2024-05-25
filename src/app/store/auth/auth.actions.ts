import { createAction, createActionGroup, emptyProps, props } from "@ngrx/store";
import { ILoginData } from "../../layouts/auth/models";

export const authActions = createActionGroup({
    source: 'Auth',
    events: {
        login: props<{payload: ILoginData}>(),
        logout: emptyProps(),
    }
})