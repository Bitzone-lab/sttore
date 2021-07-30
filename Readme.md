Sttore
=========

[![install size](https://packagephobia.com/badge?p=sttore)](https://packagephobia.com/result?p=sttore)
[![Package Quality](https://packagequality.com/shield/sttore.svg)](https://packagequality.com/#?package=sttore)
[![David Dependencies](https://david-dm.org/Bitzone-lab/sttore.svg)](https://david-dm.org/Bitzone-lab/sttore)

> State Manager

```
npm install sttore
```
## Use

```js
import sttore from 'sttore'
```
or
```js
const sttore = require('sttore')
```


```js
const store = sttore({
    name: 'Miguel',
    age: 24
})

store() // { name: 'Miguel', age: 24 }
```

## Update

```js
const store = sttore({
    name: 'Miguel',
    age: 24
})

store({ ...store(), age: 29 }) // { name: 'Miguel', age: 29 }
```

or use set

```js
store.set('name', 'Juan') // true
store() // { name: 'Juan', age: 29 }
```

## Changes

Identify the states that had a change.

```js
const store = sttore({
    name: 'María',
    age: 18
})

store.set('age', 15)
store.change('age') // true
store.change() // true
store.change('name') // false
```

You can get only the states that had change.

```js
store.changes() // { age: 15 }
```

You can omit the states that you don't want to know if it had changes.

```js
store.omit(['age']) // false
store.omit(['name']) // true
```

Or vice versa

```js
store.only(['age']) // true
store.only(['name']) // false
```
## Pending

They are updates that are pending confirmation.

A pending data cannot be taken as a change, for this it is required to be confirmed.
For an update into pending mode, it should be passed as the third parameter a `true`.

```js
const store = sttore({
    name: 'María',
    age: 18
})
store.set('name', 'Ivan', true)
store.set('age', 22)
store.changes() // { age: 22 }
```

To confirm the update use the `confirm` method or use the `cancel` method to reject

```js
store.confirm('name') // true
store.changes()  // { name: 'Ivan', age: 22 }
```
or cancel
```js
store.cancel('name') // true
store.changes()  // { age: 22 }
```

You can confirm or cancel all.

```js
states.confirm()
// or
store.cancel()
```
## Helper

The helpers are just an extra helpful information. This can be used for validation messages for example.

```js
store.helper('name', 'This name is required') // 'This name is required'
store.helper('name') // 'This name is required'
store.helpers() // { name: 'This name is required', age: '' }
store.helpers({ name: '', age: 'Its not numeric' }) // { name: '', age: 'Its not numeric' }
```

Helpers are originated by states, by default their value is an empty string.

## Restore

You can restore the `helpers` or cancel all `pending` data or both.

```js
// restore both
store.restore()
// cancel all update pending
store.restore('pending')
// restore helper
store.restore('helper')
```

## Initial

Initial is in charge of initializing the state.

```js
const store = sttore({
    name: 'María',
    age: 18
})

store.set('name', 'Leo')
store.set('age', 24)
store.change() // true
store() // { name: 'Leo', age: 24 }

store.init()
store() // { name: 'María', age: 18 }
store.change() // false
```

You can specify an initial state for it.

```js
store.init(store)
store() // { name: 'Leo', age: 24 }
store.change() // false
```

## Events

They listen to the changes in the values of the states.

```js
const store = sttore({ name: 'erick', age: 15 })
store.on('name', function (value, by) {
    // value = juan
    // by = set
})
store.on('age', function (val, by) {
    // value = 18
    // by = set
})
store.set('name', 'juan')
store.set('age', 18)
```

The events work like a middleware, you can discard that value change by returning a `false`.

```js
const store = sttore({ name: 'erick', age: 15 })
store.on('name', function (value, by) {
    // value = juan
    return false // discarding change 
})
store.on('age', function (val, by) {
    // value = 18
    return true // is equal to not returning anything
})
store.set('name', 'juan')
store().name // 'erick'
store.set('age', 18)
store().age // 18
```
It is possible to force an event with emit.

```js
store.emit('name')
```

**By**

|Name|description|
|---|----|
| emit | Event emitted by the emit method  |
| set | Event emitted by the set and store method -> `store({ ... })`
| confirm | Event emitted by the confirm method  |
| cancel | Event emitted by the cancel method  |

## Nesting

It is possible to nest several stores.

```js
const store = sttore({
    date: '12/12/12',
    contact: sttore({
        name: 'Diana',
        phone: 123456789
    })
})

store().contact().name // Diana
store().contact().phone // 123456789
store().contact.set('name', 'Raúl')
store().contact().name // Raúl
store().contact.change('name') // true
store().contact.change('phone') // false
store.change() // true
```
