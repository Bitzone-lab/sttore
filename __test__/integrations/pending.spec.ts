import sttore from '../../src'

describe('pending', function () {
    it('confirm', function () {
        const store = sttore({ name: 'Fredy', age: 11 })
        store.set('age', 33, true)
        expect(store().age).toBe(33)
        expect(store.change('age')).toBeFalsy()
        expect(store.change('name')).toBeFalsy()
        expect(store.confirm('age')).toBeTruthy()
        expect(store.change('age')).toBeTruthy()
        expect(store.change('name')).toBeFalsy()
        expect(store.confirm('age')).toBeFalsy()
    })

    it('cancel', function () {
        const store = sttore({ name: 'Fátima', age: 19 })
        store.set('age', 22, true)
        expect(store().age).toBe(22)
        expect(store.change('age')).toBeFalsy()
        expect(store.change('name')).toBeFalsy()
        expect(store.cancel('age')).toBeTruthy()
        expect(store().age).toBe(19)
        expect(store.change('age')).toBeFalsy()
        expect(store.change('name')).toBeFalsy()
        expect(store.cancel('age')).toBeFalsy()
    })

    it('auto cancel', function () {
        const store = sttore({ name: 'Fredy', age: 11 })
        store.set('name', 'Miguel', true)
        expect(store.change('name')).toBeFalsy()
        store.set('name', 'Juan')
        expect(store.change('name')).toBeTruthy()
        expect(store.confirm('name')).toBeFalsy()
        expect(store.cancel('name')).toBeFalsy()
    })

    it('group set', function () {
        const store = sttore({ name: 'Eric', age: 25 })
        store.set('name', 'Pablo', true)
        expect(store.change()).toBeFalsy()
        store({ name: 'Karina', age: 22 })
        expect(store.change('name')).toBeTruthy()
        expect(store.confirm('name')).toBeFalsy()
        expect(store.cancel('name')).toBeFalsy()
    })

    it('double pending', function () {
        const store = sttore({ name: 'Eric', age: 25 })
        store.set('name', 'Pablo', true)
        store.set('age', 55, true)
        expect(store()).toMatchObject({
            name: 'Pablo',
            age: 55
        })
        expect(store.change()).toBeFalsy()
        expect(store.confirm('name')).toBeTruthy()
        expect(store.change('name')).toBeTruthy()
        expect(store.cancel('age')).toBeTruthy()
        expect(store.change('age')).toBeFalsy()
        expect(store()).toMatchObject({
            name: 'Pablo',
            age: 25
        })
    })

    it('object', function () {
        const store = sttore({
            date: '02/02/12',
            brand: { name: 'Coca Cola Light', company: 'Coca Cola' }
        })
        store.set('brand', { name: 'LiteBeam', company: 'Ubiquiti' }, true)
        expect(store.change()).toBeFalsy()
        store.confirm('brand')
        expect(store.change()).toBeTruthy()
        store.set('brand', { name: 'Rokitz 7', company: 'KRK' }, true)
        expect(store.change()).toBeTruthy()
        store.cancel('brand')
        expect(store.change()).toBeTruthy()
        expect(store().brand).toMatchObject({
            name: 'LiteBeam',
            company: 'Ubiquiti'
        })
    })

    it('array', function () {
        const store = sttore({
            date: '02/02/12',
            movies: [{ name: 'Anabelle' }, { name: 'Fast and Furious' }]
        })
        store.set('movies', [{ name: 'Mad Max' }], true)
        expect(store.change()).toBeFalsy()
        expect(store().movies).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    name: 'Mad Max'
                })
            ])
        )
        store.cancel('movies')
        expect(store().movies).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    name: 'Anabelle'
                }),
                expect.objectContaining({
                    name: 'Fast and Furious'
                })
            ])
        )
        expect(store.change()).toBeFalsy()
        store.set('movies', [{ name: 'Insidious' }], true)
        expect(store.change()).toBeFalsy()
        expect(store().movies).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    name: 'Insidious'
                })
            ])
        )
        store.confirm('movies')
        expect(store.change()).toBeTruthy()
        expect(store().movies).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    name: 'Insidious'
                })
            ])
        )
    })

    it('with type sttore', function () {
        const store = sttore({
            name: 'Juan',
            contact: sttore({
                phone: 123456789,
                name: 'Michael'
            })
        })
        store().contact.set('name', 'Luis', true)
        expect(store.change()).toBeFalsy()
        expect(store().contact.change()).toBeFalsy()
        expect(store().contact.confirm('name')).toBeTruthy()
        expect(store().contact.change()).toBeTruthy()

        store().contact.set('phone', 1111)
        store.set('contact', store().contact, true)
        expect(store().contact.change()).toBeTruthy()
        expect(store.confirm('contact')).toBeTruthy()
    })

    it('changes', function () {
        const store = sttore({
            company: 'Google',
            age: 1999,
            active: false
        })
        store.set('active', true, true)
        expect(Object.values(store.changes()).length).toBe(0)
        expect(store.changes()).toMatchObject({})
        store.confirm('active')
        expect(Object.values(store.changes()).length).toBe(1)
        expect(store.changes()).toMatchObject({
            active: true
        })
        store.set('company', 'Facebook', true)
        expect(store.changes()).toMatchObject({
            active: true
        })
        store.cancel('company')
        expect(store.changes()).toMatchObject({
            active: true
        })
    })

    it('frozen', function () {
        const store = sttore({
            company: 'Google',
            age: 1999,
            active: false
        })
        store.set('company', 'Facebook', true)
        expect(store.frozen('company')).toBe('Google')
        store.confirm('company')
        expect(store.frozen('company')).toBe('Facebook')
    })
})
