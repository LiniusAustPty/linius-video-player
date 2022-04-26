import vjs from "video.js";

declare module "linius-video-player" {
  export const videojs: typeof vjs;
  export function setHeaders(headers: any): void;
  export function player(
    id?: string,
    options?: vjs.PlayerOptions,
    ready?: vjs.ReadyCallback
  ): vjs.Player;

  export {
    VideoJsPlayer,
    VideoJsPlayerOptions,
    VideoJsPlayerPluginOptions,
  } from "video.js";

  namespace lvp {
    export const videojs: typeof vjs;
    export function setHeaders(headers: any): void;
    export function player(
      id?: string,
      options?: vjs.PlayerOptions,
      ready?: vjs.ReadyCallback
    ): vjs.Player;
  }

  export default lvp;
}
