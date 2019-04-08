import { Injectable } from "@angular/core";
import { StoresService, BaseStoreManager } from "../../zto";
import { AuthState, AuthSchema, authConfig } from "./auth.config";

@Injectable()
export class AuthStore extends BaseStoreManager<AuthState, AuthSchema> {
    constructor(public stores: StoresService) {
        super(stores, authConfig());
    }
}
