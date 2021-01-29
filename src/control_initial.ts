import { Sttore } from '.'
import { StoresManagement } from './typing'
import { isSttore } from './utils'

export default function control_initial<T>(sts: StoresManagement<T>) {
    function process(store: T) {
        for (const key in store) {
            const value: T[keyof T] = store[key]
            if (isSttore(value)) {
                const st_children = sts.get(key)
                if (isSttore(st_children)) {
                    value.restore()
                    st_children.init(value)
                }
            } else {
                sts.st.set(key, value)
                sts.backup.set(key, value)
            }
        }
    }

    function init(store?: Sttore<T>) {
        if (store === undefined) {
            sts.stpd.clear()
            sts.sthp.forEach(function (value, key) {
                sts.sthp.set(key, '')
            })
            process(JSON.parse(sts.initial))
            sts.st.forEach(function (value) {
                if (isSttore(value)) {
                    value.init()
                }
            })
        } else {
            process(store())
        }
    }

    return {
        init
    }
}
