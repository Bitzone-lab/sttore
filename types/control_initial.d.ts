import { Sttore } from '.';
import { StoresManagement } from './typing';
export default function control_initial<T>(sts: StoresManagement<T>): {
    init: (store?: Sttore<T> | undefined) => void;
};
