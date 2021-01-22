Sttore
=========

> State Manager

```
npm install sttore
```

```js
import sttore from 'sttore'
```
or
```js
const sttore = require('sttore')
```

## First Store

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

## Helper

The helpers are just an extra helpful information. This can be used for validation messages for example.

```js
store.helper('name', 'This name is required') // 'This name is required'
store.helper('name') // 'This name is required'
store.helpers() // { name: 'This name is required', age: '' }
store.helpers({ name: '', age: 'Its not numeric' }) // { name: '', age: 'Its not numeric' }
```

Helpers are originated by states, by default their value is an empty string.

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
