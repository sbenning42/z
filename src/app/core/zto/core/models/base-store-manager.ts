import { ActionsSchema } from "../types/actions-schema";
import { StoreManager } from "./store-manager";
import { StoresService } from "../stores.service";
import { StoreConfig } from "./store-config";

export class BaseStoreManager<ThisState, ThisActionsSchema extends ActionsSchema> extends StoreManager<ThisState, ThisActionsSchema> {
    constructor(
        stores: StoresService,
        config: StoreConfig<ThisState, ThisActionsSchema>,
    ) {
        super(config, stores.store$, stores.actions$);
        return stores.registerStore<ThisState, ThisActionsSchema>(config);
    }
}
