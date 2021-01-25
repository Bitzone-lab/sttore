import { StoresManagement } from './typing';
export default function control_changes<T>(sts: StoresManagement<T>): {
    change: (key?: keyof T | undefined) => boolean;
    changes: () => Partial<T>;
    omit: (keys: Array<Partial<keyof T>>) => boolean;
    only: (keys: Array<Partial<keyof T>>) => boolean;
};
