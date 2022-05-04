import videojs, { VideoJsPlayer } from "video.js";

const Button = videojs.getComponent("Button");

export default class ClipBarPaginationItem extends Button {
  constructor(
    player: VideoJsPlayer,
    index: number,
    onClick: (value: number) => void
  ) {
    super(player);

    this.addClass("lvp-clipbar-pagination-item");
    this.on("click", () => {
      onClick && onClick(index);
    });
  }

  public setActive(value?: boolean) {
    if (value) {
      this.addClass("lvp-clipbar-pagination-item--active");
    } else {
      this.removeClass("lvp-clipbar-pagination-item--active");
    }
  }
}
