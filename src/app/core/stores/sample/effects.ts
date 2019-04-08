import { Injectable } from "@angular/core";
import { SampleStore } from "./store";
import { Effect, ofType } from "@ngrx/effects";
import { mergeMap, map, catchError, takeUntil } from "rxjs/operators";
import { Action, grabHeaders, SYMBOLS, onCancel, async } from "../../z-store/z-store";
import { of, timer } from "rxjs";

@Injectable()
export class SampleEffects {
    constructor(
        public store: SampleStore
    ) {}

    @Effect({ dispatch: true })
    asyncStr = this.store.actions$.pipe(
        async<string, string>(
            this.store.actions.asyncStr,
            payload => timer(5000).pipe(map(() => payload))
        ),
    );

}
