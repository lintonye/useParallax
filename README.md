# useParallax
Functions `usePositiveOffset`, `useSticky`, `useSpeed` and `useTrigger` are custom hook that I wrote to make it easier to create common parallax effect such as sticky headers.

## `usePositiveOffset`

### Description
Convert a negative offset `MotionValue`, that comes with `contentOffsetX`  and `contentOffsetY` props of `Scroll`, to a positive one.

### Usage

```jsx
    // ==> 1. import it
    import { usePositiveOffset } from "./useParallax"
    ...
    function App() {
      // ==> 2. call usePositiveOffset in a function component
      const positiveOffset = usePositiveOffset(offset)
      ...
    }
```

## `useSticky`

### Description
Returns a `MotionValue` which can be used to make an item sticky when the `Scroll` is scrolled into specific ranges.

### Usage

```jsx
    // ==> 1. import it
    import { useSticky } from "./useParallax"
    ...
    
    function App() {
      ...
      // ==> 2. call useSticky to create a new MotionValue. The first parameter MUST be a positive offset.
      const titleOffset = useSticky(positiveOffset, [200, 400], [500, 700], [900, 1200])
      ...
      return (
        <Scroll contentOffsetY={offset}>
          // ==> 3. use titleOffset as a prop
          <Frame y={titleOffset}>Title</Frame>
          ...
        </Scroll>
      )
    }
```

In the code above, the title will be sticky when the list is scrolled into three ranges. When the list is scrolled outside of these ranges, the title will scroll with the rest of list normally.


## `useSpeed`

### Description
Returns a `MotionValue` which can be used to make an item move at a different speed when the `Scroll` is scrolled into specified ranges.

### Usage

```jsx
    // ==> 1. import it
    import { useSpeed } from "./useParallax"
    ...
    
    function App() {
      ...
      // ==> 2. call useSpeed to create a new MotionValue. 
      // The first parameter MUST be a positive offset. 
      // The following parameters are range-speed pairs.
      const titleOffset = useSpeed(positiveOffset, 
        [0, 200 ], 1, // speed > 0: the item moves faster than the scroll speed
        [200, 400], 0, // speed = 0: the item scrolls at the same speed as other items
        [500, 700], -0.5, // -1 < speed < 0: the item moves slower than scroll speed
        [900, 1200], -1, // speed = -1: the item is sticky
        [1200, 1500], -2 // speed < -1: the item moves in the opposite direction than the scrolling
      )
      ...
      return (
        <Scroll contentOffsetY={offset}>
          // ==> 3. use titleOffset as a prop
          <Frame y={titleOffset}>Title</Frame>
          ...
        </Scroll>
      )
    }
```

## `useTrigger`

### Description
Trigger something, e.g. an animation, when scrolling into the specified range

### Usage

```jsx
    // ==> 1. import it
    import { useTrigger } from "./useParallax"
    ...
    
    function App() {
      ...
      // ==> 2. call useTrigger to setup the trigger
      useTrigger(
        positiveOffset, // The first parameter MUST be a positive offset. 
        [200, 300], // Trigger range
        // This function will be called only once per scroll direction.
        //   direction > 0: scrolling up/left (normal scroll)
        //   direction < 0: scrolling down/right
        function(direction) {
          if (direction > 0) anim.start({ rotate: 180 })
          else anim.start({ rotate: 0 })
        }
      )
      ...
    }
```

## Special values
In ranges, the following special values are supported:

- `vh`: Viewport height, e.g. `'100vh'` means 100% of viewport height
- `vw`: Viewport height, e.g. `'50vw'` means 50% of viewport height

```jsx
const titleOffset = useSticky(positiveOffset, [0, '50vh'], ['60vh', 2000])
```

## `useSpecialValueRange`
A hook that converts a range with special values into pixels.

```jsx
const opacity = useTransform(useSpecialValueRange(['10vh', '50vh']), [0, 1])
```