import { Segment } from "./types";

export function segmentsToDurations(segments: Segment[]) {
  return segments.reduce<number[]>((previous, segment, index) => {
    if (segment.discontinuity || !index) {
      return [...previous, parseFloat(segment.duration)];
    }

    return previous.map((value, index, array) => {
      return index === array.length - 1
        ? value + parseFloat(segment.duration)
        : value;
    });
  }, []);
}
