import { IElbwalker, Utils, Walker } from '../types';
import { getElbAttributeName, getElbValues } from './walker';

const w = window;
export function trycatch<P extends unknown[], R>(
  fn: (...args: P) => R | undefined,
): (...args: P) => R | undefined {
  return function (...args: P): R | undefined {
    try {
      return fn(...args);
    } catch (err) {
      console.error(IElbwalker.Commands.Walker, err);
      return;
    }
  };
}

export function randomString(): string {
  return Math.random().toString(36).slice(2, 8);
}

export function getGlobalProperties(prefix: string): Walker.Properties {
  const globalsName = getElbAttributeName(
    prefix,
    IElbwalker.Commands.Globals,
    false,
  );
  const globalSelector = `[${globalsName}]`;
  let values = {};

  document.querySelectorAll(globalSelector).forEach((element) => {
    values = assign(
      values,
      getElbValues(prefix, element, IElbwalker.Commands.Globals, false),
    );
  });

  return values;
}

export function splitAttribute(
  str: string,
  separator = ';',
): Walker.Attributes {
  const values: Walker.Attributes = [];

  if (!str) return values;

  const reg = new RegExp(`(?:[^${separator}']+|'[^']*')+`, 'ig');
  return str.match(reg) || [];
}

export function splitKeyVal(str: string): Walker.KeyVal {
  const [key, value] = str.split(/:(.+)/, 2);
  return [trim(key), trim(value)];
}

export function parseAttribute(str: string): Walker.KeyVal {
  // action(a, b, c)
  const [key, value] = str.split('(', 2);
  const param = value ? value.slice(0, -1) : ''; // Remove the )
  // key = 'action'
  // param = 'a, b, c'
  return [key, param];
}

function trim(str: string): string {
  // Remove quotes and whitespaces
  return str ? str.trim().replace(/^'|'$/g, '').trim() : '';
}

export function getAttribute(element: Element, name: string): string {
  return element.getAttribute(name) || '';
}

export function assign(
  target: Walker.Properties,
  source: Walker.Properties = {},
): Walker.Properties {
  // Check for array properties to merge them before overriding
  Object.entries(source).forEach(([key, sourceProp]) => {
    const targetProp = target[key];

    // Only merge  arrays
    if (Array.isArray(targetProp) && Array.isArray(sourceProp)) {
      source[key] = sourceProp.reduce(
        (acc, item) => {
          // Remove duplicates
          return acc.includes(item) ? acc : [...acc, item];
        },
        [...targetProp],
      );
    }
  });

  return { ...target, ...source };
}

export function isArgument(event: unknown) {
  return {}.hasOwnProperty.call(event, 'callee');
}

export const elb: IElbwalker.Elb = function () {
  (w.elbLayer = w.elbLayer || []).push(arguments);
};

export function castValue(value: unknown): Walker.Property {
  if (value === 'true') return true;
  if (value === 'false') return false;

  const number = Number(value); // Converts "" to 0
  if (value == number && value !== '') return number;

  return String(value);
}

export function throttle<P extends unknown[], R>(
  fn: (...args: P) => R | undefined,
  delay = 1000,
): (...args: P) => R | undefined {
  let isBlocked: NodeJS.Timeout | 0;

  return function (...args: P): R | undefined {
    // Skip since function is still blocked by previous call
    if (isBlocked) return;

    // Set a blocking timeout
    isBlocked = setTimeout(() => {
      // Unblock function
      isBlocked = 0;
    }, delay);

    // Call the function
    return fn(...args);
  };
}

export function debounce<P extends unknown[], R>(
  fn: (...args: P) => R,
  wait = 1000,
) {
  let timer: NodeJS.Timeout;

  return (...args: P): Promise<R> => {
    // abort previous invocation
    clearTimeout(timer);

    // Return value as promise
    return new Promise((resolve) => {
      // Schedule execution
      timer = setTimeout(() => {
        // Call the function
        resolve(fn(...args));
      }, wait);
    });
  };
}

// @TODO add max age support
// @TODO cookie support
// @TODO minify switch to HOF
export function setItem(
  key: string,
  value: Walker.Property,
  storage: Utils.Storage.Type = Utils.Storage.Type.Session,
) {
  const maxAge = Date.now(); // @TODO add max age
  const item: Utils.Storage.Value = { t: maxAge, v: String(value) };
  const stringify = JSON.stringify(item);

  switch (storage) {
    case Utils.Storage.Type.Cookie:
      // @TODO
      break;
    case Utils.Storage.Type.Local:
      w.localStorage.setItem(key, stringify);
      break;
    case Utils.Storage.Type.Session:
      w.sessionStorage.setItem(key, stringify);
      break;
  }
}

// @TODO add max age support
export function getItem(
  key: string,
  value: Walker.Property,
  storage: Utils.Storage.Type = Utils.Storage.Type.Session,
) {}

export function removeItem(
  key: string,
  storage: Utils.Storage.Type = Utils.Storage.Type.Session,
) {}
