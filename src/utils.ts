import { Sttore } from './typing'

export function isSttore(arg: any): arg is Sttore<any> {
    return typeof arg === 'function'
}
