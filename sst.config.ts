import { SSTConfig } from "sst";
import { TheTimeKeeper } from "./stacks/TheTimeKeeper";

export default {
  config(_input) {
    return {
      name: "the-time-keeper",
      region: "eu-north-1",
    };
  },
  stacks(app) {
    app.stack(TheTimeKeeper);
  }
} satisfies SSTConfig;
