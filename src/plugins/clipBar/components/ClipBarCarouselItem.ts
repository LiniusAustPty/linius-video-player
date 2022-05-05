import videojs, { VideoJsPlayer } from "video.js";

const Component = videojs.getComponent("Component");
const Button = videojs.getComponent("Button");

export default class ClipBarCarouselItem extends Button {
  private _startTime: number;
  private _duration: number;
  private _fill: videojs.Component;

  constructor(
    player: VideoJsPlayer,
    x: number,
    width: number,
    startTime: number,
    duration: number
  ) {
    super(player);

    this._startTime = startTime;
    this._duration = duration;

    this._fill = new Component(this.player());
    this._fill.addClass("lvp-clipbar-carousel-list-item-fill");

    this.addClass("lvp-clipbar-carousel-list-item");
    this.addChild(this._fill);
    this.setAttribute("style", `left:${x * 100}%;width:${width * 100}%`);
    this.on("click", () => {
      this.player().currentTime(startTime);
    });
  }

  public setFill(value: number) {
    this._fill.setAttribute("style", `width:${value * 100}%`);

    return this;
  }

  public get startTime() {
    return this._startTime;
  }

  public get duration() {
    return this._duration;
  }
}
