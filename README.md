# Boos

Boos is React state management made simple, it makes use of the old fashioned [observer pattern](https://refactoring.guru/design-patterns/observer) and React hooks to access and update state across the application.

## What is it a boos?
Boos stands for Boring observer because under the hood that's all that really is, and object that fits with the observer pattern

```typescript
interface Boos<T> {
  subscribe: (subscriber: Subscriber<T>) => void;
  unsubscribe: (subscriber: Subscriber<T>) => void;
  modifyValue: (modifier: ValueModifier<T>) => T;
  getValue: () => T;
}
```

This interface expose the following methods

### subscribe
Subscribe adds an observer/subscriber to the boos, an observer is a function that will be executed as soon as the boos value is modified. Besides the updated value will be passed to the subscriber to be managed in any way as it's necessary therefore allowing to separate business actions(modify the state) and those actions consequences(subscriber listening)

```typescript
boos.subscribe(updatedValue => {
  // This will be executed
})

boos.subscribe(updatedValue => {
  // This will be executed too
})
```

### unsubscribe
Sometimes a specific subscriber is not longer necessary by any reason, for instance a React component being removed from the screen thus no longer it's needed to be listening there for those cases unsubscribe method it's handy to avoid memory leaks, this removal is done by reference so same function that was added as the subscriber it must be passed as the function to be removed just as DOM addEventListener and removeEventListener works.

```typescript
function listenerFunction(updatedValue) {
  // Do something
}

boos.subscribe(listenerFunction)
// Later
boos.unsubscribe(listenerFunction)
```

### modifyValue
modifyValue receives a modifier function which will be passed the current value, it's important to have in mind how state will be changed under the hood, boos as depencency use [immer](https://immerjs.github.io/immer/) for updating the state in a inmutable way but using a simple syntax so you can choose how you would like to change the state

```typescript
// Immer simple syntax
boos.modifyValue(state => {
  state.value = "New value";
  state.products[1].price = 1000;
});

// More "inmutable" like syntax
boos.modifyValue(state => {
  return {
    ...state,
    value: "New value",
    products: state.products.map((product, i) => {
      return i === 1 ? {...product, price: 1000} : product
    })
  }
});
```

### getValue
Simply get current boos value wherever is needed.

## How create a boos?
The library expose createBoos function to create a boos, in your application create as many as you want, following flux architecture should not always be a must.

```typescript
// productsBoos.(ts|js)
import { createBoos } from 'boos';

export const products = createBoos({ initialValue: { products: [] } })

// modifiers
export function addProduct(state, newProduct) {
  state.products.push(newProduct);
}

export function removeProduct(state, productToRemove) {
  state.products = state.products.filter(product => product.id !== productToRemove.id)
}

// Piece selectors
export function getExpensiveProducts(state) {
  return state.products.filter(product => product.price > 500)
}
```

## Using it with React
In order to use a boos with React the library expose two hooks so far, useBoos and useBoosPiece

### useBoos
Allow to acces to both boos current value and boos modifyValue function

```jsx
import React from 'react';
import { useBoos } from 'boos';
import { products, removeProduct } from './productsBoos';

function YourComponent() {
  const [state, modifyValue] = useBoos(products)

  return (
    <ul>
      {state.products.map(product => (
        <li key={product.id} onClick={() => {
          modifyValue((state => removeProduct(state, product)))
        }}>
          {product.name}
        </li>
      ))}
    </ul>
  )
}
```

### useBoosPiece
Sometimes is a good idea derived the state from an existing state instead of get the state bigger to hold those values, that's the main reason behind this hook this allows us to get a computed value from the boos as well as gives memoization and value check out the box in order to avoid unnecessary state updates alongside its respective rerenders.

```jsx
import React from 'react';
import { useBoosPiece} from 'boos';
import { products, getExpensiveProducts } from './productsBoos';

function YourComponent() {
  const expensiveProducts = useBoosPiece(products, getExpensiveProducts);

  return (
    <ul>
      <h2>These are the expensive products</h2>
      {expensiveProducts.map(product => (
        <li key={product.id}>
          <strong>{product.name}: </strong>
          {product.price}
        </li>
      ))}
    </ul>
  )
}
```

## Persistance
Sometimes it's necessary to persist state through user reloads or user sessions therefore boos expose an easy way to save a specific boos value in localStorage, sessionStorage and cookies are comming, this through persistance builders

```typescript
import { createBoos, createLocalStoragePersistance, createSessionStoragePersistance } from 'boos';

const products = createBoos({
  initialValue: { products: [] },
  options: {
    persistanceBuilder: createLocalStoragePersistance('products') // or createSessionStoragePersistance('products')
  }
});
```

This will save products value in localStorage/sessionStorage and will refresh the value using the stored value

## Logging

Logging it's very important in development for debugging purposes so to enable it the createBoos function offers it through its options

```typescript
import { createBoos } from 'boos';

const products = createBoos({
  initialValue: { products: [] },
  options: {
    logger: {
      tag: 'products',
      active: true,
    },
  },
});
```
This will show on the console both last boos value and the new one just after the value was modified by modifyValue.

active property can be a function as well, this function will receive the boos current state so you can show the logs in function of your boos value
```typescript
import { createBoos } from 'boos';

const products = createBoos({
  initialValue: { products: [] },
  options: {
    logger: {
      tag: 'products',
      active: (state) => state.products.length < 20,
    },
  },
});
```