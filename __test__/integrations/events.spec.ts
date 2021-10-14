import sttore from '../../src'

describe('events', () => {
    it('on set', function () {
        const store = sttore({ name: 'erick', age: 15 })
        store.on('name', function (value, by) {
            expect(by).toBe('set')
            expect(value).toBe('juan')
            expect(store().name).toBe('erick')
        })
        store.on('age', function (val, by) {
            expect(by).toBe('set')
            expect(val).toBe(18)
        })
        store.set('name', 'juan')
        store.set('age', 18)
        expect(store().name).toBe('juan')
    })

    it('on emit', function () {
        const store = sttore({ name: 'erick', age: 15 })
        store.on('name', function (value, by) {
            expect(by).toBe('emit')
            expect(value).toBe('erick')
        })
        store.emit('name')
    })

    it('on confirm', function () {
        const store = sttore({ name: 'erick', age: 15 })
        store.on('age', function (val, by) {
            if (by === 'confirm') {
                expect(by).toBe('confirm')
                expect(val).toBe(17)
            }
        })
        store.set('age', 17, true)
        expect(store.confirm('age')).toBeTruthy()
    })

    it('on cancel', function () {
        const store = sttore({ name: 'erick', age: 15 })
        store.on('age', function (val, by) {
            if (by === 'cancel') {
                expect(by).toBe('cancel')
                expect(val).toBe(17)
            }
        })
        store.set('age', 17, true)
        expect(store.cancel('age')).toBeTruthy()
    })

    it('on store', function () {
        const store = sttore({ name: 'erick', age: 15 })
        store.on('name', function (val, by) {
            expect(by).toBe('set')
            expect(val).toBe('juan')
        })
        store.on('age', function (val, by) {
            expect(by).toBe('set')
            expect(val).toBe(17)
        })
        store({ name: 'juan', age: 17 })
    })

    it('on pass', function () {
        const store = sttore({ name: 'erick', age: 15 })
        store.on('name', function (value, by) {
            expect(by).toBe('set')
            expect(value).toBe('juan')
            return true
        })
        store.on('age', function (val, by) {
            expect(by).toBe('set')
            expect(val).toBe(18)
            return true
        })
        store.set('name', 'juan')
        store.set('age', 18)
        expect(store().name).toBe('juan')
        expect(store().age).toBe(18)
    })

    it('on reject', function () {
        const store = sttore({ name: 'erick', age: 15 })
        store.on('name', function (value, by) {
            expect(by).toBe('set')
            expect(value).toBe('juan')
            return false
        })
        store.on('age', function (val, by) {
            expect(by).toBe('set')
            expect(val).toBe(18)
            return false
        })
        store.set('name', 'juan')
        store.set('age', 18)
        expect(store().name).toBe('erick')
        expect(store().age).toBe(15)
    })

    it('remove event', function () {
        const store = sttore({ name: 'erick', age: 15 })
        store.on('name', function () {
            return false
        })
        store.set('name', 'juan')
        expect(store().name).toBe('erick')
        store.on('name', null)
        store.set('name', 'juan')
        expect(store().name).toBe('juan')
    })
})
