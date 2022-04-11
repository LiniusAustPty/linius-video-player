import { VideoJsPlayerOptions } from "video.js";

import { defaultOptions } from "./options";
import LVP from "./lvp";

export default (elementId: string, options: VideoJsPlayerOptions) => {
  const lvp = new LVP(elementId, options || defaultOptions);

  return lvp.player;
};
