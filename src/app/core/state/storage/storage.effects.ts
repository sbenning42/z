import { Injectable } from "@angular/core";
import { Actions, Effect } from "@ngrx/effects";
import { resolveAsyncAction } from "../../zto";
import { StorageSchema } from "./storage.config";
import { StorageStore } from "./storage.store";
import { StorageService } from "../../services/storage/storage.service";

@Injectable()
export class StorageEffects {
    constructor(
        public actions$: Actions,
        public store: StorageStore,
        public storage: StorageService,
    ) {}

    @Effect({ dispatch: true })
    protected getEffect$ = this.actions$.pipe(
      resolveAsyncAction<StorageSchema["get"]>(this.store.actions.get, () => this.storage.get()),
    );
    @Effect({ dispatch: true })
    protected saveEffect$ = this.actions$.pipe(
      resolveAsyncAction<StorageSchema["save"]>(this.store.actions.save, payload => this.storage.save(payload)),
    );
    @Effect({ dispatch: true })
    protected removeEffect$ = this.actions$.pipe(
      resolveAsyncAction<StorageSchema["remove"]>(this.store.actions.remove, payload => this.storage.remove(payload)),
    );
    @Effect({ dispatch: true })
    protected clearEffect$ = this.actions$.pipe(
      resolveAsyncAction<StorageSchema["clear"]>(this.store.actions.clear, () => this.storage.clear()),
    );
}
