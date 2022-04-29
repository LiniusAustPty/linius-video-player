import videojs, { VideoJsPlayer, VideoJsPlayerPluginOptions } from "video.js";

import ClipBarCarousel from "./ClipBarCarousel";
import ClipBarScale from "./ClipBarScale";
import { SegmentType } from "../clipBar/types";
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

    const carousel = new ClipBarCarousel(this.player);
    const expand = this.createExpandButton();
    const scaler = new ClipBarScale(this.player, (value: number) =>
      carousel.setScale(value)
    );

    const inner = new Component(this.player);
    inner.addClass("lvp-timeline");
    inner.addChild(scaler);
    inner.addChild(carousel);

    this._wrapper = new Component(this.player);
    this._wrapper.addClass("lvp-timeline-container");
    this._wrapper.addChild(inner);
    this._wrapper.addChild(expand);

    this.on(this.player, "loadedmetadata", () => {
      const segments = this.tech?.vhs?.playlists?.media()
        ?.segments as SegmentType[];

      if (segments) {
        this.player.controlBar.addChild(this._wrapper);

        carousel.setSegments(segments);
      }
    });
  }

  public dispose() {
    super.dispose();

    videojs.log("Linius Video Player: The ClipBarPlugin is being disposed.");
  }

  private createScaleMenu() {
    const menu = new Menu(this.player);

    return menu;
  }

  private createExpandButton() {
    const component = new Button(this.player);
    component.addClass("lvp-timeline-container-expand");
    component.on("click", () => this.setOpen(!this._isOpen));

    return component;
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
