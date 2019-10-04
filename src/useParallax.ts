import { useTransform, MotionValue } from "framer-motion"
import * as React from "react"

const speed = s => v => -v * s

// const sticky = () => speed(-1)

export function usePositiveOffset(
  offset: MotionValue<number>
): MotionValue<number> {
  return useTransform(offset, v => -v)
}

type Range = number[]

type RangeSpeedPair = Range | number

export function useSpeed(
  positiveOffset: MotionValue<number>,
  ...rangeSpeedPairs: RangeSpeedPair[]
): MotionValue<number> {
  return useParallax(
    positiveOffset,
    ...rangeSpeedPairs.map(v => (typeof v === "number" ? speed(v) : v))
  )
}

export function useSticky(
  positiveOffset: MotionValue<number>,
  ...ranges: Range[]
): MotionValue<number> {
  return useSpeed(
    positiveOffset,
    ...shallowFlatten(ranges.map(range => [range, -1]))
  )
}

function shallowFlatten(array) {
  return array.reduce((r, innerArray) => [...r, ...innerArray], [])
}

function preprocessRangeFun(rangeFunPairs) {
  // TODO validate no intersection in ranges
  const rangeFunArray = []
  for (let i = 0; i < rangeFunPairs.length; i += 2) {
    rangeFunArray.push([rangeFunPairs[i], rangeFunPairs[i + 1]])
  }
  const sortedRangeFunPairs = rangeFunArray.sort((p1, p2) => {
    const r1 = p1[0]
    const r2 = p2[0]
    return r1[0] < r2[0] ? -1 : r1[0] === r2[0] ? 0 : 1
  })
  // fill in gaps
  const result = []
  for (let i = 0; i < sortedRangeFunPairs.length; i++) {
    const pair = sortedRangeFunPairs[i]
    result.push(pair)
    if (i < sortedRangeFunPairs.length - 1) {
      const nextPair = sortedRangeFunPairs[i + 1]
      if (pair[0][1] !== nextPair[0][0]) {
        result.push([[pair[0][1], nextPair[0][0]], speed(0)])
      }
    }
  }
  return result
}

export function useParallax(
  positiveOffset: MotionValue<number>,
  ...rangeFunPairs
) {
  const processedRangeFunPairs = preprocessRangeFun(rangeFunPairs)
  const getRange = index =>
    processedRangeFunPairs[index] && processedRangeFunPairs[index][0]
  const getFun = index =>
    processedRangeFunPairs[index] && processedRangeFunPairs[index][1]

  return useTransform(positiveOffset, v => {
    let lastV = 0
    for (let i = 0; i < processedRangeFunPairs.length; i++) {
      const range = getRange(i)
      const fun = getFun(i)
      if (v < range[0]) {
        const prevFun = getFun(i - 1)
        const prevRange = getRange(i - 1)
        prevFun && (lastV = prevFun(prevRange[1]))
      } else if (v <= range[1]) {
        const nv = fun(v - range[0]) + lastV
        return nv
      } else {
        /* v > range[1] */
        lastV = fun(range[1] - range[0]) + lastV
      }
    }
    return lastV
  })
}

type TriggerCallback = (direction: number) => void

export function useTrigger(
  positiveOffset: MotionValue<number>,
  range: Range,
  actionFun: TriggerCallback
) {
  React.useEffect(() => {
    let lastV = 0,
      lastDirection = 0
    const sub = positiveOffset.onChange(function(v) {
      if (range[0] <= v && v <= range[1]) {
        const direction = Math.sign(lastV - v)
        lastV = v
        if (lastDirection !== direction) {
          actionFun(direction)
          lastDirection = direction
        }
      }
    })
    return sub
  })
}
