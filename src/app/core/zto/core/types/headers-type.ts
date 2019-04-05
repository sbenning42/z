import { Header } from '../models/header';

export type HeadersType = (string | { type: string, followAsync?: boolean, data?: any } | Header )[]
