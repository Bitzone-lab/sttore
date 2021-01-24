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

    it('initial children store', function () {
        const store = sttore({
            company: 'Google',
            active: false,
            date: sttore({ format: 'YYYY/MM/DD', day: 9 })
        })

        store.set('company', 'Facebook')
        store.set('active', true)
        store().date.set('format', 'DD-MM-YYYY')
        store().date.set('day', 12)
        expect(store.change()).toBeTruthy()
        expect(store().active).toBeTruthy()
        expect(store().company).toBe('Facebook')
        expect(store().date()).toMatchObject({
            format: 'DD-MM-YYYY',
            day: 12
        })
        store.init()
        expect(store().company).toBe('Google')
        expect(store().active).toBeFalsy()
        expect(store().date()).toMatchObject({ format: 'YYYY/MM/DD', day: 9 })
    })

    it('initial conserv states children store', function () {
        const store = sttore({
            company: 'Google',
            active: false,
            date: sttore({ format: 'YYYY/MM/DD', day: 9 }),
            country: sttore({ name: 'China' })
        })

        store.set('company', 'Facebook')
        store.set('active', true)
        store().date.set('format', 'DD-MM-YYYY')
        store().date.set('day', 12, true)
        expect(store().date.change('day')).toBeFalsy()
        store().country.set('name', 'Germany')
        store.init(store)
        expect(store().company).toBe('Facebook')
        expect(store().active).toBeTruthy()
        expect(store().date().format).toBe('DD-MM-YYYY')
        expect(store().date().day).toBe(9)
        expect(store().date.change('day')).toBeFalsy()
        expect(store().country().name).toBe('Germany')
    })
})
