# linius-video-player

## Usage

### As JS library

```
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
    var player = lvp("my-video");
  </script>
  <script src="lvp.js"></script>
</head>
```

### As Package

```
"dependencies": {
  "linius-video-player": "https://github.com/LiniusAustPty/linius-video-player.git",
},
```

```
import lvp from "linius-video-player"
import "lvp.css"

const player = lvp(ref.current, config);
```