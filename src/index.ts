import LiniusVideoPlayer from "./LiniusVideoPlayer";

export default (elementId: string, config: any) => {
  return new LiniusVideoPlayer(elementId, config);
};
