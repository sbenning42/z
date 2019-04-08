import { Action } from "./action";
import { HeadersType } from "./headers-type";

export type SyncActionWithPayloadFactory<Payload> = new (payload: Payload, headers?: HeadersType) => Action<Payload>;
export type SyncActionWithoutPayloadFactory = new (headers?: HeadersType) => Action<undefined>;
export type AsyncRequestWithPayloadFactory<Payload> = new (payload: Payload, headers?: HeadersType) => Action<Payload>;
export type AsyncRequestWithoutPayloadFactory = new (headers?: HeadersType) => Action<undefined>;
export type AsyncResponseFactory<Payload, Result> = new (payload: Result, request: Action<Payload>, headers?: HeadersType) => Action<Result>;
export type AsyncErrorFactory<Payload> = new (payload: Error, request: Action<Payload>, headers?: HeadersType) => Action<Error>;
export type AsyncCancelFactory<Payload> = new (request: Action<Payload>, headers?: HeadersType) => Action<undefined>;
