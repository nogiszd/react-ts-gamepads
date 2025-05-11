import { useCallback, useEffect, useRef } from 'react';
import { GamepadRef } from './types';

const useGamepads = (cb?: (data: GamepadRef) => void) => {
  const gamepads = useRef<GamepadRef>({});
  const request = useRef<number | null>(null);

  const isNotSsr = typeof window !== 'undefined';

  /**
   * Add gamepad to the state
   * @param {Gamepad} gamepad Gamepad object
   */
  const addGamepad = (gamepad: Gamepad) => {
    gamepads.current = {
      ...gamepads.current,
      [gamepad.index]: gamepad,
    };

    // Send data to provided callback
    if (typeof cb === 'function') {
      cb(gamepads.current);
    }
  };

  /**
   * Remove gamepad from the state
   * @param {Gamepad} gamepad Gamepad object
   */
  const removeGamepad = (gamepad: Gamepad) => {
    const newGamepads = { ...gamepads.current };
    delete newGamepads[gamepad.index];
    gamepads.current = newGamepads;

    // Send updated data to provided callback
    if (typeof cb === 'function') {
      cb(gamepads.current);
    }
  };

  /**
   * Gamepad connect listener handler
   * @param {Event} e Event object
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GamepadEvent}
   */
  const connectGamepadHandler = (e: Event): void => {
    addGamepad((e as GamepadEvent).gamepad);
  };

  /**
   * Gamepad disconnect listener handler
   * @param {Event} e Event object
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GamepadEvent}
   */
  const disconnectGamepadHandler = (e: Event): void => {
    removeGamepad((e as GamepadEvent).gamepad);
  };

  /**
   * Scan existing gamepads connected to the system
   */
  const scanGamepads = () => {
    // Grab gamepads via navigator object
    const detectedGamepads = navigator.getGamepads
      ? navigator.getGamepads()
      : navigator.webkitGetGamepads
        ? navigator.webkitGetGamepads()
        : [];

    // Loop through all existing controllers and add to the state
    detectedGamepads.forEach((gamepad) => {
      if (gamepad) {
        addGamepad(gamepad);
      }
    });
  };

  /**
   * Add event listeners for gamepad connection and disconnection
   */
  useEffect(() => {
    window.addEventListener('gamepadconnected', connectGamepadHandler);
    window.addEventListener('gamepaddisconnected', disconnectGamepadHandler);

    return () => {
      window.removeEventListener('gamepadconnected', connectGamepadHandler);
      window.removeEventListener(
        'gamepaddisconnected',
        disconnectGamepadHandler
      );
    };
  }, []);

  /**
   * Method for updating gamepad state on each "tick"
   */
  const update = useCallback(() => {
    if (isNotSsr) {
      scanGamepads();
    }

    request.current = requestAnimationFrame(update);
  }, [isNotSsr]);

  useEffect(() => {
    request.current = requestAnimationFrame(update);

    return () => cancelAnimationFrame(request.current!);
  }, []);

  return gamepads;
};

export default useGamepads;
