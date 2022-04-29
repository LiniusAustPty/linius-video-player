import videojs, { VideoJsPlayer } from "video.js";

const Component = videojs.getComponent("Component");
const Button = videojs.getComponent("Button");

export default class ClipBarScale extends Component {
  constructor(player: VideoJsPlayer, onClick: (value: number) => void) {
    super(player);

    this.addClass("lvp-timeline-scale");

    this.scales.forEach(({ label, value }) => {
      const component = new Button(this.player());
      component.addClass("lvp-timeline-scale-button");
      component.on("click", () => onClick(value));

      this.addChild(component, { text: label });
    });
  }

  public get scales() {
    return [
      {
        label: "x1",
        value: 1,
      },
      {
        label: "x2",
        value: 2,
      },
      {
        label: "x4",
        value: 4,
      },
      {
        label: "x8",
        value: 8,
      },
      {
        label: "x16",
        value: 16,
      },
      {
        label: "x32",
        value: 32,
      },
    ];
  }
}
