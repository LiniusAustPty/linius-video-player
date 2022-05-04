import videojs, { VideoJsPlayer } from "video.js";

const Component = videojs.getComponent("Component");
const Button = videojs.getComponent("Button");

export default class ClipBarScale extends Component {
  constructor(player: VideoJsPlayer, onClick: (value: number) => void) {
    super(player);

    this.addClass("lvp-clipbar-scale");

    const minus = new Button(this.player());
    minus.addClass("lvp-clipbar-scale-button");
    minus.addClass("lvp-clipbar-scale-button--minus");
    minus.addClass("vjs-control");
    minus.addClass("vjs-button");
    minus.on("click", () => onClick(-1));

    this.addChild(minus);

    const plus = new Button(this.player());
    plus.addClass("lvp-clipbar-scale-button");
    plus.addClass("lvp-clipbar-scale-button--plus");
    plus.addClass("vjs-control");
    plus.addClass("vjs-button");
    plus.on("click", () => onClick(1));

    this.addChild(plus);
  }
}
