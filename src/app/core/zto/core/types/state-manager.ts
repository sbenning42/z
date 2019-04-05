import { Observable } from "rxjs";

export type StateManager<ThisState> = {
    state: Observable<ThisState>
} & {
    [Key in keyof ThisState]: Observable<ThisState[Key]>;
};
