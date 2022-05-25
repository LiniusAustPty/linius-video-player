import { Segment } from "../types";

export function segmentsToDurations(segments: Segment[]) {
  return segments.reduce<number[]>((previous, segment, index) => {
    //if (segment.discontinuity || !index) {
    return [...previous, parseFloat(segment.duration)];
    //}

    return previous.map((value, index, array) => {
      return index === array.length - 1
        ? value + parseFloat(segment.duration)
        : value;
    });
  }, []);
}

export function timeToIndex(durations: number[], index: number) {
  return durations.reduce(
    (previous, value, i) => (i < index ? previous + value : previous),
    0
  );
}

export function indexToTime(durations: number[], time: number) {
  let index = 0;
  let total = 0;

  durations.forEach((value, i) => {
    if (total <= time) {
      index = i;
      total += value;
    }
  });

  return index;
}
