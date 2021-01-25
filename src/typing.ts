export interface Sttore<T> {
    /**
     * Initialize states
     */
    (states?: T): T
    /**
     * Update status
     * @param key keyname state
     * @param value value state
     * @param pending Activates pending status update mode.
     * To confirm this update it will require the confirm method, otherwise use the cancel method.
     * A pending status is not detected as a change
     */
    set: <K extends keyof T>(key: K, value: T[K], pending?: boolean) => boolean
    /**
     * Confirm a pending update.
     * @param key keyname of state
     */
    confirm: (key?: keyof T) => boolean
    /**
     * Cancel a pending update and return to its previous value.
     * @param key keyname of state
     */
    cancel: (key?: keyof T) => boolean
    frozen: <K extends keyof T>(key: K) => Sttore<any> | T[K] | null
    helper: (key: keyof T, value?: string) => string
    helpers: (values?: Record<keyof T, string>) => Record<keyof T, string>
    /**
     * Identifies if there were changes in states
     * @param key keyname of state
     */
    change: (key?: keyof T) => boolean
    /**
     * Returns the states that had changes.
     */
    changes: () => Partial<T>
    /**
     * Initialize the states.
     */
    init: (store?: Sttore<T>) => void
    /**
     * It provides you with the option to restore the helpers and pending data.
     * @param to Specify which one you want to restore.
     */
    restore: (to?: 'helper' | 'pending') => void
}

export interface PropSttore<T> {
    [key: string]: Sttore<T> | T
}

export type TypesStore = string | number | boolean | null

export type Store<T, K extends keyof T> = Map<K, T[K]>
export type StoreBackup<T> = Map<keyof T, T[keyof T] | Sttore<any>>

export interface StoreManagement<T> {
    set: <K extends keyof T>(key: K, value: T[K]) => void
    has: (key: keyof T) => boolean
    list: () => T
    current: () => T
    sthp: Map<keyof T, string>
    backup: StoreBackup<T>
    get: <K extends keyof T>(key: K) => T[K] | undefined
    stpd: Store<T, any>
    initial: string
}
