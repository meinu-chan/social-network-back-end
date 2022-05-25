/* eslint-disable no-console */

export function logger<E, P>(event: E, payload: P) {
  console.log('\x1b[35mEvent: \x1b[0m', event);
  console.log('\x1b[35mPayload: \x1b[0m', payload);
}
