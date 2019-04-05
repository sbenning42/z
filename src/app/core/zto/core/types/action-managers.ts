import { Typed } from "../models/typed";
import {
    SyncActionWithPayloadFactory,
    SyncActionWithoutPayloadFactory,
    AsyncRequestWithPayloadFactory,
    AsyncRequestWithoutPayloadFactory,
    AsyncResponseFactory,
    AsyncErrorFactory,
    AsyncCancelFactory
} from "./action-factories";

export type SyncActionWithPayloadManager<Payload> = SyncActionWithPayloadFactory<Payload> & Typed;
export type SyncActionWithoutPayloadManager = SyncActionWithoutPayloadFactory & Typed;
export type AsyncRequestWithPayloadManager<Payload> = AsyncRequestWithPayloadFactory<Payload> & Typed;
export type AsyncRequestWithoutPayloadManager = AsyncRequestWithoutPayloadFactory & Typed;
export type AsyncResponseManager<Payload, Result> = AsyncResponseFactory<Payload, Result> & Typed;
export type AsyncErrorManager<Payload> = AsyncErrorFactory<Payload> & Typed;
export type AsyncCancelManager<Payload> = AsyncCancelFactory<Payload> & Typed;
