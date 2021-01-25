import sttore from '../../src'

describe('restore', function () {
    it('helper', function () {
        const store = sttore({ active: true, contact: sttore({ id: 15, phone: 989898 }) })
        store.helper('active', 'Its active')
        store().contact.helper('phone', 'This is not phone')
        store.restore('helper')
        expect(store.helper('active')).toBe('')
        expect(store().contact.helper('phone')).toBe('')
    })

    it('pending', function () {
        const store = sttore({ active: true, contact: sttore({ id: 15, phone: 989898 }) })
        store.set('active', false, true)
        store().contact.set('id', 22, true)
        expect(store.change()).toBeFalsy()
        store.restore('pending')
        expect(store.confirm('active')).toBeFalsy()
        expect(store().contact.confirm('id')).toBeFalsy()
    })

    it('helper and pending', function () {
        const store = sttore({ name: 'Manuel', year: 1997 })
        store.helper('name', 'Name is required')
        store.set('year', 1993, true)
        expect(store.helper('name')).toBe('Name is required')
        expect(store.change()).toBeFalsy()
        store.restore()
        expect(store.helper('name')).toBe('')
        expect(store.confirm()).toBeFalsy()
    })
})
