declare global {
  interface Gamepad {
    /**
     * Custom compatibility layer for browsers that do not support the standard yet.
     * @borrows GamepadHapticActuator
     */
    vibrationActuator: readonly GamepadHapticActuator;
  }

  type GamepadHapticEffectType = 'dual-rumble' | 'trigger-rumble';

  type GamepadHapticEffectParams = {
    'dual-rumble': {
      duration?: number;
      startDelay?: number;
      strongMagnitude?: number;
      weakMagnitude?: number;
    };
    'trigger-rumble': {
      duration?: number;
      startDelay?: number;
      strongMagnitude?: number;
      weakMagnitude?: number;
      leftTrigger?: number;
      rightTrigger?: number;
    };
  };

  type GamepadHapticsResult = 'complete' | 'preempted';

  /**
   * @extends {GamepadHapticActuator}
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GamepadHapticActuator}
   */
  interface GamepadHapticActuator {
    effects: readonly GamepadHapticEffectType[];
    playEffect<T extends GamepadHapticEffectType>(
      type: T,
      params: GamepadHapticEffectParams[T]
    ): Promise<GamepadHapticsResult>;
  }

  interface Navigator {
    /**
     * @deprecated WebKit now supports `getGamepads()`, left only for compatibility purposes.
     **/
    webkitGetGamepads?: () => Gamepad[];
  }
}

export {};
