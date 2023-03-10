import { useEffect, useRef } from 'react';
import { haveGamepadEvents } from './haveGamepadEvents';
import { GamepadRef } from './types';

const useGamepads = (cb?: (data: GamepadRef) => void) => {
  const gamepads = useRef<GamepadRef>({});
  const request = useRef<number>();

  const addGamepad = (gamepad: Gamepad) => {
    gamepads.current = {
      ...gamepads.current,
      [gamepad.index]: gamepad,
    };

    // Send data to provided callback
    typeof cb === 'function' && cb(gamepads.current);
  };

  /**
   * Gamepad connect listener handler
   * @param {Event} e
   */
  const connectGamepadHandler = (e: Event) => {
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
    detectedGamepads.forEach(gamepad => {
      const newGamepads = gamepad;

      if (newGamepads && newGamepads !== null) {
        addGamepad(newGamepads);
      }
    });
  };

  /**
   * Add event listener for gamepad connection
   */
  useEffect(() => {
    window.addEventListener('gamepadconnected', connectGamepadHandler);

    return () =>
      window.removeEventListener('gamepadconnected', connectGamepadHandler);
  }, []);

  // Update gamepad state on each "tick"
  const update = () => {
    if (!haveGamepadEvents) {
      scanGamepads();
    }
    request.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    request.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(request.current!);
  }, []);

  return gamepads;
};

export default useGamepads;
