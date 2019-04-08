import { HeadersType } from "../core/types/headers-type";
import { Header } from "../core/models/header";
import { Headers } from "../core/types/headers";

export function asHeaders(headers: HeadersType = []) {
    return headers.filter(header => !!header).map(header => {
        if (typeof(header) === 'string') {
            return new Header(header);
        } else if ((header as Header).id === undefined) {
            return new Header(header.type, header.data, header.followAsync);
        }
        return header as Header;
    }) as Headers;
}
