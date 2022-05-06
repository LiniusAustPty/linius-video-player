import videojs, { VideoJsPlayer } from "video.js";
import ClipBarCarouselList from "./ClipBarCarouselList";
import ClipBarPagination from "./ClipBarPagination";
import ClipBarScale from "./ClipBarScale";

const Component = videojs.getComponent("Component");
const Button = videojs.getComponent("Button");

export default class ClipBarCarousel extends Component {
  private _page: number = 0;
  private _carousel: ClipBarCarouselList;
  private _durations: number[] = [];
  private _prevButton: videojs.Button;
  private _nextButton: videojs.Button;
  private _pagination: ClipBarPagination;
  private _scale: ClipBarScale;

  constructor(player: VideoJsPlayer) {
    super(player);

    this._prevButton = new Button(this.player());
    this._prevButton.addClass("lvp-clipbar-carousel-button");
    this._prevButton.addClass("lvp-clipbar-carousel-button--left");
    this._prevButton.setAttribute("title", "Previous page");
    this._prevButton.on("click", () => this.incrementPage(-1));

    this._nextButton = new Button(this.player());
    this._nextButton.addClass("lvp-clipbar-carousel-button");
    this._nextButton.addClass("lvp-clipbar-carousel-button--right");
    this._nextButton.setAttribute("title", "Next page");
    this._nextButton.on("click", () => this.incrementPage(1));

    this._carousel = new ClipBarCarouselList(this.player());

    this._pagination = new ClipBarPagination(this.player());
    this._pagination.on("update-page", (_, { value }) => {
      this.setPage(value);
    });

    this._scale = new ClipBarScale(this.player());
    this._scale.on("update-scale", () => this.updateScale());

    const carouselWrapper = new Component(this.player());
    carouselWrapper.addClass("lvp-clipbar-carousel-inner");
    carouselWrapper.addChild(this._carousel);

    const topRow = new Component(this.player());
    topRow.addClass("lvp-clipbar-row");
    topRow.addChild(this._prevButton);
    topRow.addChild(carouselWrapper);
    topRow.addChild(this._nextButton);

    const bottomRow = new Component(this.player());
    bottomRow.addClass("lvp-clipbar-row");
    bottomRow.addChild(this._pagination);
    bottomRow.addChild(this._scale);

    this.addClass("lvp-clipbar-carousel");
    this.addChild(topRow);
    this.addChild(bottomRow);
    this.updateScale();
  }

  public addItems(durations: number[]) {
    this._durations = durations;
    this._carousel.addItems(durations);

    return this;
  }

  public updateScale() {
    if (this._page > this._scale.scale - 1) {
      this._page = this._scale.scale - 1;
    }

    this._pagination.setPages(this._scale.scale).setPage(this._page);

    return this.update();
  }

  public next() {
    return this.incrementItem(1);
  }

  public previous() {
    return this.incrementItem(-1);
  }

  public incrementItem(value: number) {
    const currentTime = this.player().currentTime();
    const index = Math.min(
      Math.max(this.getIndexFromTime(currentTime) + value, 0),
      this._durations.length - 1
    );
    const time = this.getTimeFromIndex(index);

    this.player().currentTime(time);

    return this;
  }

  public setTime(value: number) {
    this._carousel.setTime(value);

    return this;
  }

  public setPage(value: number) {
    this._page = value;

    this._pagination.setPage(this._page);

    return this.update();
  }

  public incrementPage(direction: number) {
    return this.setPage(
      Math.min(Math.max(this._page + direction, 0), this._scale.scale - 1)
    );
  }

  private update() {
    return this.updateButtons().updatePosition();
  }

  private updateButtons() {
    if (this._page < 1) {
      this._prevButton.disable();
    } else {
      this._prevButton.enable();
    }

    if (this._page === this._scale.scale - 1) {
      this._nextButton.disable();
    } else {
      this._nextButton.enable();
    }

    return this;
  }

  private updatePosition() {
    this._carousel.setAttribute(
      "style",
      `left:${-this._page * 100}%;width:${this._scale.scale * 100}%`
    );

    return this;
  }

  public getIndexFromTime(time: number) {
    let index = 0;
    let total = 0;

    this._durations.forEach((value, i) => {
      if (total <= time) {
        index = i;
        total += value;
      }
    });

    return index;
  }

  public getTimeFromIndex(index: number) {
    return this._durations.reduce(
      (previous, value, i) => (i < index ? previous + value : previous),
      0
    );
  }
}
