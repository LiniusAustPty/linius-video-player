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

  private createItems(segments: Segment[]) {
    const items: ClipBarCarouselItem[] = [];
    const durations = segments.reduce<number[]>((previous, segment, index) => {
      if (segment.discontinuity || !index) {
        return [...previous, parseFloat(segment.duration)];
      } else {
        return previous.map((value, index, array) => {
          return index === array.length - 1
            ? value + parseFloat(segment.duration)
            : value;
        });
      }
    }, []);
    const totalDuration = durations.reduce(
      (previous, value) => previous + value,
      0
    );

    if (!totalDuration) {
      return items;
    }

    let currentTime = 0;

    durations.forEach((duration) => {
      const component = new ClipBarCarouselItem(
        this.player(),
        currentTime / totalDuration,
        duration / totalDuration,
        currentTime,
        duration
      );

      items.push(component);

      currentTime += duration;
    });

    return items;
  }

  private removeChildren() {
    this.children().forEach((child) => {
      this.removeChild(child);
    });
  }
}
