import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js";

import { configDefault } from "./config";

export default class LVP {
  private _player: VideoJsPlayer;

  constructor(elementId: string, config: VideoJsPlayerOptions = configDefault) {
    this._player = videojs(elementId, config);
  }

  public get player() {
    return this._player;
  }
}
