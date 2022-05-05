import videojs, { VideoJsPlayer } from "video.js";

const Button = videojs.getComponent("Button");

export default class ClipBarPaginationItem extends Button {
  constructor(player: VideoJsPlayer, onClick: Function) {
    super(player);

    this.addClass("lvp-clipbar-pagination-item");
    this.on("click", () => {
      onClick && onClick();
    });
  }

  public setActive(value?: boolean) {
    if (value) {
      this.addClass("lvp-clipbar-pagination-item--active");
    } else {
      this.removeClass("lvp-clipbar-pagination-item--active");
    }
  }

  public setDisabled(value?: boolean) {
    if (value) {
      this.disable();
    } else {
      this.enable();
    }
  }
}
