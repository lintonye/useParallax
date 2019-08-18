import { useSticky, useSpeed } from "../src"
import { useMotionValue } from "framer-motion"

// The follow are just used to test the compile time verification from TS
const mv = useMotionValue(0)
useSticky(mv, [0, 50], [60, 200])
useSpeed(mv, [0, 200], 15)
