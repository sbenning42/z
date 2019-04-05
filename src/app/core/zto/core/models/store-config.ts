import { ActionsSchema } from "../types/actions-schema";
import { ActionsConfig } from "../types/actions-config";

export class StoreConfig<ThisState, ThisActionsSchema extends ActionsSchema> {
    constructor(
        public selector: string,
        public initial: ThisState,
        public actions: ActionsConfig<ThisState, ThisActionsSchema>,
    ) {}
}
