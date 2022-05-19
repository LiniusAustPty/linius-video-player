import videojs, { VideoJsPlayer } from "video.js";

import ClipBarCarouselList from "./ClipBarCarouselList";
import ClipBarPagination from "./ClipBarPagination";
import ClipBarScale from "./ClipBarScale";

const Component = videojs.getComponent("Component");
const ClickableComponent = videojs.getComponent("ClickableComponent");

export default class ClipBarCarousel extends Component {
  private _page: number = 0;
  private _durations: number[] = [];
  private _prevButton: videojs.ClickableComponent;
  private _nextButton: videojs.ClickableComponent;
  private _carousel: ClipBarCarouselList;
  private _pagination: ClipBarPagination;
  private _scale: ClipBarScale;

  constructor(player: VideoJsPlayer) {
    super(player);

    this._prevButton = new ClickableComponent(this.player());
    this._prevButton.addClass("lvp-clipbar-carousel-button");
    this._prevButton.addClass("lvp-clipbar-carousel-button--left");
    this._prevButton.setAttribute("title", "Previous page");
    this._prevButton.on(["tap", "click"], () => this.incrementPage(-1));

    this._nextButton = new ClickableComponent(this.player());
    this._nextButton.addClass("lvp-clipbar-carousel-button");
    this._nextButton.addClass("lvp-clipbar-carousel-button--right");
    this._nextButton.setAttribute("title", "Next page");
    this._nextButton.on(["tap", "click"], () => this.incrementPage(1));

    this._carousel = new ClipBarCarouselList(this.player());

    this._pagination = new ClipBarPagination(this.player());
    this._pagination.on("update-page", (_, { value }) => {
      this.setCurrentPage(value);
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
    this._carousel.setDurations(durations);

    return this;
  }

  public next() {
    return this.incrementItem(1);
  }

  public previous() {
    return this.incrementItem(-1);
  }

  public incrementItem(value: number) {
    const index = Math.min(
      Math.max(this.indexToTime(this.currentTime) + value, 0),
      this._durations.length - 1
    );
    const time = this.timeToIndex(index);

    this.player().currentTime(time);

    return this;
  }

  private incrementPage(value: number) {
    return this.setCurrentPage(
      Math.min(Math.max(this._page + value, 0), this._scale.scale - 1)
    );
  }

  public setCurrentTime(value: number) {
    this._carousel.setCurrentTime(value);

    return this;
  }

  private setCurrentPage(value: number) {
    this._page = value;

    this._pagination.setCurrentPage(this._page);

    return this.update();
  }

  public updateScale() {
    this._page =
      this._scale.scale > this._scale.prevScale && this.duration
        ? Math.floor((this.currentTime / this.duration) * this._scale.scale)
        : Math.floor((this._scale.scale / this._scale.prevScale) * this._page);

    this._pagination.setPages(this._scale.scale).setCurrentPage(this._page);

    return this.update();
  }

  private update() {
    return this.updateButtons().updatePosition();
  }

  private updateButtons() {
    this._prevButton[this._page <= 0 ? "disable" : "enable"]();
    this._nextButton[
      this._page >= this._scale.scale - 1 ? "disable" : "enable"
    ]();

    return this;
  }

  private updatePosition() {
    this._carousel.setAttribute(
      "style",
      `left:${-this._page * 100}%;width:${this._scale.scale * 100}%`
    );

    return this;
  }

  private indexToTime(time: number) {
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

  private timeToIndex(index: number) {
    return this._durations.reduce(
      (previous, value, i) => (i < index ? previous + value : previous),
      0
    );
  }

  private get duration() {
    return this.player().duration();
  }

  private get currentTime() {
    return this.player().currentTime();
  }
}
