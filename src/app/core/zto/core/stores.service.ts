import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Actions } from "@ngrx/effects";
import { Action } from "./types/action";
import { ActionsSchema } from "./types/actions-schema";
import { StoreConfig } from "./models/store-config";
import { StoreManager } from "./models/store-manager";

@Injectable()
export class StoresService {
    constructor(
        public store$: Store<any>,
        public actions$: Actions<Action<any>>,
    ) {}

    registerStore<ThisState, ThisActionsSchema extends ActionsSchema>(config: StoreConfig<ThisState, ThisActionsSchema>) {
        const storeManager = new StoreManager(config, this.store$, this.actions$);
        this.store$.addReducer(storeManager.selector, storeManager.reducer);
        return storeManager;
    }
}
