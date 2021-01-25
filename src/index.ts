import { Sttore as S, PropSttore, StoreManagement } from './typing'
import store from './store'
import control_data from './control_data'
import control_helper from './control_helper'
import control_changes from './control_changes'
import { isSttore } from './utils'
export type Sttore<T> = S<T>

/**
 * @version 1.0.0
 * Sttore
 */
export default function sttore<T extends PropSttore<any>>(states: T): S<T> {
    const st: StoreManagement<T> = store(states)

    const { set, confirm, cancel, frozen, init } = control_data(st)
    const { helper, helpers } = control_helper(st.sthp)
    const { change, changes } = control_changes(st)
    function self(values?: T): T {
        for (const key in values) {
            if (st.has(key)) {
                set(key, values[key])
            }
        }
        return st.current()
    }

    function restore(to?: 'helper' | 'pending') {
        function restoreHelper() {
            for (const key in st.list()) {
                st.sthp.set(key, '')
                const value: T[keyof T] = st.list()[key]
                if (isSttore(value)) {
                    value.restore()
                }
            }
        }

        function restorePending() {
            st.stpd.clear()
            for (const key in st.list()) {
                const value: T[keyof T] = st.list()[key]
                if (isSttore(value)) {
                    value.cancel()
                }
            }
        }

        if (to === undefined) {
            restoreHelper()
            restorePending()
        }

        if (to === 'helper') {
            restoreHelper()
        }

        if (to === 'pending') {
            restorePending()
        }
    }

    self.set = set
    self.confirm = confirm
    self.cancel = cancel
    self.frozen = frozen
    self.helper = helper
    self.helpers = helpers
    self.change = change
    self.changes = changes
    self.init = init
    self.restore = restore

    return self
}
