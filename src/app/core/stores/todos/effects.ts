import { Injectable } from "@angular/core";
import { TodosStore } from "./store";
import { TodoService } from "../../services/todo/todo.service";
import { Effect } from "@ngrx/effects";
import { async } from "../../z-store/z-store";
import { Todo } from "./config";
import { map } from "rxjs/operators";

@Injectable()
export class TodosEffects {
    constructor(
        public store: TodosStore,
        public todos: TodoService
    ) {}

    @Effect({ dispatch: true })
    getAll = this.store.actions$.pipe(
        async<void, Todo[]>(
            this.store.actions.getAll,
            () => this.todos.getAll()
        )
    );

    @Effect({ dispatch: true })
    getById = this.store.actions$.pipe(
        async<string, Todo>(
            this.store.actions.getById,
            id => this.todos.getById(id)
        )
    );

    @Effect({ dispatch: true })
    save = this.store.actions$.pipe(
        async<Todo | Partial<Todo>, Todo>(
            this.store.actions.save,
            todo => this.todos.save(todo)
        )
    );

    @Effect({ dispatch: true })
    remove = this.store.actions$.pipe(
        async<string, string>(
            this.store.actions.remove,
            id => this.todos.delete(id).pipe(map(() => id))
        )
    );
}
