import {
  debounce,
  elb,
  getItem,
  getMarketingParameters,
  isVisible,
  removeItem,
  getSession,
  setItem,
  throttle,
} from '../lib/utils';
import { IElbwalker, Utils, Walker } from '../types';

const w = window;

const mockFn = jest.fn(); //.mockImplementation(console.log);

describe('Utils', () => {
  beforeEach(() => {
    // reset DOM with event listeners etc.
    document.body = document.body.cloneNode() as HTMLElement;

    jest.clearAllMocks();
    jest.resetModules();
    jest.useFakeTimers();
  });

  test('elb', () => {
    w.elbLayer = undefined as any;
    elb('e a');
    expect(w.elbLayer).toBeDefined;

    w.elbLayer.push = mockFn;
    elb('e a');
    expect(mockFn).toBeCalledWith(expect.objectContaining(['e a']));
  });

  test('isVisible', () => {
    const innerHeight = w.innerHeight;
    w.innerHeight = 100; // Create a small window

    let x = 25,
      y = 25,
      width = 50,
      height = 50,
      top = 10,
      right = 25,
      bottom = 25,
      left = 25;

    // Create a mocked element
    const elem = document.createElement('div');
    Object.defineProperty(elem, 'offsetWidth', {
      value: width,
      writable: true,
    });
    Object.defineProperty(elem, 'offsetHeight', {
      value: height,
      writable: true,
    });
    Object.defineProperty(elem, 'clientHeight', {
      value: height,
      writable: true,
    });
    elem.getBoundingClientRect = jest.fn(() => ({
      x,
      y,
      width,
      height,
      top,
      right,
      bottom,
      left,
      toJSON: jest.fn,
    }));
    document.elementFromPoint = (x: number, y: number) => {
      return elem;
    };
    document.body.appendChild(elem);

    expect(isVisible(elem)).toBeTruthy();

    elem.style.display = 'none';
    expect(isVisible(elem)).toBeFalsy();
    elem.style.display = 'block';
    expect(isVisible(elem)).toBeTruthy();

    elem.style.visibility = 'hidden';
    expect(isVisible(elem)).toBeFalsy();
    elem.style.visibility = 'visible';
    expect(isVisible(elem)).toBeTruthy();

    elem.style.opacity = '0.0';
    expect(isVisible(elem)).toBeFalsy();
    elem.style.opacity = '1';
    expect(isVisible(elem)).toBeTruthy();

    Object.defineProperty(elem, 'clientHeight', {
      value: 250,
      writable: true,
    });
    expect(isVisible(elem)).toBeTruthy();

    w.innerHeight = innerHeight;
  });

  test('throttle', () => {
    const fn = throttle(mockFn, 50);

    fn();
    expect(mockFn).toHaveBeenCalled();
    jest.clearAllMocks();

    fn();
    expect(mockFn).not.toHaveBeenCalled();
    jest.clearAllMocks();

    jest.advanceTimersByTime(50);

    fn();
    expect(mockFn).toHaveBeenCalled();
    jest.clearAllMocks();

    jest.advanceTimersByTime(50);

    fn('arg');
    expect(mockFn).toHaveBeenCalledWith('arg');
  });

  test('debounce', async () => {
    let fn = debounce(mockFn);

    fn();
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);
    expect(mockFn).toHaveBeenCalled();

    jest.clearAllMocks();
    fn = debounce(mockFn, 50);

    fn();
    expect(mockFn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(49);
    expect(mockFn).not.toHaveBeenCalled();
    fn();
    jest.advanceTimersByTime(2);
    expect(mockFn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(99);
    expect(mockFn).toHaveBeenCalled();

    fn('arg');
    jest.advanceTimersByTime(50);
    expect(mockFn).toHaveBeenCalledWith('arg');
  });

  test('storage', async () => {
    const key = 'id';
    const value = 'abc';

    // Session
    setItem(key, value);
    expect(getItem(key)).toBe(value);
    removeItem(key);
    expect(getItem(key)).toBe('');
    w.sessionStorage.setItem(key, 's');
    expect(getItem(key)).toBe('s');

    // Local
    setItem(key, value, 1, Utils.Storage.Type.Local);
    expect(getItem(key, Utils.Storage.Type.Local)).toBe(value);
    removeItem(key, Utils.Storage.Type.Local);
    expect(getItem(key, Utils.Storage.Type.Local)).toBe('');

    // Cookie
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: '',
    });
    setItem(key, value, 1, Utils.Storage.Type.Cookie);
    expect(getItem(key, Utils.Storage.Type.Cookie)).toBe(value);
    removeItem(key, Utils.Storage.Type.Cookie);
    expect(getItem(key, Utils.Storage.Type.Cookie)).toBe('');
    expect(getItem('foo', Utils.Storage.Type.Cookie)).toBe('');
    setItem(key, value, 1, Utils.Storage.Type.Cookie, 'elbwalker.com');
    expect(document.cookie).toContain('domain=elbwalker.com');

    // Expiration Session
    setItem(key, value, 5);
    expect(getItem(key)).toBe(value);
    jest.advanceTimersByTime(6 * 60 * 1000);
    expect(w.sessionStorage.getItem(key)).toBeDefined();
    expect(getItem(key)).toBe('');
    expect(w.sessionStorage.getItem(key)).toBeNull();

    // Expiration Local
    setItem(key, value, 5, Utils.Storage.Type.Local);
    expect(getItem(key, Utils.Storage.Type.Local)).toBe(value);
    jest.advanceTimersByTime(6 * 60 * 1000);
    expect(w.localStorage.getItem(key)).toBeDefined();
    expect(getItem(key, Utils.Storage.Type.Local)).toBe('');
    expect(w.localStorage.getItem(key)).toBeNull();

    // Expiration Cookie
    setItem(key, value, 5, Utils.Storage.Type.Cookie);
    expect(document.cookie).toContain('max-age=300');

    // Cast
    setItem(key, true);
    expect(getItem(key)).toBe(true);
  });

  test('session start', () => {
    const url = 'https://www.elbwalker.com/';
    const referrer = 'https://www.example.com/';
    Object.defineProperty(w, 'performance', {
      value: {
        getEntriesByType: jest.fn().mockReturnValue([{ type: 'navigate' }]),
      },
    });

    // Is new
    expect(getSession({ url, referrer: url, isNew: true })).toStrictEqual(
      expect.objectContaining({ id: expect.any(String) }),
    );

    // Referral
    expect(getSession({ url, referrer })).toStrictEqual(
      expect.objectContaining({ id: expect.any(String) }),
    );

    // Direct
    expect(getSession({ url, referrer: '' })).toStrictEqual(
      expect.objectContaining({ id: expect.any(String) }),
    );

    // Predefined data
    expect(
      getSession({ url, referrer, data: { id: 'sessionId' } }),
    ).toStrictEqual(expect.objectContaining({ id: 'sessionId' }));

    // Marketing
    expect(getSession({ url: url + '?utm_campaign=foo' })).toStrictEqual(
      expect.objectContaining({
        id: expect.any(String),
        campaign: 'foo',
        marketing: true,
      }),
    );

    // Marketing with custom marketing parameter
    expect(
      getSession({
        url: url + '?affiliate=parameter',
        parameters: { affiliate: 'custom' },
      }),
    ).toStrictEqual(
      expect.objectContaining({
        id: expect.any(String),
        custom: 'parameter',
        marketing: true,
      }),
    );

    // Referrer with custom domains
    expect(
      getSession({
        url: 'https://www.elbwalker.com',
        referrer: 'https://docs.elbwalker.com',
        domains: ['docs.elbwalker.com'],
      }),
    ).toBeFalsy();
    expect(
      getSession({
        url: 'https://www.elbwalker.com',
        referrer: '',
        domains: [''], // Hack to disable direct or hidden referrer
      }),
    ).toBeFalsy();

    // Default url and referrer
    Object.defineProperty(document, 'referrer', {
      value: referrer,
    });
    Object.defineProperty(window, 'location', {
      value: new URL(url),
    });
    expect(getSession()).toStrictEqual(
      expect.objectContaining({ id: expect.any(String) }),
    );

    // Reload
    Object.defineProperty(w, 'performance', {
      value: {
        getEntriesByType: jest.fn().mockReturnValue([{ type: 'reload' }]),
      },
    });
    expect(getSession()).toBeFalsy();

    // Reload with marketing parameter
    expect(getSession({ url: url + '?utm_campaign=foo' })).toBeFalsy();
  });

  test('marketing parameters', () => {
    const url = 'https://www.elbwalker.com/?';
    expect(getMarketingParameters(new URL(url))).toStrictEqual({});

    expect(
      getMarketingParameters(new URL(url + 'utm_campaign=c')),
    ).toStrictEqual(expect.objectContaining({ campaign: 'c' }));
    expect(
      getMarketingParameters(new URL(url + 'utm_content=c')),
    ).toStrictEqual(expect.objectContaining({ content: 'c' }));
    expect(getMarketingParameters(new URL(url + 'dclid=id'))).toStrictEqual(
      expect.objectContaining({ clickId: 'id' }),
    );
    expect(getMarketingParameters(new URL(url + 'fbclid=id'))).toStrictEqual(
      expect.objectContaining({ clickId: 'id' }),
    );
    expect(getMarketingParameters(new URL(url + 'gclid=id'))).toStrictEqual(
      expect.objectContaining({ clickId: 'id' }),
    );
    expect(getMarketingParameters(new URL(url + 'utm_medium=m'))).toStrictEqual(
      expect.objectContaining({ medium: 'm' }),
    );
    expect(getMarketingParameters(new URL(url + 'msclkid=id'))).toStrictEqual(
      expect.objectContaining({ clickId: 'id' }),
    );
    expect(getMarketingParameters(new URL(url + 'utm_source=s'))).toStrictEqual(
      expect.objectContaining({ source: 's' }),
    );
    expect(getMarketingParameters(new URL(url + 'utm_term=t'))).toStrictEqual(
      expect.objectContaining({ term: 't' }),
    );

    // Custom parameters
    expect(
      getMarketingParameters(new URL(url + 'utm_custom=bar'), {
        utm_custom: 'foo',
      }),
    ).toStrictEqual(expect.objectContaining({ foo: 'bar' }));
  });
});
