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
})
