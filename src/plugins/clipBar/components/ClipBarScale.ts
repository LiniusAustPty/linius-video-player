import videojs, { VideoJsPlayer } from "video.js";

const Component = videojs.getComponent("Component");
const Button = videojs.getComponent("Button");

export default class ClipBarScale extends Component {
  private _value: number = 1;
  private _lessButton: videojs.Button;
  private _moreButton: videojs.Button;

  constructor(player: VideoJsPlayer, options?: videojs.ComponentOptions) {
    super(player, options);

    this._lessButton = new Button(this.player());
    this._lessButton.addClass("lvp-clipbar-scale-button");
    this._lessButton.addClass("lvp-clipbar-scale-button--minus");
    this._lessButton.setAttribute("title", "Scale down");
    this._lessButton.on("click", () => this.incrementScale(-1));

    this._moreButton = new Button(this.player());
    this._moreButton.addClass("lvp-clipbar-scale-button");
    this._moreButton.addClass("lvp-clipbar-scale-button--plus");
    this._moreButton.setAttribute("title", "Scale up");
    this._moreButton.on("click", () => this.incrementScale(1));

    this.addClass("lvp-clipbar-scale");
    this.addChild(this._lessButton);
    this.addChild(this._moreButton);
  }

  private incrementScale(direction: number) {
    this._value = Math.min(
      Math.max(this._value + direction, this.min),
      this.max
    );
    this._lessButton[this._value <= this.min ? "disable" : "enable"]();
    this._moreButton[this._value >= this.max ? "disable" : "enable"]();

    this.trigger("update-scale");
  }

  public get scale() {
    return Math.pow(2, this._value + 1) / 2;
  }

  public get min() {
    return 0;
  }

  public get max() {
    return 3;
  }
}
