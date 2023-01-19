import Elbwalker from '../elbwalker';
import { IElbwalker, WebDestination } from '../types';

describe('Destination', () => {
  const w = window;
  let elbwalker: IElbwalker.Function;

  const mockPush = jest.fn(); //.mockImplementation(console.log);
  const mockInit = jest.fn().mockImplementation(() => {
    return true;
  });

  const mockError = jest.fn();
  console.error = mockError;

  let destination: WebDestination.Function;
  let config: WebDestination.Config;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    elbwalker = Elbwalker();
    config = { init: false };

    destination = {
      init: mockInit,
      push: mockPush,
      config,
    };
  });

  test('basic usage', () => {
    elbwalker.push('walker run');

    expect(mockInit).toHaveBeenCalledTimes(0);
    expect(mockPush).toHaveBeenCalledTimes(0);
    elbwalker.push('walker destination', destination);
    elbwalker.push('entity action');
    expect(mockInit).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'entity action',
      }),
      config,
      undefined,
    );
  });

  test('init call', () => {
    elbwalker.push('walker run');

    // No init function
    elbwalker.push('walker destination', {
      config: {},
      push: mockPush,
    });
    elbwalker.push('entity action');
    expect(mockInit).toHaveBeenCalledTimes(0);
    expect(mockPush).toHaveBeenCalledTimes(1);

    // Init set to true and should not be called
    elbwalker.push('walker destination', {
      init: mockInit,
      push: mockPush,
      config: { init: true },
    });
    elbwalker.push('entity action');
    expect(mockInit).toHaveBeenCalledTimes(0);

    // Always trigger init since it returns false
    const mockInitFalse = jest.fn().mockImplementation(() => {
      return false;
    });
    elbwalker.push('walker destination', {
      config: {},
      init: mockInitFalse,
      push: mockPush,
    });
    elbwalker.push('entity action');
    expect(mockInitFalse).toHaveBeenCalledTimes(1);
    elbwalker.push('entity action');
    expect(mockInitFalse).toHaveBeenCalledTimes(2);
  });

  test('multiple destinations', () => {
    elbwalker.push('walker run');

    const configA = { init: false };
    const configB = { init: false };

    destination.config = configA;
    elbwalker.push('walker destination', destination);
    destination.config = configB;
    elbwalker.push('walker destination', destination);

    elbwalker.push('entity action');
    expect(mockInit).toHaveBeenCalledTimes(2);
    expect(mockPush).toHaveBeenCalledTimes(2);
    expect(mockPush).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'entity action',
      }),
      { init: true },
      undefined,
    );
  });

  test('preventing data manipulation', () => {
    const data = { a: 1 };
    const mockPushUpdate = jest.fn().mockImplementation((event) => {
      event.data.foo = 'bar';
    });

    const destinationUpdate = {
      init: mockInit,
      push: mockPushUpdate,
      config: {},
    };

    elbwalker.push('walker run');
    elbwalker.push('walker destination', destinationUpdate);
    elbwalker.push('walker destination', destination);
    elbwalker.push('entity action', data);
    expect(mockPushUpdate).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'entity action',
        data,
      }),
      config,
      undefined,
    );
  });

  test('broken destination', () => {
    elbwalker.push('walker run');

    // create invalid breaking destinations
    elbwalker.push('walker destination');
    elbwalker.push('walker destination', {
      config: {},
      init: () => {
        throw new Error();
      },
      push: mockPush,
    });
    elbwalker.push('walker destination', destination);
    elbwalker.push('entity action');

    expect(mockError).toHaveBeenCalled(); // error catcher
    expect(mockInit).toHaveBeenCalled(); // 2nd destination
  });

  test('mapping', () => {
    jest.clearAllMocks();
    elbwalker = Elbwalker({ elbLayer: [], pageview: false });
    elbwalker.push('walker run');

    const mockPushA = jest.fn();
    const mockPushB = jest.fn();
    const mockPushC = jest.fn();

    const destinationA: WebDestination.Function = {
      push: mockPushA,
      config: {
        mapping: {
          entity: { action: {} },
          foo: { bar: { name: 'foo bar' } },
        },
      },
    };

    const destinationB: WebDestination.Function = {
      push: mockPushB,
      config: {
        mapping: { '*': { action: {} } },
      },
    };

    const destinationC: WebDestination.Function = {
      push: mockPushC,
      config: { mapping: { entity: { '*': {} } } },
    };

    elbwalker.push('walker destination', destinationA);
    elbwalker.push('walker destination', destinationB);
    elbwalker.push('walker destination', destinationC);

    elbwalker.push('entity action');
    expect(mockPushA).toHaveBeenCalledTimes(1);
    expect(mockPushB).toHaveBeenCalledTimes(1);
    expect(mockPushC).toHaveBeenCalledTimes(1);
    expect(mockPushA).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'entity action',
      }),
      expect.anything(),
      {},
    );
    expect(mockPushB).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'entity action',
      }),
      expect.anything(),
      {},
    );
    expect(mockPushC).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'entity action',
      }),
      expect.anything(),
      {},
    );

    jest.clearAllMocks();
    elbwalker.push('foo bar');
    expect(mockPushA).toHaveBeenCalledTimes(1);
    expect(mockPushB).toHaveBeenCalledTimes(0);
    expect(mockPushC).toHaveBeenCalledTimes(0);
    expect(mockPushA).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'foo bar',
      }),
      expect.anything(),
      { name: 'foo bar' },
    );

    jest.clearAllMocks();
    elbwalker.push('random action');
    expect(mockPushA).toHaveBeenCalledTimes(0);
    expect(mockPushB).toHaveBeenCalledTimes(1);
    expect(mockPushC).toHaveBeenCalledTimes(0);
    expect(mockPushB).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'random action',
      }),
      expect.anything(),
      {},
    );

    jest.clearAllMocks();
    elbwalker.push('entity random');
    expect(mockPushA).toHaveBeenCalledTimes(0);
    expect(mockPushB).toHaveBeenCalledTimes(0);
    expect(mockPushC).toHaveBeenCalledTimes(1);
    expect(mockPushC).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'entity random',
      }),
      expect.anything(),
      {},
    );

    jest.clearAllMocks();
    elbwalker.push('absolutely unacceptable');
    expect(mockPushA).toHaveBeenCalledTimes(0);
    expect(mockPushB).toHaveBeenCalledTimes(0);
    expect(mockPushC).toHaveBeenCalledTimes(0);
  });

  test('consent', () => {
    jest.clearAllMocks();
    elbwalker = Elbwalker({
      consent: { functional: true, marketing: false },
      pageview: false,
    });
    elbwalker.push('walker run');

    const mockPushA = jest.fn();
    const mockPushB = jest.fn();
    const mockPushC = jest.fn();

    const destinationA: WebDestination.Function = {
      push: mockPushA,
      config: {}, // No consent settings
    };

    const destinationB: WebDestination.Function = {
      push: mockPushB,
      config: { consent: { functional: true } },
    };

    const destinationC: WebDestination.Function = {
      push: mockPushC,
      config: { consent: { marketing: true } },
    };

    elbwalker.push('walker destination', destinationA);
    elbwalker.push('walker destination', destinationB);
    elbwalker.push('walker destination', destinationC);

    // Init consent state
    jest.clearAllMocks();
    elbwalker.push('e a');
    expect(mockPushA).toHaveBeenCalledTimes(1);
    expect(mockPushB).toHaveBeenCalledTimes(1);
    expect(mockPushC).toHaveBeenCalledTimes(0);

    // Accepted consent
    jest.clearAllMocks();
    elbwalker.push('walker consent', { marketing: true });
    expect(mockPushC).toHaveBeenCalledTimes(1); // retroactively pushed

    // Regular push to all now
    jest.clearAllMocks();
    elbwalker.push('e a');
    expect(mockPushA).toHaveBeenCalledTimes(1);
    expect(mockPushB).toHaveBeenCalledTimes(1);
    expect(mockPushC).toHaveBeenCalledTimes(1);

    // Revoked consent
    jest.clearAllMocks();
    elbwalker.push('walker consent', { functional: false, marketing: false });
    elbwalker.push('e a');
    expect(mockPushA).toHaveBeenCalledTimes(1);
    expect(mockPushB).toHaveBeenCalledTimes(0);
    expect(mockPushC).toHaveBeenCalledTimes(0);
  });

  test('queue', () => {
    elbwalker = Elbwalker({
      consent: { functional: true },
      pageview: false,
    });
    elbwalker.push('walker run');

    const mockPushA = jest.fn();
    const mockPushB = jest.fn();
    const mockPushC = jest.fn();

    const destinationA: WebDestination.Function = {
      push: mockPushA,
      config: {}, // No consent settings
    };

    const destinationB: WebDestination.Function = {
      push: mockPushB,
      config: { consent: { functional: true } },
    };

    const destinationC: WebDestination.Function = {
      push: mockPushC,
      config: { consent: { marketing: true } },
    };

    elbwalker.push('walker destination', destinationA);
    elbwalker.push('walker destination', destinationB);
    elbwalker.push('walker destination', destinationC);

    // Init consent state
    jest.clearAllMocks();
    elbwalker.push('p v');
    expect(mockPushA).toHaveBeenCalledTimes(1);
    expect(mockPushB).toHaveBeenCalledTimes(1);
    expect(mockPushC).toHaveBeenCalledTimes(0);

    elbwalker.push('e a');
    expect(mockPushC).toHaveBeenCalledTimes(0);

    // Accepted consent
    elbwalker.push('walker consent', { marketing: true });

    expect(mockPushC).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        event: 'p v',
      }),
      expect.anything(),
      undefined,
    );

    expect(mockPushC).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        event: 'e a',
      }),
      expect.anything(),
      undefined,
    );

    elbwalker.push('f b');
    expect(mockPushC).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        event: 'f b',
      }),
      expect.anything(),
      undefined,
    );

    // Revoked consent
    jest.clearAllMocks();
    elbwalker.push('walker consent', { functional: false, marketing: false });
    elbwalker.push('no pe');
    expect(mockPushA).toHaveBeenCalledTimes(1);
    expect(mockPushB).toHaveBeenCalledTimes(0);
    expect(mockPushC).toHaveBeenCalledTimes(0);

    // New run without previous events
    jest.clearAllMocks();
    elbwalker.push('walker run');
    elbwalker.push('walker consent', { functional: true, marketing: true });
    elbwalker.push('only one');
    expect(mockPushA).toHaveBeenCalledTimes(1);
    expect(mockPushB).toHaveBeenCalledTimes(1);
    expect(mockPushC).toHaveBeenCalledTimes(1);
  });

  test('ignoring events', () => {
    elbwalker.push('walker run');

    const mockPushA = jest.fn();

    const destinationIgnore: WebDestination.Function = {
      push: mockPushA,
      config: {
        mapping: {
          foo: { bar: { ignore: false } },
        },
      },
    };
    elbwalker.push('walker destination', destinationIgnore);

    elbwalker.push('foo bar');
    expect(mockPushA).toHaveBeenCalledTimes(1);

    jest.clearAllMocks();

    destinationIgnore.config.mapping!.foo.bar.ignore = true;
    elbwalker.push('foo bar');
    expect(mockPushA).toHaveBeenCalledTimes(0);
  });

  test('custom event name', () => {
    elbwalker.push('walker run');

    const mockPushA = jest.fn();
    config = {
      mapping: {
        page: { view: { name: 'page_view' } },
      },
    };

    const destination: WebDestination.Function = {
      push: mockPushA,
      config,
    };
    elbwalker.push('walker destination', destination);

    elbwalker.push('page view');
    expect(mockPushA).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'page_view',
      }),
      config,
      { name: 'page_view' },
    );
  });

  test('set config on init', () => {
    elbwalker = Elbwalker({ elbLayer: [], pageview: false });
    elbwalker.push('walker run');

    const mockInitA = jest.fn();
    const mockPushA = jest.fn();
    const mockInitB = jest.fn().mockImplementation(() => {
      return true;
    });
    const mockPushB = jest.fn();

    const name = 'foo';
    const config = { init: true, mapping: { p: { v: { name } } } };

    const destinationA: WebDestination.Function = {
      init: mockInitA,
      push: mockPushA,
      config,
    };

    const destinationB: WebDestination.Function = {
      init: mockInitB,
      push: mockPushB,
      config,
    };

    elbwalker.push('walker destination', destinationA);
    elbwalker.push('walker destination', destinationB, {
      init: false,
      mapping: { p: { v: { name: 'different' } } },
    });

    jest.clearAllMocks();
    elbwalker.push('p v');

    expect(mockInitA).not.toHaveBeenCalled();
    expect(mockPushA).toHaveBeenCalledWith(
      expect.objectContaining({ event: name }),
      expect.anything(),
      { name },
    );
    expect(mockInitB).toHaveBeenCalled();
    expect(mockPushB).toHaveBeenCalledWith(
      expect.objectContaining({ event: 'different' }),
      expect.anything(),
      { name: 'different' },
    );
  });
});
