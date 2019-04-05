import { ActionSchema } from './action-schema';
import { SyncActionFactory } from './sync-action-factory';
import { AsyncActionFactories } from './async-action-factory';

export type ActionManager<ThisActionSchema extends ActionSchema<any, any>> = ThisActionSchema['IsAsync'] extends false
    ? SyncActionFactory<ThisActionSchema>
    : AsyncActionFactories<ThisActionSchema>;
