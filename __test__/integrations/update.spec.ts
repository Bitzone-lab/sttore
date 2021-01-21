import sttore from '../../src'

describe('update', function () {
    it('basic', function () {
        const store = sttore({
            name: 'juan',
            age: 1,
            active: false
        })
        expect(store()).toMatchObject({ name: 'juan', age: 1, active: false })
        const probably = { name: 'mario', age: 5, active: true }
        expect(store({ name: 'mario', age: 5, active: true })).toMatchObject(probably)
        expect(store()).toMatchObject(probably)
    })

    it('set', function () {
        const store = sttore({ age: 4, country: 'Canada' })
        store.set('age', 5)
        expect(store().age).toBe(5)
        store.set('age', 18)
        expect(store().age).toBe(18)
        store.set('country', 'Brazil')
        expect(store().country).toBe('Brazil')
    })

    it('object', function () {
        const store = sttore({
            option: { label: 'label1', value: 1 },
            name: 'Manuel',
            contact: { name: 'Diana', phone: 45 }
        })
        store.set('option', { label: 'label2', value: 2 })
        expect(store()).toMatchObject({
            option: { label: 'label2', value: 2 },
            name: 'Manuel'
        })
    })

    it('array', function () {
        const store = sttore({
            lines: [1, 5, 9],
            max: 10,
            min: 0
        })
        store.set('lines', [3, 5, 11])
        expect(store().lines).toEqual(expect.arrayContaining([3, 5, 11]))
        store.set('lines', [13, 45])
        expect(store().lines).toEqual(expect.arrayContaining([13, 45]))
        expect(store().max).toBe(10)
        expect(store().min).toBe(0)
    })

    it('object and array', function () {
        const store = sttore({
            users: [
                { id: 1, name: 'Luis' },
                { id: 2, name: 'Manuel' }
            ],
            day: 10,
            contact: {
                phone: 15151520,
                email: 'test@gmail.com'
            },
            active: false,
            date: '12/12/2020'
        })
        store.set('users', [{ id: 3, name: 'Ana' }])
        store.set('day', 9)
        store.set('contact', { phone: 999999, email: 'admin@gmail.com' })
        expect(store().users).toEqual(
            expect.arrayContaining([expect.objectContaining({ id: 3, name: 'Ana' })])
        )
        expect(store().day).toBe(9)
        expect(store().contact).toMatchObject({ phone: 999999, email: 'admin@gmail.com' })
    })

    it('type sttore', function () {
        const store = sttore({
            name: 'Juan',
            contact: sttore({
                phone: 123456789,
                name: 'Michael'
            })
        })

        expect(store().contact()).toMatchObject({
            phone: 123456789,
            name: 'Michael'
        })

        store({ ...store(), name: 'Ana' })
        expect(store().name).toBe('Ana')

        store({ ...store(), contact: sttore({ phone: 987654321, name: 'Días' }) })
        expect(store().contact()).toMatchObject({
            phone: 987654321,
            name: 'Días'
        })

        store().contact({ phone: 12345, name: 'Pedro' })
        expect(store().contact()).toMatchObject({
            phone: 12345,
            name: 'Pedro'
        })

        store({ ...store(), name: 'Mary' }).contact({ phone: 9999999, name: 'Juana' })
        expect(store().name).toBe('Mary')
        expect(store().contact()).toMatchObject({
            phone: 9999999,
            name: 'Juana'
        })
    })

    it('set in type sttore', function () {
        const store = sttore({
            age: 15,
            country: sttore({
                name: 'Germany',
                url: '/path'
            })
        })

        store.set('age', 9)
        expect(store().age).toBe(9)
        store().country.set('name', 'Japan')
        store().country.set('url', '/japan')
        expect(store().country()).toMatchObject({
            name: 'Japan',
            url: '/japan'
        })
        store.set('country', sttore({ name: 'EEUU', url: '/eeuu' }))
        expect(store().country()).toMatchObject({
            name: 'EEUU',
            url: '/eeuu'
        })
    })
})
