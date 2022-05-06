import videojs, { VideoJsPlayer, VideoJsPlayerPluginOptions } from "video.js";

import ClipBarCarousel from "./ClipBarCarousel";
import { Segment } from "../types";
import { segmentsToDurations } from "../utils";
import "../styles/index.scss";

const Component = videojs.getComponent("Component");
const Button = videojs.getComponent("Button");
const Plugin = videojs.getPlugin("plugin");

export default class ClipBar extends Plugin {
  private _isOpen: boolean = true;
  private _isAdded: boolean = false;
  private _clipBar: videojs.Component;
  private _nextButton: videojs.Button;
  private _prevButton: videojs.Button;
  private _openButton: videojs.Button;

  constructor(player: VideoJsPlayer, options?: VideoJsPlayerPluginOptions) {
    super(player, options);

    const carousel = new ClipBarCarousel(player);
    const collapse = new Component(player);
    collapse.addClass("lvp-clipbar-collapse");
    collapse.addChild(carousel);

    this._openButton = new Button(player);
    this._openButton.addClass("lvp-clipbar-expand");
    this._openButton.setAttribute("title", "Close");
    this._openButton.on("click", () => this.toggleOpen());

    this._prevButton = new Button(player);
    this._prevButton.addClass("lvp-skip-control");
    this._prevButton.addClass("lvp-skip-control--previous");
    this._prevButton.setAttribute("title", "Previous clip");
    this._prevButton.on("click", () => carousel.previous());

    this._nextButton = new Button(player);
    this._nextButton.addClass("lvp-skip-control");
    this._nextButton.addClass("lvp-skip-control--next");
    this._nextButton.setAttribute("title", "Next clip");
    this._nextButton.on("click", () => carousel.next());

    this._clipBar = new Component(player, {});
    this._clipBar.addClass("lvp-clipbar");
    this._clipBar.addChild(collapse);
    this._clipBar.addChild(this._openButton);

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

  private toggleOpen() {
    this.setOpen(!this._isOpen);

    return this;
  }

  private setOpen(value: boolean = true) {
    this._isOpen = value;

    if (value) {
      this.player.controlBar?.removeClass("lvp-clipbar--collapsed");
      this._openButton.setAttribute("title", "Close");
    } else {
      this.player.controlBar?.addClass("lvp-clipbar--collapsed");
      this._openButton.setAttribute("title", "Open");
    }

    return this;
  }

  private setComponent(value: boolean = true) {
    if (this._isAdded !== value) {
      this._isAdded = value;

      if (value) {
        this.player.controlBar?.addChild(this._clipBar, undefined, 0);
        this.player.controlBar?.addChild(this._prevButton, undefined, 3);
        this.player.controlBar?.addChild(this._nextButton, undefined, 4);
        this.player.controlBar?.addClass("vjs-control-bar--lvp");
      } else {
        this.player.controlBar?.removeChild(this._clipBar);
        this.player.controlBar?.removeChild(this._prevButton);
        this.player.controlBar?.removeChild(this._nextButton);
        this.player.controlBar?.removeClass("vjs-control-bar--lvp");
      }
    }

    return this;
  }

  public dispose() {
    super.dispose();

    videojs.log("Linius Video Player: The ClipBar is being disposed.");
  }

  public get tech() {
    return this.player.tech(true) as any;
  }
}
