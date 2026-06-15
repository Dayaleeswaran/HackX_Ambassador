export const FRAME_COUNT = 192;

export const framePath = (n: number) =>
  `/frames2/frame_${String(n).padStart(4, "0")}.webp`;

export type Dialogue = {
  id: string;
  show: number;
  hide: number;
  quote: string;
  speaker: string;
  film: string;
};

export const DIALOGUES: Dialogue[] = [
  {
    id: "d1",
    show: 0.0,
    hide: 0.3,
    quote: "Empowering the next generation of innovators and disruptors.",
    speaker: "HackX 2026",
    film: "AMBASSADOR DIRECTIVE",
  },
  {
    id: "d2",
    show: 0.35,
    hide: 0.55,
    quote: "Collaboration, creativity, and the courage to code the future.",
    speaker: "HackX 2026",
    film: "CODE. CREATE. INSPIRE.",
  },
  {
    id: "d3",
    show: 0.6,
    hide: 0.8,
    quote: "The ultimate platform to transform ideas into reality.",
    speaker: "HackX 2026",
    film: "LEAD THE CHANGE",
  },
];

export const HERO_TEXT_FADE_END = 0.08;
