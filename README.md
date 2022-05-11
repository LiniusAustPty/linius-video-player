# linius-video-player

![lvp](https://user-images.githubusercontent.com/7384630/167925228-c16dd90e-5dd7-46e3-828f-55527c6d5260.jpg)

## Usage

### As JavaScript library

```
// html

<head>
  <link href="lvp.css" rel="stylesheet" />
  <style>
    html {
      --color-lvp: #0f0;
    }
  </style>
</head>
<head>
  <video-js
    id="my-video"
    class="video-js lvp"
    controls
    preload="auto"
    width="480"
    height="270"
    poster="POSTER_IMAGE_URL"
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

#### Installation

### npm

```
npm install git+https://github.com/LiniusAustPty/linius-video-player.git
```

### Yarn

```
yarn add git+https://github.com/LiniusAustPty/linius-video-player.git
```

#### React Example

```
// ts

import { useState, useRef } from "react";
import lvp, { VideoJsPlayer } from "linius-video-player";
import '../../../node_modules/linius-video-player/dist/lvp.css'

function VideoPlayer({ src, headers }) {
  const [player, setPlayer] = useState<VideoJsPlayer>();
  const ref = useRef();

  useEffect(() => {
    const lvp = videojs(ref.current, OPTIONS);

    setPlayer(lvp)

    return () => {
      lvp.dispose();
    };
  }, []);

  useEffect(() => {
    lvp.setHeaders(headers);
  }, [headers]);

  useEffect(() => {
    player?.src(src);
  }, [player, src]);

  return (
    <div data-vjs-player>
      <video
        playsInline
        preload="auto"
        className="video-js lvp"
        autoPlay={autoplay}
        ref={ref}
        poster={VIDEO_POSTER_DEFAULT}
      />
    </div>
  );
}

```

### Plugins

Plugins are initialised using options.

[Video.js Options Reference](https://videojs.com/guides/options/)

#### ClipBarPlugin

The ClipBarPlugin will display a carousel of clips if available in the manifest.

```
const OPTIONS = {
  plugins: {
    ClipBarPlugin: {}
  }
}
```
