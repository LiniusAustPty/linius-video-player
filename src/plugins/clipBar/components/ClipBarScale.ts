import videojs, { VideoJsPlayer } from "video.js";

const Component = videojs.getComponent("Component");
const Button = videojs.getComponent("Button");

export default class ClipBarScale extends Component {
  private _decreaseButton: videojs.Button;
  private _increaseButton: videojs.Button;

  constructor(
    player: VideoJsPlayer,
    incrementScale: (value: number) => void,
    options?: videojs.ComponentOptions
  ) {
    super(player, options);

    this._decreaseButton = new Button(this.player());
    this._decreaseButton.addClass("lvp-clipbar-scale-button--minus");
    this._decreaseButton.addClass("lvp-clipbar-scale-button");
    this._decreaseButton.addClass("vjs-control");
    this._decreaseButton.addClass("vjs-button");
    this._decreaseButton.on("click", () => incrementScale(-1));

    this._increaseButton = new Button(this.player());
    this._increaseButton.addClass("lvp-clipbar-scale-button--plus");
    this._increaseButton.addClass("lvp-clipbar-scale-button");
    this._increaseButton.addClass("vjs-control");
    this._increaseButton.addClass("vjs-button");
    this._increaseButton.on("click", () => incrementScale(1));

    this.addClass("lvp-clipbar-scale");
    this.addChild(this._decreaseButton);
    this.addChild(this._increaseButton);
  }

  public setScale(value: number) {
    if (value < 1) {
      this._decreaseButton.disable();
    } else {
      this._decreaseButton.enable();
    }

    if (value > 2) {
      this._increaseButton.disable();
    } else {
      this._increaseButton.enable();
    }
  }
}
