import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { GamepadContext, Gamepads } from './types';

const GamepadsContext = createContext<GamepadContext>({});

const GamepadsProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [gamepads, setGamepads] = useState<Gamepads>({});
  const requestRef = useRef<number>();

  const hasGamepadEvents =
    typeof window !== 'undefined' && 'ongamepadconnected' in window;

  const addGamepad = useCallback(
    (gamepad: Gamepad) => {
      setGamepads(oldGamepads => ({
        ...oldGamepads,
        [gamepad.index]: {
          ...gamepad,
        },
      }));
    },
    [gamepads, setGamepads]
  );

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
  const scanGamepads = useCallback(() => {
    // Grab gamepads via navigator object

    const detectedGamepads = navigator.getGamepads
      ? navigator.getGamepads()
      : navigator.webkitGetGamepads
      ? navigator.webkitGetGamepads()
      : [];

    // Loop through all existing controllers and add to the state
    detectedGamepads.forEach(gamepad => {
      if (gamepad) {
        addGamepad(gamepad);
      }
    });
  }, [addGamepad]);

  /**
   * Add event listener for gamepad connection
   */
  useEffect(() => {
    window.addEventListener('gamepadconnected', connectGamepadHandler);

    return window.removeEventListener(
      'gamepadconnected',
      connectGamepadHandler
    );
  });

  // Update gamepad state on each "tick"
  const update = useCallback(() => {
    if (!hasGamepadEvents) {
      scanGamepads();
    }

    requestRef.current = requestAnimationFrame(update);
  }, [requestRef, scanGamepads, hasGamepadEvents]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [update]);

  return (
    <GamepadsContext.Provider
      value={{
        gamepads,
        setGamepads,
      }}
    >
      {children}
    </GamepadsContext.Provider>
  );
};

export { GamepadsProvider, GamepadsContext };
