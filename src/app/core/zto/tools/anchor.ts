import { Header } from "../core/models/header";
import { ANCHOR_HEADER } from "../core/symbols/headers";

export function anchor<Data extends { followAsync?: boolean }>(from: string, data?: Data) {
    return new Header(ANCHOR_HEADER, { from, data }, data ? !!data.followAsync : false);
}
