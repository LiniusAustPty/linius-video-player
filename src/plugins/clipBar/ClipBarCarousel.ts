import videojs, { VideoJsPlayer } from "video.js";
import { SegmentType } from "./types";

const Component = videojs.getComponent("Component");
const Button = videojs.getComponent("Button");

export default class ClipBarCarousel extends Component {
  private _page: number = 0;
  private _scale: number = 1;
  private _carousel: videojs.Component;

  constructor(player: VideoJsPlayer) {
    super(player);

    this.createButton()
      .createCarouselContainer()
      .createButton(true)
      .setScale(4)
      .addClass("lvp-timeline-carousel");
  }

  private createButton(isRight?: boolean) {
    const component = new Button(this.player());
    component.addClass("lvp-timeline-carousel-button");
    component.addClass(
      `lvp-timeline-carousel-button--${isRight ? "right" : "left"}`
    );
    component.on("click", () => this.incrementPage(isRight ? 1 : -1));

    this.addChild(component);

    return this;
  }

  private createCarouselContainer() {
    this._carousel = new Component(this.player());
    this._carousel.addClass("lvp-timeline-carousel-segments-scroll");

    const component = new Component(this.player());
    component.addClass("lvp-timeline-carousel-segments");
    component.addChild(this._carousel);

    this.addChild(component);

    return this;
  }

  private createSegment(x: number, width: number, time: number) {
    const inner = new Button(this.player());
    inner.addClass("segment-inner");
    inner.on("click", () => {
      this.player().currentTime(time);
    });

    const component = new Component(this.player());
    component.addClass("segment");
    component.setAttribute("style", `left:${x * 100}%;width:${width * 100}%`);
    component.addChild(inner);

    return component;
  }

  public setSegments(segments: SegmentType[]) {
    this._carousel.children().forEach((child) => {
      this._carousel.removeChild(child);
    });

    this.mapSegmentsToPositions(segments).forEach((segment) => {
      this._carousel.addChild(
        this.createSegment(segment.x, segment.width, segment.time)
      );
    });

    return this;
  }

  public setScale(value: number) {
    this._scale = value;

    if (this._page > this._scale - 1) {
      this._page = this._scale - 1;
    }

    return this.updatePosition();
  }

  private incrementPage(direction: number) {
    this._page = Math.min(Math.max(this._page + direction, 0), this._scale - 1);

    return this.updatePosition();
  }

  private updatePosition() {
    this._carousel.setAttribute(
      "style",
      `left:${-this._page * 100}%;width:${this._scale * 100}%`
    );

    return this;
  }

  private mapSegmentsToPositions(segments: SegmentType[]) {
    const results: { x: number; width: number; time: number }[] = [];
    const totalDuration = segments.reduce(
      (count, { duration }) => count + parseFloat(duration),
      0
    );

    if (!totalDuration) {
      return results;
    }

    let currentTime = 0;

    results.push(
      ...segments.map(({ duration }) => {
        const time = currentTime;

        currentTime = currentTime + parseFloat(duration);

        return {
          x: time / totalDuration,
          width: parseFloat(duration) / totalDuration,
          time,
        };
      })
    );

    return results;
  }
}
