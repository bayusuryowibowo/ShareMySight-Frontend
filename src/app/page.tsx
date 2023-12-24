"use client";
import {
  MotionValue,
  motion,
  useMotionValue,
} from "framer-motion";
import HandLove from "./ui/hand-love";
import { RootState } from "./lib/stores";
import { useAppSelector } from "./lib/hooks";

export default function Home() {
  const backgroundColor: MotionValue<string> = useMotionValue("#ff0055");
  const isVisible = useAppSelector(
    (state: RootState) => state.visibility.isVisible
  );

  return (
    <main
      className={
        `w-full min-h-screen flex justify-center items-center 
        ${isVisible ? "bg-white" : "bg-gradient-to-r from-yellow-400 to-orange-400"}`
      }
      style={{ height: "100vh" }}
    >
      {isVisible ? (
        <HandLove />
      ) : (
        <motion.div
          className=" w-[1400px] h-[600px]"
          animate={{
            scale: [0.5, 0.1, 0.1, 1, 1],
            rotate: [0, 0, 180, 0, 0],
            borderRadius: ["50%", "50%", "50%", "25%", "5%"],
            width: [600, 600, 600, 600, 1000],
            height: [600, 600, 600, 600, 600],
            translateX: [0, -500, 0, 0, 0],
            translateY: [0, -300, 0, 0, 0],
            backgroundColor: "#FFFFFF",
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.2, 0.5, 0.8, 1],
          }}
          style={{ backgroundColor }}
        ></motion.div>
      )}
    </main>
  );
}
