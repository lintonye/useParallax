import { specialValueRangeToPixels } from "../src/specialValues";

test("Special value range to pixels", () => {
  const windowSize = { width: 100, height: 100 };
  expect(specialValueRangeToPixels(windowSize, ["200vw", "150vh"])).toEqual([
    200,
    150,
  ]);
});

test("Invalid format converts to 0", () => {
  const windowSize = { width: 100, height: 100 };
  expect(specialValueRangeToPixels(windowSize, ["200vws", "150vh"])).toEqual([
    0,
    150,
  ]);
});

test("Keep numbers", () => {
  const windowSize = { width: 100, height: 100 };
  expect(specialValueRangeToPixels(windowSize, [200, "150vh"])).toEqual([
    200,
    150,
  ]);
});

test("Mixing numbers and strings", () => {
  const windowSize = { width: 100, height: 100 };
  expect(
    specialValueRangeToPixels(windowSize, [200, "150vh", 150, "10vw"])
  ).toEqual([200, 150, 150, 10]);
});
