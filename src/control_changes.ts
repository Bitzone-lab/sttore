import { StoreManagement } from './typing'
import { isSttore } from './utils'

export default function control_changes<T>(st: StoreManagement<T>) {
    function identify_change(key: keyof T) {
        const val: any = st.get(key)
        const val_backup: any = st.backup.get(key)

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
            if (!st.has(key)) return false
            return identify_change(key)
        }

        let has_change = false
        for (const key in st.list()) {
            has_change = identify_change(key)
            if (has_change) break
        }

        return has_change
    }

    function changes(): Partial<T> {
        const changes: Partial<T> = {}
        const list: T = st.list()
        for (const key in list) {
            const value = list[key]
            if (identify_change(key)) {
                changes[key] = value
            }
        }
        return changes
    }

    return {
        change,
        changes
    }
}
