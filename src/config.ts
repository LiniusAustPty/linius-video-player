import { VideoJsPlayerOptions } from "video.js";

export const configDefault: VideoJsPlayerOptions = {
  controls: true,
  preload: "auto",
  fluid: true,
  responsive: true,
  html5: {
    hlsjsConfig: {
      //enableWorker: true,
      //overrideNative: !videojs.browser.IS_SAFARI,
      //liveBackBufferLength: 500,
      //liveSyncDurationCount: 1,
    },
    vhs: {
      //overrideNative: !videojs.browser.IS_SAFARI,
      //limitRenditionByPlayerDimensions: true,
    },
    hls: {
      //overrideNative: !videojs.browser.IS_SAFARI,
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
      // volumePanel?: VolumePanelOptions | boolean | undefined;
      'captionsButton',
      'chaptersButton',
      'subtitlesButton',
      'remainingTimeDisplay',
      //progressControl?: ProgressControlOptions | boolean | undefined;
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
