import { Injectable } from "@angular/core";
import { ZStore } from "../../z-store/z-store";
import { Store } from "@ngrx/store";
import { Actions } from "@ngrx/effects";

import { State, Schema, Selectors, config } from './config';

@Injectable()
export class AuthStore extends ZStore<State, Schema, Selectors> {
    constructor(
        store: Store<any>,
        actions: Actions,
    ) {
        super(store, actions, config());
    }
}
