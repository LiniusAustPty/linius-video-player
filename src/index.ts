import vjs, { VideoJsPlayerPluginOptions } from "video.js";

import { defaultOptions } from "./options";
import { ClipBarPlugin } from "./plugins";
import "./styles/index.scss";

export namespace lvp {
  export const videojs = vjs;

  export function setHeaders(data?: any) {
    if (!validateHeaders(data)) {
      videojs.log("Linius Video Player: Invalid headers provided.");

      return;
    }

    const headers: Headers = new Headers();

    Object.entries(data).forEach(([key, value]) => {
      headers.append(key, `${value}`);
    });

    addHeaders.call(videojs, headers);
  }

  export function player(
    element: string | HTMLVideoElement = "video-js",
    options: vjs.PlayerOptions = defaultOptions,
    ready?: vjs.ReadyCallback
  ) {
    if (options?.plugins) {
      registerPlugins(options.plugins);
    }

    return videojs.call(
      this,
      element,
      videojs.mergeOptions(defaultOptions, options),
      ready
    );
  }

  function addHeaders(headers: Headers) {
    if (this.hasOwnProperty("vhs")) {
      this.vhs.xhr.beforeRequest = (options: any) => {
        options.headers = headers;

        return options;
      };
    }
  }

  function registerPlugins(plugins: Partial<VideoJsPlayerPluginOptions>) {
    const existingPlugins = videojs.getPlugins();

    Object.keys(plugins).forEach((key) => {
      if (!Object.keys(existingPlugins).includes(key)) {
        switch (key) {
          case "ClipBarPlugin":
            videojs.registerPlugin(key, ClipBarPlugin);
            break;
        }
      }
    });
  }

  function validateHeaders(data?: any) {
    return typeof data === "object" && !Array.isArray(data) && data !== null;
  }
}
