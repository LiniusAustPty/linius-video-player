# linius-video-player

## Usage

### As JavaScript library

```
// html

<head>
  <link href="lvp.css" rel="stylesheet" />
</head>
<head>
  <video-js
    id="my-video"
    class="video-js lvp"
    controls
    preload="auto"
    width="480"
    height="270"
    poster="MY_VIDEO_POSTER.jpg"
    data-setup="{}"
  >
    <source src="MY_VIDEO.mp4" type="video/mp4" />
  </video-js>
  <script src="lvp.js">
    lvp.setHeaders(HEADERS);

    var player = lvp.player("my-video", OPTIONS, READY_CALLBACK);
  </script>
  <script src="lvp.js"></script>
</head>
```

### As node.js package

```
// package.json

"dependencies": {
  "linius-video-player": "https://github.com/LiniusAustPty/linius-video-player.git",
},
```

```
// js/ts

import lvp, {
  videojs,
  VideoJsPlayer,
  VideoJsPlayerOptions,
  VideoJsPlayerPluginOptions,
} from "linius-video-player";
import "lvp.css"

lvp.setHeaders(HEADERS);

const player = lvp.player(ref.current, OPTIONS, READY_CALLBACK);
```
