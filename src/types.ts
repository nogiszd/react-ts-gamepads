import React from 'react';

export type GamepadEntity = Pick<Gamepad, 'buttons' | 'id' | 'axes'>;

export type GamepadEntities = Record<Gamepad['index'], GamepadEntity>;

export interface GamepadRef {
  [key: number]: Gamepad;
}

export interface GamepadContext {
  gamepads?: GamepadEntities;
  setGamepads?: React.Dispatch<
    React.SetStateAction<GamepadEntities | undefined>
  >;
}
