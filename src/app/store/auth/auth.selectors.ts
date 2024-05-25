import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState, authFeatureName } from "./auth.reducer";

export const authState = createFeatureSelector<AuthState>(authFeatureName);
export const authUser = createSelector(authState, (state) => state.authUser);
