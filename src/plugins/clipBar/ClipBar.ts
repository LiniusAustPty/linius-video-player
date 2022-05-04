import videojs, { VideoJsPlayer, VideoJsPlayerPluginOptions } from "video.js";

import ClipBarCarousel from "./ClipBarCarousel";
import ClipBarScale from "./ClipBarScale";
import { Segment } from "./types";
import "./styles.scss";

const Component = videojs.getComponent("Component");
const Button = videojs.getComponent("Button");
const Plugin = videojs.getPlugin("plugin");

export default class ClipBar extends Plugin {
  private _isOpen: boolean = true;
  private _wrapper: videojs.Component;

  constructor(player: VideoJsPlayer, options?: VideoJsPlayerPluginOptions) {
    super(player, options);

    const carousel = new ClipBarCarousel(player);

    const expandButton = new Button(player);
    expandButton.addClass("lvp-clipbar-expand");
    expandButton.on("click", () => this.setOpen(!this._isOpen));

    const scaleMenu = new ClipBarScale(this.player, (value: number) =>
      carousel.setScale(value)
    );

    const inner = new Component(player);
    inner.addClass("lvp-clipbar-inner");
    inner.addChild(scaleMenu);
    inner.addChild(carousel);

    this._wrapper = new Component(player, {});
    this._wrapper.addClass("lvp-clipbar");
    this._wrapper.addChild(inner);
    this._wrapper.addChild(expandButton);

    this.on(player, "ready", () => {
      this.addComponentToControlBar();
    });

    this.on(player, "loadedmetadata", () => {
      const segments = this.tech?.vhs?.playlists?.media()
        ?.segments as Segment[];

      if (segments) {
        carousel.addItems(segments);
      } else {
        videojs.log("Linius Video Player: No video segments found.");
      }
    });

    this.on(player, "timeupdate", () => {
      carousel.setTime(this.player.currentTime());
    });
  }

  public dispose() {
    super.dispose();

    videojs.log("Linius Video Player: The ClipBar is being disposed.");
  }

  private addComponentToControlBar() {
    this.player.controlBar?.addChild(this._wrapper);

    return this;
  }

  private setOpen(value?: boolean) {
    this._isOpen = value;

    if (value) {
      this._wrapper.removeClass("lvp-clipbar--collapsed");
    } else {
      this._wrapper.addClass("lvp-clipbar--collapsed");
    }

    return this;
  }

  public get tech() {
    return this.player.tech(true) as any;
  }
}
