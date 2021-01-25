import { StoresManagement } from './typing'
// import { isSttore } from './utils'

export default function control_data<T>(sts: StoresManagement<T>) {
    /**
     * Update status
     * @param key keyname state
     * @param value value state
     * @param pending Activates pending status update mode.
     * To confirm this update it will require the confirm method, otherwise use the cancel method.
     * A pending status is not detected as a change
     */
    function set<K extends keyof T>(key: K, value: T[K], pending?: boolean): boolean {
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
            sts.stpd.forEach(function (val_pd, key_pd) {
                sts.set(key_pd, val_pd)
                sts.stpd.delete(key_pd)
            })
            sts.stpd.clear()
            return size !== 0
        }

        const val_pd = sts.stpd.get(key)
        if (val_pd !== undefined && sts.stpd.has(key)) {
            sts.set(key, val_pd)
            sts.stpd.delete(key)
            return true
        }
        return false
    }

    function cancel(key?: keyof T): boolean {
        if (key === undefined) {
            const size = sts.stpd.size
            sts.stpd.clear()
            return size !== 0
        }
        return sts.stpd.delete(key)
    }

    function frozen<K extends keyof T>(key: K): T[K] | null {
        const value: T[K] | undefined = sts.get(key)
        return value !== undefined ? value : null
    }

    return { set, confirm, cancel, frozen }
}
