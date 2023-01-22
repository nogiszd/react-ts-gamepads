declare global {
  interface Navigator {
    webkitGetGamepads?: () => Gamepad[];
  }
}

export {};
