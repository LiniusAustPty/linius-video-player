export interface Segment {
  discontinuity: boolean;
  duration: string;
  uri: string;
  timeline: string;
  resolvedUri: string;
  videoTimingInfo: {
    transmuxerPrependedSeconds: number;
    transmuxedPresentationStart: number;
    transmuxedDecodeStart: number;
    transmuxedPresentationEnd: number;
    transmuxedDecodeEnd: number;
    baseMediaDecodeTime: number;
  };
  audioTimingInfo: {
    transmuxerPrependedSeconds: number;
    transmuxedPresentationStart: number;
    transmuxedDecodeStart: number;
    transmuxedPresentationEnd: number;
    transmuxedDecodeEnd: number;
    baseMediaDecodeTime: number;
  };
  start: number;
  end: number;
}
