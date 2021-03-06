import videojs, { VideoJsPlayer } from "video.js";

const Component = videojs.getComponent("Component");
const ClickableComponent = videojs.getComponent("ClickableComponent");

export default class ClipBarCarouselItem extends ClickableComponent {
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
    this._fill.addClass("lvp-clipbar-list-item-fill");

    this.addClass("lvp-clipbar-list-item");
    this.setAttribute("style", `left:${x * 100}%;width:${width * 100}%`);
    this.addChild(this._fill);
    this.on(["tap", "click"], () => {
      this.player().currentTime(startTime);
    });
  }

  public setFill(value: number) {
    this._fill.setAttribute("style", `width:${value * 100}%`);
  }

  public get startTime() {
    return this._startTime;
  }

  public get duration() {
    return this._duration;
  }
}
