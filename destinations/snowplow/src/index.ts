import { IElbwalker } from '@elbwalker/walker.js';
import { DestinationSnowplow } from './types';
import { newTracker, trackPageView } from '@snowplow/browser-tracker';

export const destinationSnowplow: DestinationSnowplow.Function = {
  config: {},

  init(config) {
    const custom: Partial<DestinationSnowplow.CustomConfig> =
      config.custom || {};

    // Required parameters
    if (!custom.appId || !custom.url) return false;

    custom.tracker = newTracker('a', custom.url, {
      appId: custom.appId,
    });

    return true;
  },

  push(event, config, mapping = {}) {
    const custom: Partial<DestinationSnowplow.CustomConfig> =
      config.custom || {};
    const customEvent: Partial<DestinationSnowplow.CustomEventConfig> =
      mapping.custom || {};
    const tracker = custom.tracker;

    if (!tracker) return;

    // page view
    if (customEvent.pageview) tracker.trackPageView();
  },
};

export default destinationSnowplow;
