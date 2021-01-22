import { StoreManagement, Sttore } from './typing';
export default function control_data<T>(st: StoreManagement<T>): {
    set: <K extends keyof T>(key: K, value: T[K], pending?: boolean | undefined) => boolean;
    confirm: (key: keyof T) => boolean;
    cancel: (key: keyof T) => boolean;
    init: (store?: Sttore<T> | undefined) => void;
    frozen: <K_1 extends keyof T>(key: K_1) => T[K_1] | null;
};
