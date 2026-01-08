"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Brand from "./Brand";
import Footer from "./Footer";
import ParallaxDivider from "./ParallaxDivider";
import PhotoCarousel, { type PhotoItem } from "./PhotoCarousel";
import StoryCarousel, { type StoryItem } from "./StoryCarousel";

const R2_BASE = "https://pub-41d52824b0bb4f44898c39e1c3c63cb8.r2.dev";

/* sentence-level control for scroll reveal */
const ABOUT_SENTENCES = [
  "I'm Isaac, a recent graduate of Washington University in St. Louis, Fulbright and Truman Scholar, and a member of ChatGPT Lab at OpenAI.",
  "I've directed a communications program on Capitol Hill, published work through OpenAI, set up a congressional office, run my own consultancy, and conducted AI workshops for educators.",
  "I'm currently in the market for tech roles starting Summer 2026.",
];

const NEWS: StoryItem[] = [
  {
    source: "OpenAI",
    title: "ChatGPT Pulse Launch",
    image: `${R2_BASE}/image/news/chatgpt-pulse.png`,
    href: "https://openai.com/index/introducing-chatgpt-pulse/",
  },
  {
    source: "ChatGPT",
    title: "ChatGPT Instagram Spotlight",
    image: `${R2_BASE}/image/news/chatgpt-instagram.png`,
    href: "https://www.instagram.com/chatgpt/reel/DNyG5VvXEZM/",
  },
  {
    source: "ChatGPT",
    title: "ChatGPT Pulse – 100 Chats Project",
    image: `${R2_BASE}/image/news/100-chats.png`,
    href: "https://chatgpt.com/100chats-project",
  },
  {
    source: "Washington University in St. Louis",
    title: "Michigan Truman Scholarship",
    image: `${R2_BASE}/image/news/truman.png`,
    href: "https://source.washu.edu/2024/04/junior-seiler-awarded-truman-scholarship/",
  },
  {
    source: "Washington University in St. Louis",
    title: "Fulbright to Taiwan",
    image: `${R2_BASE}/image/news/fulbright.png`,
    href: "https://source.wustl.edu/2025/06/several-alumni-earn-fulbright-awards/",
  },
  {
    source: "Truman Foundation",
    title: "Truman Scholarship Q&A",
    image: `${R2_BASE}/image/news/truman-qa.png`,
  },
  {
    source: "Truman Foundation",
    title: "60 Truman Scholars Announced (2024)",
    image: `${R2_BASE}/image/news/truman-cohort.png`,
  },
  {
    source: "Missouri College Media Awards",
    title: "Missouri College Media Awards",
    image: `${R2_BASE}/image/news/mcma.png`,
  },
  {
    source: "Washington University in St. Louis",
    title: "University Profile",
    image: `${R2_BASE}/image/news/washu-profile.png`,
    href: "https://artsci.washu.edu/ampersand/isaac-seiler-setting-his-sights-high",
  },
];

const PROJECTS: StoryItem[] = [
  { title: "Replace with a project name", source: "Project" },
  { title: "Replace with another project", source: "Project" },
  { title: "Replace with another project", source: "Project" },
];

const PHOTOS: PhotoItem[] = [
  { location: "New York" },
  { location: "St. Louis" },
  { location: "San Francisco" },
  { location: "Washington, D.C." },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-left text-4xl font-normal leading-none tracking-tight md:text-6xl">
      {children}
    </h2>
  );
}

export default function Main() {
  const { scrollYProgress } = useScroll({
    offset: ["start end", "center center"],
  });

  return (
    <main className="min-h-[100svh] bg-neutral-900 text-neutral-50">
      <Brand />

      <div className="w-full overflow-x-hidden px-4 sm:px-6 pt-[132px] md:pt-[152px] pb-16">
        {/* ABOUT ME */}
        <section
          id="about"
          className="
            scroll-mt-24
            min-h-[70svh]
            md:min-h-[65svh]
            flex flex-col justify-end
          "
        >
          <div className="mb-3">
            <SectionTitle>About Me</SectionTitle>
          </div>

          <div className="space-y-2 max-w-[48ch]">
            {/* first sentence: always white */}
            <p className="text-2xl md:text-4xl leading-[1.15] tracking-tight text-white">
              {ABOUT_SENTENCES[0]}
            </p>

            {/* remaining sentences: dark → white on scroll */}
            {ABOUT_SENTENCES.slice(1).map((sentence, i) => {
              const color = useTransform(
                scrollYProgress,
                [0.12 + i * 0.18, 0.4 + i * 0.18],
                ["#6b7280", "#ffffff"] // neutral-500 → white
              );

              return (
                <motion.p
                  key={i}
                  style={{ color }}
                  className="text-2xl md:text-4xl leading-[1.15] tracking-tight"
                >
                  {sentence}
                </motion.p>
              );
            })}
          </div>
        </section>

        <ParallaxDivider amount={-18} />

        {/* NEWS */}
        <section id="news" className="scroll-mt-24">
          <div className="mb-4">
            <SectionTitle>News</SectionTitle>
          </div>
          <StoryCarousel items={NEWS} />
        </section>

        <ParallaxDivider amount={22} />

        {/* PROJECTS */}
        <section id="projects" className="scroll-mt-24">
          <div className="mb-4">
            <SectionTitle>Projects</SectionTitle>
          </div>
          <StoryCarousel items={PROJECTS} />
        </section>

        <ParallaxDivider amount={-14} />

        {/* PHOTOS */}
        <section id="photos" className="scroll-mt-24">
          <div className="mb-4">
            <SectionTitle>Photos</SectionTitle>
          </div>
          <PhotoCarousel items={PHOTOS} />
        </section>

        <ParallaxDivider amount={18} />

        <Footer />
      </div>
    </main>
  );
}
