import vjs from "video.js";

import { defaultOptions } from "./options";
import "./styles.scss";

export namespace lvp {
  export const videojs = vjs;

  export function setHeaders(data?: any) {
    if (!validateHeaders(data)) {
      console.error("Linius Video Player: Invalid headers provided.");

      return;
    }

    const headers: Headers = new Headers();

    Object.entries(data).forEach(([key, value]) => {
      headers.append(key, `${value}`);
    });

    addHeaders.call(videojs, headers);
  }

  export function player(
    id: string = "video-js",
    options: vjs.PlayerOptions = defaultOptions,
    ready?: vjs.ReadyCallback
  ) {
    return videojs.call(
      this,
      id,
      videojs.mergeOptions(defaultOptions, options),
      ready
    );
  }

  function addHeaders(headers: Headers) {
    if (this.hasOwnProperty("vhs")) {
      this.vhs.xhr.beforeRequest = (options) => {
        options.headers = headers;

        return options;
      };
    }
  }

  function validateHeaders(data?: any) {
    return typeof data === "object" && !Array.isArray(data) && data !== null;
  }
}
