import { Sttore, PropSttore } from './typing';
/**
 * @version 1.0.0-beta.1
 * Sttore
 */
export default function sttore<T extends PropSttore<any>>(states: T): Sttore<T>;
