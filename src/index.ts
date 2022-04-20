import vjs, { VideoJsPlayerOptions } from "video.js";

import { defaultOptions } from "./options";
import LVP from "./lvp";
import "./styles.scss";

export const videojs = vjs;

export default (
  elementId: string,
  options: VideoJsPlayerOptions,
  readyCallback?: vjs.ReadyCallback,
  apiKey?: string,
  authToken?: string
) => {
  const player = new LVP(
    elementId,
    options || defaultOptions,
    readyCallback,
    apiKey,
    authToken
  );

  return player.player;
};
