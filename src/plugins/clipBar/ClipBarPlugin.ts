import videojs, { VideoJsPlayer, VideoJsPlayerPluginOptions } from "video.js";

import ClipBarCarousel from "./ClipBarCarousel";
import ClipBarScale from "./ClipBarScale";
import { SegmentType } from "./types";
import "./styles.scss";

const Component = videojs.getComponent("Component");
const Button = videojs.getComponent("Button");
const Plugin = videojs.getPlugin("plugin");
const Menu = videojs.getComponent("Menu");

export default class ClipBarPlugin extends Plugin {
  private _isOpen: boolean = true;
  private _wrapper: videojs.Component;

  constructor(player: VideoJsPlayer, options: VideoJsPlayerPluginOptions) {
    super(player, options);

    const carousel = new ClipBarCarousel(player);

    const expandButton = new Button(player);
    expandButton.addClass("lvp-timeline-container-expand");
    expandButton.on("click", () => this.setOpen(!this._isOpen));

    const scaleMenu = new ClipBarScale(this.player, (value: number) =>
      carousel.setScale(value)
    );

    const inner = new Component(player);
    inner.addClass("lvp-timeline");
    inner.addChild(scaleMenu);
    inner.addChild(carousel);

    this._wrapper = new Component(player);
    this._wrapper.addClass("lvp-timeline-container");
    this._wrapper.addChild(inner);
    this._wrapper.addChild(expandButton);

    this.on(player, "loadedmetadata", () => {
      const segments = this.tech?.vhs?.playlists?.media()
        ?.segments as SegmentType[];

      if (segments) {
        player.controlBar?.addChild(this._wrapper);

        carousel.setSegments(segments);
      }
    });
  }

  public dispose() {
    super.dispose();

    videojs.log("Linius Video Player: The ClipBarPlugin is being disposed.");
  }

  private setOpen(value?: boolean) {
    this._isOpen = value;

    if (value) {
      this._wrapper.removeClass("lvp-timeline-container--collapsed");
    } else {
      this._wrapper.addClass("lvp-timeline-container--collapsed");
    }

    return this;
  }

  public get tech() {
    return this.player.tech(true) as any;
  }
}
