import videojs, { VideoJsPlayer } from "video.js";

import "./styles.scss";

const Button = videojs.getComponent("Button");

export default class Skipbutton extends Button {
  constructor(player: VideoJsPlayer, onClick: Function, isNext?: boolean) {
    super(player);

    this.addClass("vjs-control");
    this.addClass("vjs-button");
    this.addClass("lvp-skipbuttons-button");
    this.addClass(`lvp-skipbuttons-button${isNext ? "--next" : "--previous"}`);
    this.on("click", () => {
      onClick && onClick();
    });
  }
}
