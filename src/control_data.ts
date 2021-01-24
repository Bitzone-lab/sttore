import { StoreManagement, Sttore } from './typing'
import { isSttore } from './utils'

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

    function confirm(key?: keyof T): boolean {
        if (key === undefined) {
            const size = st.stpd.size
            st.stpd.forEach(function (val_pd, key_pd) {
                st.set(key_pd, val_pd)
                st.stpd.delete(key_pd)
            })
            st.stpd.clear()
            return size !== 0
        }

        const val_pd = st.stpd.get(key)
        if (val_pd !== undefined && st.stpd.has(key)) {
            st.set(key, val_pd)
            st.stpd.delete(key)
            return true
        }
        return false
    }

    function cancel(key?: keyof T): boolean {
        if (key === undefined) {
            const size = st.stpd.size
            st.stpd.clear()
            return size !== 0
        }
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
                const val = list[key]
                if (isSttore(val)) {
                    val.cancel()
                }
                st.backup.set(key, val)
            }
            st.initial = JSON.stringify(list)
        } else {
            const init_list: T = JSON.parse(st.initial)
            for (const key in st.list()) {
                const val = st.list()[key]
                if (isSttore(val)) {
                    val.init()
                } else {
                    st.set(key, init_list[key])
                    st.backup.set(key, init_list[key])
                }
            }
        }
        st.stpd.clear()
        st.sthp.forEach(function (value, key) {
            st.sthp.set(key, '')
        })
    }

    return { set, confirm, cancel, init, frozen }
}
