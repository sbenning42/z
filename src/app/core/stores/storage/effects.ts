import { Injectable } from "@angular/core";
import { StorageStore } from "./store";
import { Effect } from "@ngrx/effects";
import { StorageService } from "../../services/storage/storage.service";
import { async } from "../../z-store/z-store";
import { Entries } from "./config";

@Injectable()
export class StorageEffects {
    constructor(
        public store: StorageStore,
        public storage: StorageService,
    ) {}
    
    @Effect({ dispatch: true })
    get = this.store.actions$.pipe(
        async<void, Entries>(this.store.actions.get, () => this.storage.get())
    );
    
    @Effect({ dispatch: true })
    save = this.store.actions$.pipe(
        async<Entries, Entries>(this.store.actions.save, entries => this.storage.save(entries))
    );
    
    @Effect({ dispatch: true })
    remove = this.store.actions$.pipe(
        async<string[], string[]>(this.store.actions.remove, keys => this.storage.remove(keys))
    );
    
    @Effect({ dispatch: true })
    clear = this.store.actions$.pipe(
        async<void, undefined>(this.store.actions.clear, () => this.storage.clear())
    );
}
