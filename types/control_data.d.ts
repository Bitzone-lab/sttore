import { StoresManagement } from './typing';
export default function control_data<T>(sts: StoresManagement<T>): {
    set: <K extends keyof T>(key: K, value: T[K], pending?: boolean | undefined) => boolean;
    confirm: (key?: keyof T | undefined) => boolean;
    cancel: (key?: keyof T | undefined) => boolean;
    frozen: <K_1 extends keyof T>(key: K_1) => T[K_1] | null;
};
