import sttore from '../../src'

describe('initial', function () {
    it('init', function () {
        const store = sttore({ name: 'Manuel', active: false })
        store.set('name', 'Miguel')
        store.set('active', true)
        expect(store()).toMatchObject({
            name: 'Miguel',
            active: true
        })
        store.init()
        expect(store()).toMatchObject({ name: 'Manuel', active: false })
    })

    it('set', function () {
        const store = sttore({ company: 'Google', active: false })
        store.set('company', 'Facebook')
        store.set('active', true)

        expect(store()).toMatchObject({
            company: 'Facebook',
            active: true
        })
        store.init(store)
        expect(store()).toMatchObject({
            company: 'Facebook',
            active: true
        })
        store.set('company', 'Movistar')
        store.set('active', false)
        expect(store()).toMatchObject({
            company: 'Movistar',
            active: false
        })
        store.init()
        expect(store()).toMatchObject({
            company: 'Facebook',
            active: true
        })
    })

    it('helper', function () {
        const store = sttore({ company: 'Google', active: false })
        store.set('company', 'Coca Cola')
        store.helper('active', 'MODE_1')
        expect(store.helper('active')).toBe('MODE_1')
        store.init()
        expect(store()).toMatchObject({
            company: 'Google',
            active: false
        })
        expect(store.helper('active')).toBe('')
    })

    it('pending and changes', function () {
        const store = sttore({ company: 'Google', active: false })
        store.set('active', true)
        store.set('company', 'Claro', true)
        expect(store.changes()).toMatchObject({
            active: true
        })
        store.init()
        expect(store.change()).toBeFalsy()
        expect(Object.values(store.changes()).length).toBe(0)
        expect(store.changes()).toMatchObject({})
    })
})
