import {
    ZStoreConfig,
    ZSchema,
    ZSelectors,
    documentFactory,
    eventFactory,
    commandFactory,
    ZDocument,
    ZEvent,
    ZCommand
} from "../../z-store/z-store";
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { appHeader, SYMBOLS } from "../app/config";

export const type = 'TODOS';

export interface Todo {
    id: string;
    name: string;
    status: number;
}

export interface State extends EntityState<Todo> {
    loaded: boolean;
}

export interface Schema extends ZSchema {
    getAll: ZCommand<void, Todo[]>;
    getById: ZCommand<string, Todo>;
    save: ZCommand<Todo | Partial<Todo>, Todo>;
    remove: ZCommand<string, string>;
}

export interface Selectors extends ZSelectors<State> {
}

export const todosAdapter = createEntityAdapter<Todo>();

export const initial: State = todosAdapter.getInitialState({
    loaded: false
});

export function config() {
    return new ZStoreConfig<State, Schema, Selectors>(
        type,
        initial,
        {
            
            getAll: commandFactory(
                '[TODOS] GET ALL',
                {
                    onSuccess: (state, todos) => ({ loaded: true, ...todosAdapter.addAll(todos, state) }),
                },
                {
                    request: [appHeader(SYMBOLS.LOAD_ASYNC_HEADER)('Getting Todos ...')],
                    failure: [appHeader(SYMBOLS.ERROR_ASYNC_HEADER)('Getting Todos Failed ...')]
                }
            ),

            getById: commandFactory(
                '[TODOS] GET BY ID',
                {
                },
                {
                    request: [appHeader(SYMBOLS.LOAD_ASYNC_HEADER)('Getting Todo ...')],
                    failure: [appHeader(SYMBOLS.ERROR_ASYNC_HEADER)('Getting Todo Failed ...')]
                }
            ),

            save: commandFactory(
                '[TODOS] SAVE',
                {
                    onSuccess: (state, todo) => todosAdapter.upsertOne(todo, state),
                },
                {
                    request: [appHeader(SYMBOLS.LOAD_ASYNC_HEADER)('Saving Todos ...')],
                    failure: [appHeader(SYMBOLS.ERROR_ASYNC_HEADER)('Saving Todos Failed ...')]
                }
            ),

            remove: commandFactory(
                '[TODOS] REMOVE',
                {
                    onSuccess: (state, id) => todosAdapter.removeOne(id, state),
                },
                {
                    request: [appHeader(SYMBOLS.LOAD_ASYNC_HEADER)('Removing Todos ...')],
                    failure: [appHeader(SYMBOLS.ERROR_ASYNC_HEADER)('Removing Todos Failed ...')]
                }
            ),

        }
    );
}
