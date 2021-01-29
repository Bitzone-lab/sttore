import sttore from '../../src'

describe('changes', function () {
    it('set', function () {
        const store = sttore({ name: 'Luis', age: 19 })

        expect(store.change('age')).toBeFalsy()
        expect(store.change('name')).toBeFalsy()

        expect(store.set('name', 'Giordano')).toBeTruthy()
        expect(store.change('name')).toBeTruthy()
        expect(store.change('age')).toBeFalsy()

        store.set('age', 8)
        expect(store.change('age')).toBeTruthy()

        store.set('age', 19)
        expect(store.change('age')).toBeFalsy()
    })

    it('set all', function () {
        const store = sttore({ name: 'Luis', age: 19 })
        store({ name: 'Liliana', age: 8 })
        expect(store.change('name')).toBeTruthy()
        expect(store.change('age')).toBeTruthy()

        store({ name: 'Luis', age: 19 })
        expect(store.change('name')).toBeFalsy()
        expect(store.change('age')).toBeFalsy()

        store({ ...store(), age: 33 })
        expect(store.change('name')).toBeFalsy()
        expect(store.change('age')).toBeTruthy()
    })

    it('same value', function () {
        const store = sttore({ name: 'Pablo', age: 22 })
        store.set('name', 'Pablo')
        expect(store.change()).toBeFalsy()
    })

    it('group changes', function () {
        const store = sttore({ name: 'Katherin', age: 19 })
        expect(store.change()).toBeFalsy()

        store({ ...store(), name: 'Fátima' })
        expect(store.change()).toBeTruthy()
        expect(store.change('age')).toBeFalsy()
    })

    it('object', function () {
        const store = sttore({
            date: '02/02/12',
            brand: { name: 'Coca Cola Light', company: 'Coca Cola' }
        })
        store.set('brand', { name: 'LiteBeam', company: 'Ubiquiti' })
        expect(store.change()).toBeTruthy()
    })

    it('arrays', function () {
        const store = sttore({
            date: '02/02/12',
            movies: [{ name: 'Anabelle' }, { name: 'Fast and Furious' }]
        })
        store.set('movies', [{ name: 'Mad Max' }])
        expect(store.change()).toBeTruthy()
    })

    it('with type sttore', function () {
        const store = sttore({
            name: 'Juan',
            contact: sttore({
                phone: 123456789,
                name: 'Michael'
            })
        })
        store().contact({ phone: 87878787, name: 'Luis' })
        expect(store.change()).toBeTruthy()
        expect(store().contact.change()).toBeTruthy()
    })

    it('get data changed', function () {
        const store = sttore({ company: 'Google', active: false, year: 1997 })
        store.set('company', 'Facebook')
        store.set('year', 1995)
        expect(Object.values(store.changes()).length).toBe(2)
        expect(store.changes()).toMatchObject({
            company: 'Facebook',
            year: 1995
        })
    })

    it('initial changes', function () {
        const store = sttore({
            active: false,
            date: sttore({ format: 'YYYY/MM/DD', day: 9 }),
            country: sttore({ name: 'China' })
        })
        store.set('active', true)
        store().date.set('format', 'YYYY-MM-DD')
        store().country.set('name', 'Brazil')
        expect(store.change()).toBeTruthy()
        store.init()
        expect(store.change()).toBeFalsy()
    })

    it('initial changes with new data', function () {
        const store = sttore({
            active: false,
            country: sttore({ name: 'China' })
        })
        store.set('active', true)
        store().country.set('name', 'Spain')
        const store2 = sttore({
            active: false,
            country: sttore({ name: 'France' })
        })
        expect(store.change()).toBeTruthy()
        store.init(store2)
        expect(store().active).toBeFalsy()
        expect(store().country().name).toBe('France')
        expect(store.change()).toBeFalsy()
    })

    it('initial changes with init to init', function () {
        const store = sttore({
            active: false,
            country: sttore({ name: 'China' })
        })
        store.set('active', true)
        store().country.set('name', 'Spain')
        const store2 = sttore({
            active: false,
            country: sttore({ name: 'France' })
        })
        store.init(store2)
        store.set('active', false)
        store().country.set('name', 'EEUU')
        expect(store.change()).toBeTruthy()
        store.init()
        expect(store.change()).toBeFalsy()
    })

    it('only', function () {
        const store = sttore({ name: 'Luis', age: 19, active: false })
        store.set('name', 'Manuel')
        expect(store.change()).toBeTruthy()
        expect(store.only(['age', 'active'])).toBeFalsy()
        expect(store.only(['name'])).toBeTruthy()
        expect(store.only(['name', 'age'])).toBeTruthy()
    })

    it('omit', function () {
        const store = sttore({ name: 'Luis', age: 19, active: false })
        store.set('name', 'Manuel')
        store.set('active', true)
        expect(store.change()).toBeTruthy()
        expect(store.omit(['name', 'active'])).toBeFalsy()
        expect(store.omit(['age'])).toBeTruthy()
        expect(store.omit(['age', 'name'])).toBeTruthy()
    })
})
