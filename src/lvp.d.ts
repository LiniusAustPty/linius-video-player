import { VideoJsPlayer, VideoJsPlayerOptions } from "video.js";
import "./styles.scss";
export default class LVP {
    private _player;
    constructor(elementId?: string, config?: VideoJsPlayerOptions);
    get player(): VideoJsPlayer;
}
