import { StoresManagement } from './typing'
import { isSttore } from './utils'

export default function control_changes<T>(sts: StoresManagement<T>) {
    function identify_change(key: keyof T) {
        const val: any = sts.get(key)
        const val_backup: any = sts.backup.get(key)

        if (Array.isArray(val) && Array.isArray(val_backup) && val.length !== val_backup.length) {
            return true
        } else if (Array.isArray(val) || Array.isArray(val_backup)) {
            return JSON.stringify(val) !== JSON.stringify(val_backup)
        } else if (typeof val === 'object' || typeof val_backup === 'object') {
            return JSON.stringify(val) !== JSON.stringify(val_backup)
        } else if (isSttore(val)) {
            return val.change()
        }

        return val !== val_backup
    }

    function change(key?: keyof T): boolean {
        if (key !== undefined) {
            if (!sts.has(key)) return false
            return identify_change(key)
        }

        let has_change = false
        for (const _key in sts.list()) {
            has_change = identify_change(_key)
            if (has_change) break
        }

        return has_change
    }

    function changes(): Partial<T> {
        const data: Partial<T> = {}
        const list: T = sts.list()
        for (const key in list) {
            const value = list[key]
            if (identify_change(key)) {
                data[key] = value
            }
        }
        return data
    }

    function omit(keys: Array<Partial<keyof T>>): boolean {
        let has_change = false
        for (const key in sts.list()) {
            if (keys.find((_k) => _k === key)) continue
            if (has_change) break
            has_change = change(key)
        }
        return has_change
    }

    function only(keys: Array<Partial<keyof T>>): boolean {
        let has_change = false
        for (const key of keys) {
            if (has_change) break
            has_change = change(key)
        }
        return has_change
    }

    return {
        change,
        changes,
        omit,
        only
    }
}
