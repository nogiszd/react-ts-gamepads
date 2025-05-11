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
  const requestRef = useRef<number | null>(null);

  const isNotSsr = typeof window !== 'undefined';

  /**
   * Add gamepad to the state
   * @param {Gamepad} gamepad Gamepad object
   */
  const addGamepad = useCallback(
    (gamepad: Gamepad) => {
      setGamepads((oldGamepads) => ({
        ...oldGamepads,
        [gamepad.index]: {
          ...gamepad,
        },
      }));
    },
    [gamepads, setGamepads]
  );

  /**
   * Remove gamepad from the state
   * @param {Gamepad} gamepad Gamepad object
   */
  const removeGamepad = useCallback(
    (gamepad: Gamepad) => {
      setGamepads((oldGamepads) => {
        const newGamepads = { ...oldGamepads };
        delete newGamepads[gamepad.index];
        return newGamepads;
      });
    },
    [setGamepads]
  );

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
  const scanGamepads = useCallback(() => {
    // Grab gamepads via navigator object
    const detectedGamepads = navigator.getGamepads
      ? navigator.getGamepads()
      : navigator.webkitGetGamepads
        ? navigator.webkitGetGamepads()
        : [];

    // Loop through all existing controllers and add to them the state
    detectedGamepads.forEach((gamepad) => {
      if (gamepad) {
        addGamepad(gamepad);
      }
    });
  }, [addGamepad]);

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
  });

  /**
   * Method for updating gamepad state on each "tick"
   */
  const update = useCallback(() => {
    if (isNotSsr) {
      scanGamepads();
    }

    requestRef.current = requestAnimationFrame(update);
  }, [isNotSsr, scanGamepads]);

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
