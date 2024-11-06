import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";
import { Progress } from "@nextui-org/progress";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/router";

const NoiseOverlay = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <div className="noise-overlay" />
      <style>
        {`
          .noise-overlay {
            content: "";
            z-index: 50;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            opacity: 0.5;
            background: url(https://herdl.com/wp-content/uploads/2020/11/noise-web.webp);
            background-repeat: repeat;
            background-size: auto;
            animation: noise 100ms infinite;
            mix-blend-mode: multiply;
          }

          @keyframes noise {
            0%, 100% { background-position: 0% 0%; }
            10% { background-position: -5% -10%; }
            20% { background-position: -15% 5%; }
            30% { background-position: 7% -25%; }
            40% { background-position: 20% 25%; }
            50% { background-position: -25% 10%; }
            60% { background-position: 15% 5%; }
            70% { background-position: 0% 15%; }
            80% { background-position: 25% 35%; }
            90% { background-position: -10% 10%; }
          }
        `}
      </style>
    </>
  );
};

interface AnimationInstance {
  addEventListener: any;
  totalFrames: number;
  goToAndStop: (frame: number, isFrame: boolean) => void;
  destroy: () => void;
}

const LottieScrollAnimation: React.FC = () => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const lottieContainerRef = useRef<HTMLDivElement>(null);
  const [animation, setAnimation] = useState<AnimationInstance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showFinalContent, setShowFinalContent] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const unsubscribeScroll = scrollYProgress.on("change", (latest) => {
      setShowFinalContent(latest > 0.95);
    });

    return () => unsubscribeScroll();
  }, [scrollYProgress]);

  useEffect(() => {
    async function loadLottie() {
      if (typeof window !== "undefined" && lottieContainerRef.current) {
        const lottie = await import("lottie-web");
        const anim = lottie.default.loadAnimation({
          container: lottieContainerRef.current,
          renderer: "svg",
          loop: false,
          autoplay: false,
          path: "/data.json",
        }) as AnimationInstance;

        anim.addEventListener("data_ready", () => {
          setTimeout(() => {
            setIsLoading(false);
          }, 600);
        });

        anim.addEventListener("data_failed", () => {
          setIsLoading(false);
          console.error("Failed to load animation");
        });

        const handleScroll = () => {
          if (anim) {
            const progress = scrollYProgress.get();
            const frame = Math.round(progress * (anim.totalFrames - 1));
            anim.goToAndStop(frame, true);
          }
        };

        const unsubscribeProgress = scrollYProgress.on("change", handleScroll);

        let progressInterval: NodeJS.Timeout;
        if (isLoading) {
          progressInterval = setInterval(() => {
            setLoadingProgress((prev) => {
              if (prev >= 90) return prev;
              return Math.min(prev + 1, 90);
            });
          }, 50);
        }

        setAnimation(anim);

        return () => {
          anim.destroy();
          unsubscribeProgress();
          if (progressInterval) clearInterval(progressInterval);
        };
      }
    }

    loadLottie();
  }, [scrollYProgress]);

  return (
    <>
      <div
        ref={containerRef}
        className="min-h-[1100vh] w-screen relative bg-[#1a1a1a]"
      >
        <div className="h-[50vh]" />

        {isLoading && (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 z-20">
            <Progress
              size="md"
              radius="sm"
              value={loadingProgress}
              color="primary"
              aria-label="Loading animation..."
              showValueLabel={true}
              classNames={{
                base: "max-w-md",
                labelWrapper: "text-gray-400",
                value: "text-gray-400",
              }}
            />
          </div>
        )}

        <motion.div
          ref={lottieContainerRef}
          className={`fixed w-full h-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 
            ${showFinalContent ? "opacity-0" : "opacity-100"} 
            transition-opacity duration-300`}
        />

        {showFinalContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-[#F52A61] z-20"
          >
            <div className="max-w-3xl px-4 text-center">
              <h1 className="text-white font-ztNeueRalewe font-extrabold italic text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6">
                Join The Celebration
              </h1>

              <p className="text-white text-lg sm:text-xl md:text-2xl mb-12">
                Become a part of the story that continues
                <br />
                to inspire generations.
              </p>

              <Button
                radius="none"
                onPress={() => router.push("/wallofwishes")}
                className="bg-[#FDC500] text-black font-semibold rounded-[4px] text-[13px] w-[220px] h-[48px] px-8 py-3
                      sm:text-[14px] sm:w-[230px] sm:h-[50px]
                      md:text-[14px] md:w-[240px] md:h-[52px]
                      lg:text-[14px] lg:w-[248px] lg:h-[54px] lg:px-10 lg:py-4"
              >
                Explore The Wall
              </Button>
            </div>
          </motion.div>
        )}
      </div>
      <NoiseOverlay />
    </>
  );
};

export default LottieScrollAnimation;
