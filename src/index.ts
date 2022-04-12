import { VideoJsPlayerOptions } from "video.js";

import { defaultOptions } from "./options";
import LVP from "./lvp";
import "./styles.scss";

export default (elementId: string, options: VideoJsPlayerOptions) => {
  const player = new LVP(elementId, options || defaultOptions);

  return player.player;
};
