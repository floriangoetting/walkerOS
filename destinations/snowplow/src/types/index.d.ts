import { WebDestination } from '@elbwalker/walker.js';

export declare namespace DestinationSnowplow {
  interface Function
    extends WebDestination.Function<CustomConfig, CustomEventConfig> {}

  type Config = WebDestination.Config<CustomConfig, CustomEventConfig>;

  interface CustomConfig {
    // Snowplows custom settings
  }

  interface CustomEventConfig {
    // Custom destination event mapping properties
  }
}
