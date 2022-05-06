import videojs, { VideoJsPlayer } from "video.js";

const Component = videojs.getComponent("Component");
const Button = videojs.getComponent("Button");

export default class ClipBarCarousel extends Component {
  private _items: videojs.Button[] = [];

  constructor(player: VideoJsPlayer) {
    super(player);

    this.addClass("lvp-clipbar-pagination");
  }

  public setPages(value: number) {
    this._items.forEach((item) => this.removeChild(item));
    this._items = Array.apply(null, Array(value)).map((_, value) => {
      const button = new Button(this.player());
      button.addClass("lvp-clipbar-pagination-item");
      button.setAttribute("title", `Page ${value + 1}`);
      button.on("click", () => this.trigger("update-page", { value }));

      return button;
    });
    this._items.forEach((item) => this.addChild(item));

    return this;
  }

  public setCurrentPage(value: number) {
    this._items.forEach((item, index, array) => {
      item[value === index ? "addClass" : "removeClass"](
        "lvp-clipbar-pagination-item--active"
      );
      item[array.length === 1 ? "disable" : "enable"]();
    });

    return this;
  }
}
