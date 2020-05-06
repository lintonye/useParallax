import { Range, Size } from "./types";

/**
 *
 * 200 => 200, "90vw" => 0.9 * vw, otherwise return the original value
 *
 * @param windowSize
 * @param value
 */
function viewportValueToPixels(
  { width: vw, height: vh },
  value: string | number
) {
  if (typeof value === "string") {
    const pattern = /^(\d+)(vw|vh)$/;
    const match = value.match(pattern);
    if (match) {
      return Math.round(
        (Number.parseInt(match[1]) / 100) * (match[2] === "vw" ? vw : vh)
      );
    }
  }
  return value;
}

function specialValueToPixels(windowSize, value: string | number) {
  const converted = viewportValueToPixels(windowSize, value);
  return typeof converted === "number" ? converted : 0;
}

export function specialValueRangeToPixels(windowSize: Size, range: Range) {
  return range.map((v) => specialValueToPixels(windowSize, v));
}
