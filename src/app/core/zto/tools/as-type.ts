import {
    ASYNC,
    REQUEST,
    RESPONSE,
    ERROR,
    CANCEL
} from "../core/symbols/core";

export function baseType(type: string) {
    return type.includes(ASYNC) ? type.split(ASYNC)[0] : type;
}

export function asRequestType(type: string) {
    return `${type}${ASYNC}${REQUEST}`;
}
export function asResponseType(type: string) {
    return `${type}${ASYNC}${RESPONSE}`;
}
export function asErrorType(type: string) {
    return `${type}${ASYNC}${ERROR}`;
}
export function asCancelType(type: string) {
    return `${type}${ASYNC}${CANCEL}`;
}

export function isRequestType(type: string) {
    return type.includes(`${ASYNC}${REQUEST}`);
}
export function isResponseType(type: string) {
    return type.includes(`${ASYNC}${RESPONSE}`);
}
export function isErrorType(type: string) {
    return type.includes(`${ASYNC}${ERROR}`);
}
export function isCancelType(type: string) {
    return type.includes(`${ASYNC}${CANCEL}`);
}
