import { uuid } from "../../tools/uuid";

export class Header<Data = any> {
    id = uuid();
    constructor(
        public type: string,
        public data: Data = {} as any,
        public followAsync: boolean = true
    ) {}
}
