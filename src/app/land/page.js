'use client';
import { ReactLenis } from "@studio-freight/react-lenis";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

const SmoothScrollHero = () => {
  return (
    <div className="bg-zinc-950">
      <ReactLenis
        root
        options={{
          lerp: 0.05,
        }}
      >
        <Nav />
        <Hero />
        <StepByStepGuide />
        <UserFriendlyInterface />
        <AccidentReportingComponent />
      </ReactLenis>
    </div>
  );
};

const Nav = () => {
  return (
    <motion.nav
      initial={{ y: -48, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.75 }}
      className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-3 text-white bg-zinc-900/75 backdrop-blur-md"
    >
      <button
        onClick={() => {
          document.getElementById("report-accident")?.scrollIntoView({
            behavior: "smooth",
          });
        }}
        className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
      >
        LAUNCH SCHEDULE
      </button>
    </motion.nav>
  );
};

const SECTION_HEIGHT = 1500;

const Hero = () => {
  return (
    <div
      style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)` }}
      className="relative w-full"
    >
      <ReportAccidentsHero />
      <ParallaxImages />
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-b from-zinc-950/0 to-zinc-950" />
    </div>
  );
};

const ReportAccidentsHero = () => {
  const { scrollY } = useScroll();

  const clip1 = useTransform(scrollY, [0, 1500], [25, 0]);
  const clip2 = useTransform(scrollY, [0, 1500], [75, 100]);

  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`;

  const backgroundSize = useTransform(
    scrollY,
    [0, SECTION_HEIGHT + 500],
    ["170%", "100%"]
  );
  const opacity = useTransform(
    scrollY,
    [SECTION_HEIGHT, SECTION_HEIGHT + 500],
    [1, 0]
  );

  return (
    <motion.div
      className="sticky top-0 h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{
        clipPath,
        backgroundSize,
        opacity,
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 1 }}
        className="text-center text-white"
      >
        <h1 className="text-5xl font-bold">
          Report Accidents and Help Save Lives
        </h1>
        <p className="mt-4 text-lg">
          A step-by-step guide to reporting accidents and contributing to a safer community.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg"
        >
          Report Now
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const ParallaxImages = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-[200px]">
      <ParallaxImg
        src="https://images.unsplash.com/photo-1484600899469-230e8d1d59c0?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="And example of a space launch"
        start={-200}
        end={200}
        className="w-1/3"
      />
      <ParallaxImg
        src="https://images.unsplash.com/photo-1446776709462-d6b525c57bd3?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="An example of a space launch"
        start={200}
        end={-250}
        className="mx-auto w-2/3"
      />
      <ParallaxImg
        src="https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Orbiting satellite"
        start={-200}
        end={200}
        className="ml-auto w-1/3"
      />
      <ParallaxImg
        src="https://images.unsplash.com/photo-1494022299300-899b96e49893?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Orbiting satellite"
        start={0}
        end={-500}
        className="ml-24 w-5/12"
      />
    </div>
  );
};

const ParallaxImg = ({ className, alt, src, start, end }) => {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`${start}px end`, `end ${end * -1}px`],
  });

  const opacity = useTransform(scrollYProgress, [0.75, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.85]);

  const y = useTransform(scrollYProgress, [0, 1], [start, end]);
  const transform = useMotionTemplate`translateY(${y}px) scale(${scale})`;

  return (
    <motion.img
      src={src}
      alt={alt}
      className={className}
      ref={ref}
      style={{ transform, opacity }}
    />
  );
};

const StepByStepGuide = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 text-gray-900">
      <motion.div
        initial={{ y: 48, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0.75 }}
        className="flex flex-col md:flex-row items-center justify-between bg-white shadow-md rounded-lg p-8"
      >
        <div className="md:w-2/3">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            A Step-by-Step Guide to Reporting an Accident and Uploading Photos/Videos
          </h2>
          <p className="text-sm text-gray-600">
            Reporting an accident is quick and easy. Simply fill out the necessary details and upload your photos or videos to share your experience.
          </p>
        </div>
        <div className="mt-6 md:mt-0 md:w-1/3 flex justify-center">
          <motion.img
            src="https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Guide Image"
            className="h-48 w-48 object-cover rounded-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ ease: "easeInOut", duration: 0.75 }}
          />
        </div>
      </motion.div>
    </section>
  );
};

const UserFriendlyInterface = () => {
  return (
    <section className="bg-gray-50 py-24">
      <div className="mx-auto max-w-5xl px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          User-Friendly Interface for Accident Reporting
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          We've made it easier than ever to report an accident. Our intuitive interface allows you to quickly fill out the details and submit your report.
        </p>
      </div>
    </section>
  );
};

const AccidentReportingComponent = () => {
  return (
    <section
      id="report-accident"
      className="mx-auto max-w-7xl px-4 py-24 text-gray-900"
    >
      <div className="flex flex-col md:flex-row items-center justify-between bg-white shadow-md rounded-lg p-8">
        <div className="md:w-2/3">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Report an Accident Now
          </h2>
          <p className="text-sm text-gray-600">
            Fill in the form to report an accident. Provide accurate details and upload any relevant media to help us understand the situation better.
          </p>
        </div>
        <div className="mt-6 md:mt-0 md:w-1/3 flex justify-center">
          <motion.img
            src="https://images.unsplash.com/photo-1494022299300-899b96e49893?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Accident Reporting"
            className="h-48 w-48 object-cover rounded-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ ease: "easeInOut", duration: 0.75 }}
          />
        </div>
      </div>
    </section>
  );
};

export default SmoothScrollHero;
