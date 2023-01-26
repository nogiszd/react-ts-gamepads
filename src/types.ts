import React from 'react';

export type Gamepads = Record<Gamepad['index'], Omit<Gamepad, 'index'>>;

export interface GamepadRef {
  [key: number]: Gamepad;
}

export interface GamepadContext {
  gamepads?: Gamepads;
  setGamepads?: React.Dispatch<React.SetStateAction<Gamepads | undefined>>;
}
