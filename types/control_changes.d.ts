import { StoreManagement } from './typing';
export default function control_changes<T>(st: StoreManagement<T>): {
    change: (key?: keyof T | undefined) => boolean;
    changes: () => Partial<T>;
};
