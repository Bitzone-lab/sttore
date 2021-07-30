import { Store, StoresManagement, Sttore, StoreBackup, Listen } from './typing'

export default function store<T>(data: T): StoresManagement<T> {
    const initial: string = JSON.stringify(data)
    const st: Store<T, any> = new Map()
    const stbackup: StoreBackup<T> = new Map()
    const stpd: Store<T, any> = new Map()
    const sthp: Map<keyof T, any> = new Map()
    const stev: Map<keyof T, Listen<T, any>> = new Map()

    for (const key in data) {
        const value: any = data[key]
        st.set(key, value)
        stbackup.set(key, value)
        sthp.set(key, '')
    }

    function set<K extends keyof T>(key: K, value: T[K]) {
        st.set(key, value)
    }

    function has(key: keyof T): boolean {
        return st.has(key)
    }

    function get<K extends keyof T>(key: K): T[K] | undefined {
        return st.get(key)
    }

    function list(): T {
        const response: any = {}
        st.forEach(function (value: Sttore<any> | T[keyof T], key: keyof T) {
            response[key] = value
        })
        return response
    }

    function current(): T {
        const response: any = {}
        st.forEach(function (value: Sttore<any> | T[keyof T], key: keyof T) {
            if (stpd.has(key)) {
                response[key] = stpd.get(key)
            } else {
                response[key] = value
            }
        })
        return response
    }

    return {
        set,
        has,
        list,
        sthp,
        backup: stbackup,
        get,
        stpd,
        initial,
        current,
        st,
        stev
    }
}
