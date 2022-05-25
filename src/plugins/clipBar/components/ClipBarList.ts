import videojs, { VideoJsPlayer } from "video.js";

import ClipBarItem from "./ClipBarItem";

const Component = videojs.getComponent("Component");

export default class ClipBarList extends Component {
  private _items: ClipBarItem[] = [];
  private _container: videojs.Component;

  constructor(player: VideoJsPlayer) {
    super(player);

    this._container = new Component(player);
    this._container.addClass("lvp-clipbar-list");

    this.addClass("lvp-clipbar-container");
    this.addChild(this._container);
  }

  public setDurations(durations: number[]) {
    this._items.forEach((child) => this._container.removeChild(child));
    this._items = this.createItems(durations);
    this._items.forEach((item) => this._container.addChild(item));

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
    const items: ClipBarItem[] = [];
    const totalDuration = durations.reduce(
      (previous, value) => previous + value,
      0
    );

    if (!totalDuration) {
      return items;
    }

    let currentTime = 0;

    durations.forEach((duration) => {
      const component = new ClipBarItem(
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
