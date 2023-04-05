import { DestinationSnowplow } from './types';

declare global {
  interface Window {}
}

export const destinationSnowplow: DestinationSnowplow.Function = {
  config: {},

  init(config) {
    // Do something initializing

    return true;
  },

  push(event, config, mapping = {}) {
    // Do something magical
  },
};

export default destinationSnowplow;
