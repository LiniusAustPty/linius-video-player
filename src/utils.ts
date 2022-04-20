import { VideoJsPlayer } from "video.js";

export const addHeaders = (
  player: VideoJsPlayer,
  apiKey?: string,
  authToken?: string
) => {
  console.log("player---", player);

  const headers: Headers = new Headers();

  if (authToken) {
    headers.append("Authorization", `Bearer ${authToken}`);
  }

  if (apiKey) {
    headers.append("x-api-key", apiKey);
  }

  if (player.hasOwnProperty("Vhs")) {
    (player as any).Vhs.xhr.beforeRequest = (options) => {
      options.headers = headers;

      return options;
    };
  }
};
