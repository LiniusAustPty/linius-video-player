import videojs, { VideoJsPlayer, VideoJsPlayerPluginOptions } from "video.js";

import ClipBarCarousel from "./ClipBarCarousel";
import { Segment } from "../types";
import { segmentsToDurations } from "../utils";
import Skipbutton from "../../../components/SkipButton/SkipButton";
import "../styles/index.scss";

const Component = videojs.getComponent("Component");
const Button = videojs.getComponent("Button");
const Plugin = videojs.getPlugin("plugin");

export default class ClipBar extends Plugin {
  private _isOpen: boolean = true;
  private _isAdded: boolean = false;
  private _clipBar: videojs.Component;
  private _nextButton: Skipbutton;
  private _previousButton: Skipbutton;
  private _expandButton: videojs.Button;

  constructor(player: VideoJsPlayer, options?: VideoJsPlayerPluginOptions) {
    super(player, options);

    const carousel = new ClipBarCarousel(player);

    this._expandButton = new Button(player);
    this._expandButton.addClass("lvp-clipbar-expand");
    this._expandButton.setAttribute("title", "Close");
    this._expandButton.on("click", () => this.toggleOpen());

    this._nextButton = new Skipbutton(player, () => carousel.next(), true);
    this._nextButton.setAttribute("title", "Next clip");

    this._previousButton = new Skipbutton(player, () => carousel.previous());
    this._previousButton.setAttribute("title", "Previous clip");

    const collapse = new Component(player);
    collapse.addClass("lvp-clipbar-collapse");
    collapse.addChild(carousel);

    this._clipBar = new Component(player, {});
    this._clipBar.addClass("lvp-clipbar");
    this._clipBar.addChild(collapse);
    this._clipBar.addChild(this._expandButton);

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
      this.player.controlBar?.removeClass("lvp-clipbar--collapsed");
    } else {
      this.player.controlBar?.addClass("lvp-clipbar--collapsed");
    }

    this._expandButton.setAttribute("title", value ? "Close" : "Open");

    return this;
  }

  private setComponent(value: boolean = true) {
    if (this._isAdded !== value) {
      this._isAdded = value;

      if (value) {
        this.player.controlBar?.addChild(this._clipBar, undefined, 0);
        this.player.controlBar?.addChild(this._previousButton, undefined, 3);
        this.player.controlBar?.addChild(this._nextButton, undefined, 4);
        this.player.controlBar?.addClass("vjs-control-bar--lvp");
      } else {
        this.player.controlBar?.removeChild(this._clipBar);
        this.player.controlBar?.removeChild(this._previousButton);
        this.player.controlBar?.removeChild(this._nextButton);
        this.player.controlBar?.removeClass("vjs-control-bar--lvp");
      }
    }

    return this;
  }

  public get tech() {
    return this.player.tech(true) as any;
  }
}
