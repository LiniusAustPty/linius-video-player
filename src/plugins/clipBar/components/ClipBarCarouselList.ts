import videojs, { VideoJsPlayer } from "video.js";

import ClipBarCarouselItem from "./ClipBarCarouselItem";

const Component = videojs.getComponent("Component");

export default class ClipBarCarouselList extends Component {
  private _items: ClipBarCarouselItem[] = [];

  constructor(player: VideoJsPlayer) {
    super(player);

    this.addClass("lvp-clipbar-carousel-list");
  }

  public setDurations(durations: number[]) {
    this._items.forEach((child) => this.removeChild(child));
    this._items = this.createItems(durations);
    this._items.forEach((item) => this.addChild(item));

    return this;
  }

  public setCurrentTime(value: number) {
    this._items.forEach((segment) => {
      const { startTime, duration } = segment;
      const isActive = value > startTime && value <= startTime + duration;
      const fill = isActive
        ? (value - startTime) / duration
        : startTime < value
        ? 1
        : 0;

      segment.setFill(fill);
    });

    return this;
  }

  private createItems(durations: number[]) {
    const items: ClipBarCarouselItem[] = [];
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
}
