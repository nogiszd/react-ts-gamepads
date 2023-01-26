declare global {
  interface Gamepad {
    vibrationActuator: readonly GamepadHapticActuator;
  }

  interface GamepadHapticActuator {
    playEffect: (
      type: GamepadHapticActuatorType,
      params: {
        duration?: number;
        startDelay?: number;
        strongMagnitude?: number;
        weakMagnitude?: number;
      }
    ) => void;
  }

  interface Navigator {
    webkitGetGamepads?: () => Gamepad[];
  }
}

export {};
