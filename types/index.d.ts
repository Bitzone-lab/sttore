import { Sttore as S, PropSttore } from './typing';
export declare type Sttore<T> = S<T>;
/**
 * @version 1.0.0
 * Sttore
 */
export default function sttore<T extends PropSttore<any>>(states: T): S<T>;
