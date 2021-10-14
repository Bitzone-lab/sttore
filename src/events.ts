import { EmitBy, Listen, StoresManagement } from './typing'

export default function events<T>(sts: StoresManagement<T>) {
    function on<K extends keyof T>(key: K, listen: Listen<T, K> | null) {
        if (listen) {
            sts.stev.set(key, listen)
        } else {
            sts.stev.delete(key)
        }
    }

    function emitBy<K extends keyof T>(key: K, value: T[K], by: EmitBy): boolean {
        if (!sts.stev.has(key)) return true
        const listen = sts.stev.get(key)
        if (listen && value !== undefined) {
            const result = listen(value, by)
            return result === undefined ? true : result
        } else {
            return true
        }
    }

    function emit(key: keyof T): boolean {
        const value = sts.stpd.get(key) || sts.st.get(key)
        if (value !== undefined) {
            return emitBy(key, value, 'emit')
        }
        return false
    }

    return {
        on,
        emitBy,
        emit
    }
}
