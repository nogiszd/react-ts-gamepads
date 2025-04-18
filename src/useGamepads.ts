import { useCallback, useEffect, useRef } from 'react';
import { GamepadRef } from './types';

const useGamepads = (cb?: (data: GamepadRef) => void) => {
  const gamepads = useRef<GamepadRef>({});
  const request = useRef<number | null>(null);

  const isNotSsr = typeof window !== 'undefined';

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
   * Gamepad connect listener handler
   * @param {Event} e Event object
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GamepadEvent}
   */
  const connectGamepadHandler = (e: Event): void => {
    addGamepad((e as GamepadEvent).gamepad);
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
   * Add event listener for gamepad connection
   */
  useEffect(() => {
    window.addEventListener('gamepadconnected', connectGamepadHandler);

    return () => {
      window.removeEventListener('gamepadconnected', connectGamepadHandler);
    };
  }, []);

  // Update gamepad state on each "tick"
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
