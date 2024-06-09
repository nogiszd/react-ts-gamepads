/**
 * Boolean to tell if browser supports gamepad events
 */
export const haveGamepadEvents =
  typeof window !== 'undefined' && 'ongamepadconnected' in window;
