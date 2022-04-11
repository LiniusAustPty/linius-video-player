import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js";

import { defaultOptions } from "./options";

export default class LVP {
  private _player: VideoJsPlayer;

  constructor(
    elementId: string = "video-js",
    config: VideoJsPlayerOptions = defaultOptions
  ) {
    this._player = videojs(elementId, config);
  }

  public get player() {
    return this._player;
  }
}
