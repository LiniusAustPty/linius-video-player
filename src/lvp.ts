import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js";

import { defaultOptions } from "./options";
import { addHeaders } from "./utils";
import "./styles.scss";

export default class LVP {
  private _player: VideoJsPlayer;

  constructor(
    elementId: string = "video-js",
    config: VideoJsPlayerOptions = defaultOptions,
    readyCallback?: videojs.ReadyCallback,
    apiKey?: string,
    authToken?: string
  ) {
    this._player = videojs(elementId, config, readyCallback);

    addHeaders(this._player, apiKey, authToken);
  }

  public get player() {
    return this._player;
  }
}
