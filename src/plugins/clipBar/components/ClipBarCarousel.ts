import videojs, { VideoJsPlayer } from "video.js";
import ClipBarCarouselList from "./ClipBarCarouselList";
import ClipBarPagination from "./ClipBarPagination";
import ClipBarScale from "./ClipBarScale";

const Component = videojs.getComponent("Component");
const Button = videojs.getComponent("Button");

export default class ClipBarCarousel extends Component {
  private _page: number = 0;
  private _scale: number = 1;
  private _carousel: ClipBarCarouselList;
  private _durations: number[] = [];
  private _buttonPrevious: videojs.Button;
  private _buttonNext: videojs.Button;
  private _pagination: ClipBarPagination;
  private _scaleUI: ClipBarScale;

  constructor(player: VideoJsPlayer) {
    super(player);

    this._buttonPrevious = this.createButton();
    this._buttonNext = this.createButton(true);
    this._carousel = new ClipBarCarouselList(this.player());
    this._pagination = new ClipBarPagination(this.player(), (value: number) =>
      this.setPage(value)
    );

    this._scaleUI = new ClipBarScale(this.player(), (value: number) =>
      this.incrementScale(value)
    );

    const carouselWrapper = new Component(this.player());
    carouselWrapper.addClass("lvp-clipbar-carousel-inner");
    carouselWrapper.addChild(this._carousel);

    const centerWrapper = new Component(this.player());
    centerWrapper.addClass("lvp-clipbar-row--bottom-center");
    centerWrapper.addChild(this._pagination);

    const leftWrapper = new Component(this.player());
    leftWrapper.addClass("lvp-clipbar-row--bottom-left");

    const rightWrapper = new Component(this.player());
    rightWrapper.addClass("lvp-clipbar-row--bottom-right");
    rightWrapper.addChild(this._scaleUI);

    const bottomWrapper = new Component(this.player());
    bottomWrapper.addClass("lvp-clipbar-row");
    bottomWrapper.addClass("lvp-clipbar-row--bottom");
    bottomWrapper.addChild(leftWrapper);
    bottomWrapper.addChild(centerWrapper);
    bottomWrapper.addChild(rightWrapper);

    const centerWrapper2 = new Component(this.player());
    centerWrapper2.addClass("lvp-clipbar-row--top-center");
    centerWrapper2.addChild(carouselWrapper);

    const leftWrapper2 = new Component(this.player());
    leftWrapper2.addClass("lvp-clipbar-row--top-left");
    leftWrapper2.addChild(this._buttonPrevious);

    const rightWrapper2 = new Component(this.player());
    rightWrapper2.addClass("lvp-clipbar-row--top-right");
    rightWrapper2.addChild(this._buttonNext);

    const highWrapper = new Component(this.player());
    highWrapper.addClass("lvp-clipbar-row");
    highWrapper.addClass("lvp-clipbar-row--top");
    highWrapper.addChild(leftWrapper2);
    highWrapper.addChild(centerWrapper2);
    highWrapper.addChild(rightWrapper2);

    this.addChild(highWrapper);
    this.addChild(bottomWrapper);
    this.setScale(this._scale).addClass("lvp-clipbar-carousel");
  }

  private createButton(isRight?: boolean) {
    const component = new Button(this.player());
    component.addClass("lvp-clipbar-carousel-button");
    component.addClass(
      `lvp-clipbar-carousel-button--${isRight ? "right" : "left"}`
    );
    component.on("click", () => this.incrementPage(isRight ? 1 : -1));

    return component;
  }

  public addItems(durations: number[]) {
    this._durations = durations;
    this._carousel.addItems(durations);

    return this;
  }

  public incrementScale(value: number) {
    return this.setScale(Math.min(Math.max(this._scale + value, 0), 3));
  }

  public setScale(value: number) {
    this._scale = value;

    this._scaleUI.setScale(value);

    if (this._page > this.scale - 1) {
      this._page = this.scale - 1;
    }

    this._pagination.setPages(this.scale).setPage(this._page);

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
      Math.min(Math.max(this._page + direction, 0), this.scale - 1)
    );
  }

  private update() {
    return this.updateButtons().updatePosition();
  }

  private updateButtons() {
    if (this._page < 1) {
      this._buttonPrevious.disable();
    } else {
      this._buttonPrevious.enable();
    }

    if (this._page === this.scale - 1) {
      this._buttonNext.disable();
    } else {
      this._buttonNext.enable();
    }

    return this;
  }

  private updatePosition() {
    this._carousel.setAttribute(
      "style",
      `left:${-this._page * 100}%;width:${this.scale * 100}%`
    );

    return this;
  }

  public getIndexFromTime(time: number) {
    let index = 0;
    let total = 0;

    this._durations.forEach((value, i) => {
      if (total < time) {
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

  public get scale() {
    return Math.pow(2, this._scale + 1) / 2;
  }
}
