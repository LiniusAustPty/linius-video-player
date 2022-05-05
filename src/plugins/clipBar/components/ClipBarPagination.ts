import videojs, { VideoJsPlayer } from "video.js";
import ClipBarPaginationItem from "./ClipBarPaginationItem";

const Component = videojs.getComponent("Component");

export default class ClipBarCarousel extends Component {
  private _setPage: (value: number) => void;
  private _items: ClipBarPaginationItem[] = [];
  private _wrapper: videojs.Component;

  constructor(player: VideoJsPlayer, setPage: (value: number) => void) {
    super(player);

    this._setPage = setPage;

    this.addClass("lvp-clipbar-pagination");
  }

  public setPages(value: number) {
    this._items.forEach((item) => {
      this.removeChild(item);
    });

    this._items = Array.apply(null, Array(value)).map((_, index) => {
      return new ClipBarPaginationItem(this.player(), index, (value: number) =>
        this._setPage(value)
      );
    });

    this._items.forEach((item) => {
      this.addChild(item);
    });

    return this;
  }

  public setPage(value: number) {
    this._items.forEach((item, index, array) => {
      item.setActive(value === index);
      item.setDisabled(array.length === 1);
    });

    return this;
  }
}
