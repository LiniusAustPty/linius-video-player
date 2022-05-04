import videojs, { VideoJsPlayer, VideoJsPlayerPluginOptions } from "video.js";

import ClipBarCarousel from "./ClipBarCarousel";
import { Segment } from "./types";
import "./styles.scss";
import { segmentsToDurations } from "./utils";
import Skipbutton from "../../components/SkipButton/SkipButton";

const Component = videojs.getComponent("Component");
const Button = videojs.getComponent("Button");
const Plugin = videojs.getPlugin("plugin");

export default class ClipBar extends Plugin {
  private _isOpen: boolean = true;
  private _isAdded: boolean = false;
  private _wrapper: videojs.Component;
  private _skipButtons: videojs.Component;

  constructor(player: VideoJsPlayer, options?: VideoJsPlayerPluginOptions) {
    super(player, options);

    const carousel = new ClipBarCarousel(player);

    const expandButton = new Button(player);
    expandButton.addClass("lvp-clipbar-expand");
    expandButton.on("click", () => this.toggleOpen());

    const nextButton = new Skipbutton(player, () => carousel.next(), true);
    const previousButton = new Skipbutton(player, () => carousel.previous());

    this._skipButtons = new Component(player);
    this._skipButtons.addClass("lvp-skipbuttons");
    this._skipButtons.addChild(previousButton);
    this._skipButtons.addChild(nextButton);

    const inner = new Component(player);
    inner.addClass("lvp-clipbar-inner");
    inner.addChild(carousel);

    this._wrapper = new Component(player, {});
    this._wrapper.addClass("lvp-clipbar");
    this._wrapper.addChild(inner);
    this._wrapper.addChild(expandButton);

    this.on(player, "loadedmetadata", () => {
      const segments = this.tech?.vhs?.playlists?.media()
        ?.segments as Segment[];

      this.setComponent(!!segments);

      if (segments) {
        carousel.addItems(segmentsToDurations(segments));
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

  private toggleOpen() {
    this.setOpen(!this._isOpen);

    return this;
  }

  private setOpen(value: boolean = true) {
    this._isOpen = value;

    if (value) {
      this._wrapper.removeClass("lvp-clipbar--collapsed");
    } else {
      this._wrapper.addClass("lvp-clipbar--collapsed");
    }

    return this;
  }

  private setComponent(value: boolean = true) {
    if (this._isAdded !== value) {
      this._isAdded = value;

      if (value) {
        this.player.controlBar?.addChild(this._wrapper);
        this.player.controlBar?.addChild(this._skipButtons);
      } else {
        this.player.controlBar?.removeChild(this._wrapper);
        this.player.controlBar?.removeChild(this._skipButtons);
      }
    }

    return this;
  }

  public get tech() {
    return this.player.tech(true) as any;
  }
}
