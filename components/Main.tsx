// components/Main.tsx
"use client";

import Brand from "./Brand";
import Footer from "./Footer";
import ParallaxDivider from "./ParallaxDivider";
import PhotoCarousel, { type PhotoItem } from "./PhotoCarousel";
import StoryCarousel, { type StoryItem } from "./StoryCarousel";

const BIO =
  "I'm Isaac, a recent graduate of Washington University in St. Louis, Fulbright and Truman Scholar, and a member of ChatGPT Lab at OpenAI. I've directed a communications program on Capitol Hill, published work through OpenAI, set up a congressional office, run my own consultancy, and conducted AI workshops for educators. I'm currently in the market for tech roles starting Summer 2026.";

const NEWS: StoryItem[] = [
  {
    source: "Press",
    title: "Replace with your latest news item",
    image: "/placeholders/story.svg",
    href: "https://example.com",
  },
  {
    source: "Press",
    title: "Replace with another headline",
    image: "/placeholders/story.svg",
    href: "https://example.com",
  },
  {
    source: "Press",
    title: "Replace with another headline",
    image: "/placeholders/story.svg",
  },
];

const PROJECTS: StoryItem[] = [
  {
    source: "Project",
    title: "Replace with a project name",
    image: "/placeholders/story.svg",
    href: "https://example.com",
  },
  {
    source: "Project",
    title: "Replace with another project",
    image: "/placeholders/story.svg",
  },
  {
    source: "Project",
    title: "Replace with another project",
    image: "/placeholders/story.svg",
  },
];

const PHOTOS: PhotoItem[] = [
  { location: "New York", image: "/placeholders/photo.svg" },
  { location: "St. Louis", image: "/placeholders/photo.svg" },
  { location: "San Francisco", image: "/placeholders/photo.svg" },
  { location: "D.C.", image: "/placeholders/photo.svg" },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-left text-4xl font-normal leading-none tracking-tight md:text-6xl">
      {children}
    </h2>
  );
}

export default function Main() {
  return (
    <main className="min-h-[100svh] bg-neutral-900 text-neutral-50">
      <Brand />

      {/* page buffer + prevents horizontal overflow */}
      <div className="w-full overflow-x-hidden px-4 sm:px-6 pt-[132px] md:pt-[152px] pb-16">
        {/* bio (fills the initial frame) */}
        <section
          id="bio"
          className="scroll-mt-24 min-h-[calc(100svh-180px)] md:min-h-[calc(100svh-210px)] flex flex-col justify-center"
        >
          <div className="mb-4 md:mb-5">
            <SectionTitle>Bio</SectionTitle>
          </div>
          <div className="max-w-[62ch]">
            <p className="text-sm leading-relaxed text-neutral-50/80 sm:text-base">
              {BIO}
            </p>
          </div>
        </section>

        <ParallaxDivider amount={-18} />

        {/* news feed */}
        <section id="news" className="scroll-mt-24">
          <div className="mb-4 md:mb-5">
            <SectionTitle>News</SectionTitle>
          </div>
          <div className="mb-2">
            <StoryCarousel items={NEWS} />
          </div>
        </section>

        <ParallaxDivider amount={22} />

        {/* projects */}
        <section id="projects" className="scroll-mt-24">
          <div className="mb-4 md:mb-5">
            <SectionTitle>Projects</SectionTitle>
          </div>
          <div className="mb-2">
            <StoryCarousel items={PROJECTS} />
          </div>
        </section>

        <ParallaxDivider amount={-14} />

        {/* photos */}
        <section id="photos" className="scroll-mt-24">
          <div className="mb-4 md:mb-5">
            <SectionTitle>Photos</SectionTitle>
          </div>
          <div className="mb-2">
            <PhotoCarousel items={PHOTOS} />
          </div>
        </section>

        <ParallaxDivider amount={18} />

        <Footer />
      </div>
    </main>
  );
}

