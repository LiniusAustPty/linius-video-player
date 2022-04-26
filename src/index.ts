import vjs from "video.js";

import { defaultOptions } from "./options";
import "./styles.scss";

export namespace lvp {
  export const videojs = vjs;

  export function setHeaders(data?: any) {
    const headers: Headers = new Headers();

    Object.entries(data).forEach(([key, value]) => {
      headers.append(key, `${value}`);
    });

    addHeaders.call(videojs, headers);
  }

  export function player(
    id: string = "video-js",
    playerOptions: vjs.PlayerOptions = defaultOptions,
    readyCallback?: vjs.ReadyCallback
  ) {
    const options = videojs.mergeOptions(defaultOptions, playerOptions);
    const player = videojs.call(this, id, options, readyCallback);

    return player;
  }

  function addHeaders(headers: Headers) {
    if (this.hasOwnProperty("vhs")) {
      this.vhs.xhr.beforeRequest = (options) => {
        options.headers = headers;

        return options;
      };
    }
  }
}
