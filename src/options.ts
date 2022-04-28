import videojs, { VideoJsPlayerOptions } from "video.js";

export const defaultOptions: VideoJsPlayerOptions = {
  controls: true,
  preload: "auto",
  fluid: true,
  responsive: true,
  nativeControlsForTouch: true,
  html5: {
    vhs: {
      overrideNative: !videojs.browser.IS_SAFARI,
    },
  },
  controlBar: {
    children: [
      "progressControl",
      "playToggle",
      "muteToggle",
      "volumeControl",
      "currentTimeDisplay",
      "timeDivider",
      "durationDisplay",
      "fullscreenToggle",
      /*
      volumePanel?: VolumePanelOptions | boolean | undefined;
      'captionsButton',
      'chaptersButton',
      'subtitlesButton',
      'remainingTimeDisplay',
      progressControl?: ProgressControlOptions | boolean | undefined;
      'playbackRateMenuButton',
      'pictureInPictureToggle',
      'liveDisplay',
      'seekToLive',
      'customControlSpacer',
      'descriptionsButton',
      'subsCapsButton',
      'audioTrackButton',
      */
    ],
  },
};
