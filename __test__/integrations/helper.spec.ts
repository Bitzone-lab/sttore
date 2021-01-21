import sttore from '../../src'

describe('helper', function () {
    it('initial', function () {
        const store = sttore({ name: 'Mario', day: 1 })
        expect(store.helper('name', 'MODE_1')).toBe('MODE_1')
        expect(store.helper('name')).toBe('MODE_1')
        expect(store.helper('day')).toBe('')
    })

    it('helpers', function () {
        const store = sttore({ name: 'Mario', day: 1 })
        const helpers = store.helpers({
            name: 'MODE_1',
            day: 'MODE_2'
        })
        expect(helpers).toMatchObject({
            name: 'MODE_1',
            day: 'MODE_2'
        })
        expect(store.helpers()).toMatchObject({
            name: 'MODE_1',
            day: 'MODE_2'
        })
        expect(store.helper('day')).toBe('MODE_2')
        expect(store.helper('name')).toBe('MODE_1')
    })
})
