import * as React from "react";
import { useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { getIndex, useFlubber } from "../use-flubber";
import { useAppStore } from "../../lib/hooks";
import { toggleVisibility } from "../../lib/stores/reducers/visibility";
import {
    colors,
    paths,
    rotations,
    translationsX,
} from "../../lib/placeholder-data";

export default function HandLove() {
    const [pathIndex, setPathIndex] = useState(0);
    const progress = useMotionValue(pathIndex);
    const fill = useTransform(progress, paths.map(getIndex), colors);
    const path = useFlubber(progress, paths);

    const store = useAppStore();

    React.useEffect(() => {
        const animation = animate(progress, pathIndex, {
            duration: 0.8,
            ease: "easeInOut",
            onComplete: () => {
                if (pathIndex === paths.length - 1) {
                    console.log("toggleVisibility >>>>");
                    setTimeout(() => {
                        store.dispatch(toggleVisibility());
                    }, 1000);
                } else {
                    setPathIndex(pathIndex + 1);
                }
            },
        });

        return () => animation.stop();
    }, [pathIndex]);

    return (
        <svg className=" absolute overflow-visible" width="400" height="400">
            <g transform="translate(10 10) scale(17 17)">
                <motion.path
                    fill={fill}
                    d={path}
                    animate={{
                        rotate: rotations[pathIndex],
                        translateX: translationsX[pathIndex],
                    }}
                    transition={{
                        duration: 1.25,
                        ease: "easeInOut",
                    }}
                />
            </g>
        </svg>
    );
}
