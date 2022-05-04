import videojs, { VideoJsPlayer } from "video.js";
import ClipBarCarouselList from "./ClipBarCarouselList";
import ClipBarPaginationItem from "./ClipBarPaginationItem";
import { Segment } from "./types";

const Component = videojs.getComponent("Component");
const Button = videojs.getComponent("Button");

export default class ClipBarCarousel extends Component {
  private _page: number = 0;
  private _setPage: (value: number) => void;
  private _incrementPage: (value: number) => void;
  private _items: ClipBarPaginationItem[] = [];
  private _carousel: videojs.Component;
  private _buttonPrevious: videojs.Button;
  private _buttonNext: videojs.Button;

  constructor(
    player: VideoJsPlayer,
    incrementPage: (value: number) => void,
    setPage: (value: number) => void
  ) {
    super(player);

    this._incrementPage = incrementPage;
    this._setPage = setPage;

    this._buttonPrevious = this.createButton();
    this._buttonNext = this.createButton(true);
    this._carousel = new Component(this.player());
    this._carousel.addClass("lvp-clipbar-pagination-inner");

    this.addChild(this._buttonPrevious);
    this.addChild(this._carousel);
    this.addChild(this._buttonNext);
    this.addClass("lvp-clipbar-pagination");
  }

  private createButton(isRight?: boolean) {
    const component = new Button(this.player());
    component.addClass("lvp-clipbar-pagination-button");
    component.addClass(
      `lvp-clipbar-pagination-button--${isRight ? "right" : "left"}`
    );
    component.on("click", () => this._incrementPage(isRight ? 1 : -1));

    return component;
  }

  public setPages(value: number) {
    this._items.forEach((child) => {
      this._carousel.removeChild(child);
    });

    this._items = Array.apply(null, Array(value)).map((_, index) => {
      return new ClipBarPaginationItem(this.player(), index, (value: number) =>
        this._setPage(value)
      );
    });

    this._items.forEach((item) => {
      this._carousel.addChild(item);
    });

    return this;
  }

  public setPage(value: number) {
    this._page = value;

    this._items.forEach((item, index) => {
      item.setActive(value === index);
    });

    return this;
  }

  private update() {}
}
