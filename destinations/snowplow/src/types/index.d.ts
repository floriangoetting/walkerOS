import { WebDestination } from '@elbwalker/walker.js';
import { BrowserTracker } from '@snowplow/browser-tracker';

export declare namespace DestinationSnowplow {
  interface Function
    extends WebDestination.Function<CustomConfig, CustomEventConfig> {}

  type Config = WebDestination.Config<CustomConfig, CustomEventConfig>;

  interface CustomConfig {
    appId: string;
    tracker?: BrowserTracker;
    url: string;
  }

  interface CustomEventConfig {
    pageview?: boolean;
  }
}
