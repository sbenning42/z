import { ActionsSchema } from "./actions-schema";
import { ActionManager } from './action-manager';

export type ActionsManager<ThisActionsSchema extends ActionsSchema> = {
    [Key in keyof ThisActionsSchema]: ActionManager<ThisActionsSchema[Key]>;
};
