import videojs, { VideoJsPlayer, VideoJsPlayerPluginOptions } from "video.js";

import { Segment } from "../types";
import { indexToTime, segmentsToDurations, timeToIndex } from "../utils";
import ClipBarList from "./ClipBarList";
import "../styles/index.scss";

const Component = videojs.getComponent("Component");
const ClickableComponent = videojs.getComponent("ClickableComponent");
const Plugin = videojs.getPlugin("plugin");

export default class ClipBarPlugin extends Plugin {
  private _isOpen: boolean = true;
  private _isAdded: boolean = false;
  private _durations: number[] = [];
  private _clipBar: videojs.Component;
  private _nextButton: videojs.ClickableComponent;
  private _prevButton: videojs.ClickableComponent;
  private _openButton: videojs.ClickableComponent;

  constructor(player: VideoJsPlayer, options?: VideoJsPlayerPluginOptions) {
    super(player, options);

    const clipList = new ClipBarList(player);

    const collapseContainer = new Component(player);
    collapseContainer.addClass("lvp-clipbar-collapse");
    collapseContainer.addChild(clipList);

    this._openButton = new ClickableComponent(player);
    this._openButton.addClass("lvp-clipbar-expand");
    this._openButton.setAttribute("title", "Close");
    this._openButton.on(["tap", "click"], () => this.toggleOpen());

    this._prevButton = new ClickableComponent(player);
    this._prevButton.addClass("lvp-skip-control");
    this._prevButton.addClass("lvp-skip-control--previous");
    this._prevButton.setAttribute("title", "Previous clip");
    this._prevButton.on(["tap", "click"], () => this.previous());

    this._nextButton = new ClickableComponent(player);
    this._nextButton.addClass("lvp-skip-control");
    this._nextButton.addClass("lvp-skip-control--next");
    this._nextButton.setAttribute("title", "Next clip");
    this._nextButton.on(["tap", "click"], () => this.next());

    this._clipBar = new Component(player);
    this._clipBar.addClass("lvp-clipbar");
    this._clipBar.addChild(collapseContainer);
    this._clipBar.addChild(this._openButton);

    this.on(player, "loadedmetadata", () => {
      const segments = this.tech?.vhs?.playlists?.media()
        ?.segments as Segment[];

      this.addComponentToControlBar(!!segments);

      this._durations = !!segments ? segmentsToDurations(segments) : [];

      clipList.setDurations(this._durations);
    });

    this.on(player, "timeupdate", () => {
      clipList.setCurrentTime(this.player.currentTime());
    });
  }

  private addComponentToControlBar(value: boolean = true) {
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
  }

  private toggleOpen() {
    this.setOpen(!this._isOpen);
  }

  private setOpen(value: boolean = true) {
    this._isOpen = value;

    this._openButton.setAttribute("title", value ? "Close" : "Open");

    this.player.controlBar?.[value ? "removeClass" : "addClass"](
      "lvp-clipbar--collapsed"
    );
  }

  public next() {
    return this.incrementItem(1);
  }

  public previous() {
    return this.incrementItem(-1);
  }

  public incrementItem(value: number) {
    const index = Math.min(
      Math.max(
        indexToTime(this._durations, this.player.currentTime()) + value,
        0
      ),
      this._durations.length - 1
    );
    const time = timeToIndex(this._durations, index);

    this.player.currentTime(time);

    return this;
  }

  public get tech() {
    return this.player.tech(true) as any;
  }

  public dispose() {
    videojs.log("Linius Video Player: The ClipBar is being disposed.");

    super.dispose();
  }
}
