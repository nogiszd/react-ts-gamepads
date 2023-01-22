# react-ts-gamepads 🎮 ➡️ ⚛️

> Library to support Gamepad API in modern React ⚛️

This is a maintained fork of [react-gamepads](https://github.com/whoisryosuke/react-gamepads) with detailed TypeScript types and updated libraries.

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>

## 🛫 Getting started

```bash
npm i react-ts-gamepads
```

There are two approaches: [hook](#usegamepads-hook) and [context](#gamepadsprovider-context)

### `useGamepads` hook

With this hook you can **retrieve** all gamepad inputs. This allows you to have a component "react" to gameplay input as it's received.

In this example, we take the input and set the component's state to it. This lets you use the state inside the component and have it change.

```jsx
import { useState } from 'react';
import { useGamepads, GamepadRef } from 'react-ts-gamepads';

const App = () => {
  const [gamepads, setGamepads] = useState<GamepadRef>({});
  useGamepads(gamepads => setGamepads(gamepads));

  return <div>{gamepads[0].buttons[4].pressed}</div>;
};

export default App;
```

> Difference between `react-gamepads` and `react-ts-gamepads` are that this library is **strongly typed**, although original library is also written in TypeScript.
> You can import provided types and use them in `useState` to avoid type infering.

### `<GamepadsProvider>` context

With context, you can have parts (or the entire app) to subscribe to the state changes, in that case _gamepad state_.

1. Make an consumer component with the usage of `useContext` hook.

```jsx
import { useContext } from 'react';
import { GamepadsContext } from 'react-ts-gamepads';

const Example = () => {
  const { gamepads } = useContext(GamepadsContext);

  return <div>{gamepads[0].buttons[4].pressed}</div>;
};

export default Example;
```

2. Wrap your `App.tsx` (or another main file) in the Provider and import your newly made component

```jsx
import { GamepadsProvider } from 'react-ts-gamepads';
import Example from './components/Example';

const App = () => {
  return (
    <GamepadsProvider>
      <Example />
    </GamepadsProvider>
  );
};
```

It is your choice which approach you will choose, or which fits your usage better.

## 📚 Credits

- [react-gamepads](https://github.com/whoisryosuke/react-gamepads)
- [Gamepad API - MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API)
