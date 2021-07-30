import { EmitBy, StoresManagement } from './typing'

export default function control_data<T>(
    sts: StoresManagement<T>,
    emitBy: (key: keyof T, value: T[keyof T], by: EmitBy) => boolean
) {
    function set<K extends keyof T>(key: K, value: T[K], pending?: boolean): boolean {
        if (!emitBy(key, value, 'set')) return false
        if (!sts.has(key)) return false
        if (pending) {
            sts.stpd.set(key, value)
        } else {
            sts.stpd.delete(key)
            sts.set(key, value)
        }
        return true
    }

    function confirm(key?: keyof T): boolean {
        if (key === undefined) {
            const size = sts.stpd.size
            sts.stpd.forEach(function (_valPd, _keyPd) {
                if (emitBy(_keyPd, _valPd, 'confirm')) {
                    sts.set(_keyPd, _valPd)
                    sts.stpd.delete(_keyPd)
                }
            })
            sts.stpd.clear()
            return size !== 0
        }
        const valPd = sts.stpd.get(key)
        if (valPd !== undefined && sts.stpd.has(key)) {
            if (!emitBy(key, valPd, 'confirm')) return false
            sts.set(key, valPd)
            sts.stpd.delete(key)
            return true
        }
        return false
    }

    function cancel(key?: keyof T): boolean {
        if (key === undefined) {
            let size = 0
            sts.stpd.forEach(function (valPd, keyPd) {
                if (emitBy(keyPd, valPd, 'cancel')) {
                    sts.stpd.delete(keyPd)
                    size++
                }
            })
            return size !== 0
        }
        const val = sts.stpd.get(key)
        if (val !== undefined) {
            if (!emitBy(key, val, 'cancel')) return false
        }
        return sts.stpd.delete(key)
    }

    function frozen<K extends keyof T>(key: K): T[K] | null {
        const value: T[K] | undefined = sts.get(key)
        return value !== undefined ? value : null
    }

    return { set, confirm, cancel, frozen }
}
