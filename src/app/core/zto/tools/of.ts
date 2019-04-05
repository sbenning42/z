import { Observable } from "rxjs";
import { Action } from "../core/types/action";
import { filter } from "rxjs/operators";
import { ofType } from "@ngrx/effects";

export function ofHeaderId(...headerIds: string[]) {
    return (actions$: Observable<Action<any>>) => actions$.pipe(
        filter(action => action.headers && action.headers.some(
            header => headerIds.includes(header.id))
        ),
    );
}

export function ofHeader(...headerTypes: string[]) {
    return (actions$: Observable<Action<any>>) => actions$.pipe(
        filter(action => action.headers && action.headers.some(
            header => headerTypes.includes(header.type))
        ),
    );
}

export function ofHeaderIdOfType(...headerIds: string[]) {
    return (...types: string[]) => (actions$: Observable<Action<any>>) => actions$.pipe(
        ofHeaderId(...headerIds),
        ofType(...types)
    );
}

export function ofHeaderOfType(...headerTypes: string[]) {
    return (...types: string[]) => (actions$: Observable<Action<any>>) => actions$.pipe(
        ofHeader(...headerTypes),
        ofType(...types)
    );
}
