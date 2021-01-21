import { StoreManagement, Sttore } from './typing'

export default function control_data<T>(st: StoreManagement<T>) {
    function set<K extends keyof T>(key: K, value: T[K], pending?: boolean): boolean {
        if (!st.has(key)) return false
        if (pending) {
            st.stpd.set(key, value)
        } else {
            st.stpd.delete(key)
            st.set(key, value)
        }
        return true
    }

    function confirm(key: keyof T) {
        const val_pd = st.stpd.get(key)
        if (val_pd !== undefined && st.stpd.has(key)) {
            st.set(key, val_pd)
            st.stpd.delete(key)
            return true
        }
        return false
    }

    function cancel(key: keyof T): boolean {
        return st.stpd.delete(key)
    }

    function frozen<K extends keyof T>(key: K): T[K] | null {
        const value: T[K] | undefined = st.get(key)
        return value !== undefined ? value : null
    }

    function init(store?: Sttore<T>) {
        if (store) {
            const list = store()
            for (const key in list) {
                st.backup.set(key, list[key])
            }
            st.initial = JSON.stringify(list)
        } else {
            const list: T = JSON.parse(st.initial)
            for (const key in list) {
                st.set(key, list[key])
                st.backup.set(key, list[key])
            }
        }
        st.stpd.clear()
        st.sthp.forEach(function (value, key) {
            st.sthp.set(key, '')
        })
    }

    return { set, confirm, cancel, init, frozen }
}
