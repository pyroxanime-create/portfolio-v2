/**
 * Skills, carried over unchanged from the original portfolio
 * (same groups, labels and percentages; only "Sigma / Figma" is now "Figma").
 */
export type Skill = { label: string; percent: number };

export type SkillGroup = {
  title: string;
  /** Bar colour: 1 cobalt, 2 apricot, 3 mint. Each has a light and a dark value. */
  tone: 1 | 2 | 3;
  items: Skill[];
};

export const skillsIntro = "Craft, systems, and implementation.";

export const skillGroups: SkillGroup[] = [
  {
    title: "Core competencies",
    tone: 1,
    items: [
      { label: "User research & testing", percent: 70 },
      { label: "Wireframing & prototyping", percent: 76 },
      { label: "Visual design", percent: 82 },
      { label: "Interaction design", percent: 88 },
      { label: "Design systems", percent: 94 },
    ],
  },
  {
    title: "Technical skills",
    tone: 2,
    items: [
      { label: "Figma", percent: 90 },
      { label: "Clip Studio", percent: 85 },
      { label: "Blender", percent: 80 },
      { label: "Adobe Suite", percent: 70 },
    ],
  },
  {
    title: "Toolbox highlights",
    tone: 3,
    items: [
      { label: "Design tokens", percent: 70 },
      { label: "Component libraries", percent: 76 },
      { label: "Framer Motion", percent: 82 },
      { label: "Usability testing", percent: 88 },
      { label: "WCAG checks", percent: 94 },
    ],
  },
];
