import videojs, { VideoJsPlayer } from "video.js";

import ClipBarCarouselItem from "./ClipBarCarouselItem";
import { Segment } from "./types";

const Component = videojs.getComponent("Component");

export default class ClipBarCarouselList extends Component {
  private _items: ClipBarCarouselItem[] = [];

  constructor(player: VideoJsPlayer) {
    super(player);

    this.addClass("lvp-clipbar-carousel-list");
  }

  public addItems(segments: Segment[]) {
    this.removeChildren();

    this._items = this.createItems(segments);
    this._items.forEach((item) => {
      this.addChild(item);
    });
  }

  public setTime(value: number) {
    this._items.forEach((segment) => {
      const isActive =
        value >= segment.startTime &&
        value <= segment.startTime + segment.duration;
      const fill = isActive
        ? (value - segment.startTime) / segment.duration
        : segment.startTime < value
        ? 1
        : 0;

      segment.setFill(fill);
    });
  }

  private calculateTotalDuration(segments: Segment[]) {
    return segments.reduce(
      (count, { duration }) => count + parseFloat(duration),
      0
    );
  }

  private createItems(segments: Segment[]) {
    const items: ClipBarCarouselItem[] = [];
    const totalDuration = this.calculateTotalDuration(segments);

    if (!totalDuration) {
      return items;
    }

    let currentTime = 0;

    segments.forEach(({ duration }) => {
      const startTime = currentTime;
      const durationFloat = parseFloat(duration);

      currentTime = currentTime + durationFloat;

      const component = new ClipBarCarouselItem(
        this.player(),
        startTime / totalDuration,
        durationFloat / totalDuration,
        startTime,
        durationFloat
      );

      items.push(component);
    });

    return items;
  }

  private removeChildren() {
    this.children().forEach((child) => {
      this.removeChild(child);
    });
  }
}
