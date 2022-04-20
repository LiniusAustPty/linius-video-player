import vjs, { VideoJsPlayerOptions } from "video.js";
export declare const videojs: typeof vjs;
declare const _default: (
  elementId: string,
  options: VideoJsPlayerOptions,
  readyCallback?: vjs.ReadyCallback,
  apiKey?: string,
  authToken?: string
) => import("video.js").VideoJsPlayer;
export default _default;
declare module "linius-video-player";
