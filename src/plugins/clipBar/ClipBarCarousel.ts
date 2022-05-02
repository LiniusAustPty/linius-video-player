import videojs, { VideoJsPlayer } from "video.js";
import ClipBarCarouselList from "./ClipBarCarouselList";
import { Segment } from "./types";

const Component = videojs.getComponent("Component");
const Button = videojs.getComponent("Button");

export default class ClipBarCarousel extends Component {
  private _page: number = 0;
  private _scale: number = 2;
  private _carousel: ClipBarCarouselList;
  private _buttonPrevious: videojs.Button;
  private _buttonNext: videojs.Button;

  constructor(player: VideoJsPlayer) {
    super(player);

    this._buttonPrevious = this.createButton();
    this._buttonNext = this.createButton(true);

    this.addChild(this._buttonPrevious);
    this.createCarouselContainer();
    this.addChild(this._buttonNext);
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

  private createCarouselContainer() {
    this._carousel = new ClipBarCarouselList(this.player());

    const component = new Component(this.player());
    component.addClass("lvp-clipbar-carousel-inner");
    component.addChild(this._carousel);

    this.addChild(component);

    return this;
  }

  public addItems(segments: Segment[]) {
    this._carousel.addItems(segments);

    return this;
  }

  public setScale(value: number) {
    this._scale = value;

    if (this._page > this._scale - 1) {
      this._page = this._scale - 1;
    }

    return this.updatePosition();
  }

  public setTime(value: number) {
    this._carousel.setTime(value);

    return this;
  }

  private incrementPage(direction: number) {
    this._page = Math.min(Math.max(this._page + direction, 0), this._scale - 1);

    return this.updatePosition();
  }

  private updatePosition() {
    return this.updateButtons().updateCarousel();
  }

  private updateButtons() {
    if (this._page < 1) {
      this._buttonPrevious.disable();
    } else {
      this._buttonPrevious.enable();
    }

    if (this._page === this._scale - 1) {
      this._buttonNext.disable();
    } else {
      this._buttonNext.enable();
    }

    return this;
  }

  private updateCarousel() {
    this._carousel.setAttribute(
      "style",
      `left:${-this._page * 100}%;width:${this._scale * 100}%`
    );

    return this;
  }
}
