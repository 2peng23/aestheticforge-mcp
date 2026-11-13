import { z } from "zod";
export const briefSchema = z.object({
  product: z.string().min(1).max(160),
  audience: z.string().min(1).max(500),
  primaryTask: z.string().min(1).max(500),
  personality: z.array(z.string().max(80)).min(1).max(6),
  constraints: z.array(z.string().max(500)).max(20).default([]),
  content: z.array(z.string().max(500)).min(1).max(30),
  direction: z.enum([
    "premium-saas",
    "luxury-editorial",
    "minimalist",
    "swiss",
    "enterprise",
    "creative-agency",
    "playful",
    "futuristic",
    "gaming",
    "dark",
    "ecommerce",
    "mobile-dashboard",
  ]),
  rationale: z.string().min(20).max(2000),
});
export type Brief = z.infer<typeof briefSchema>;
const directions: Record<
  Brief["direction"],
  { typography: string; composition: string; motion: string }
> = {
  "premium-saas": {
    typography: "Restrained sans serif with clear data hierarchy",
    composition: "Task-focused product views, moderate density",
    motion: "Short state transitions and product continuity",
  },
  "luxury-editorial": {
    typography: "Editorial serif display with quiet supporting type",
    composition: "Generous margins, strong imagery, paced reading",
    motion: "Measured reveals that preserve readable holds",
  },
  minimalist: {
    typography: "Few sizes, clear weight hierarchy",
    composition: "Content-led structure with deliberate negative space",
    motion: "Only state and hierarchy cues",
  },
  swiss: {
    typography: "Strong grotesk hierarchy, disciplined alignment",
    composition: "Grid, asymmetry justified by content",
    motion: "Precise directional movement",
  },
  enterprise: {
    typography: "Readable compact hierarchy for complex tasks",
    composition: "Stable navigation and clear form/data grouping",
    motion: "Immediate feedback, minimal disruption",
  },
  "creative-agency": {
    typography: "Expressive headings grounded in real work",
    composition: "Project-led sequencing with varied scale",
    motion: "Signature transitions limited to key moments",
  },
  playful: {
    typography: "Warm readable type with measured expression",
    composition: "Clear tasks with approachable character",
    motion: "Responsive tactile feedback without delay",
  },
  futuristic: {
    typography: "Technical hierarchy with readable body copy",
    composition: "Product mechanics and information clarity",
    motion: "Systematic spatial continuity",
  },
  gaming: {
    typography: "High-impact display, readable utility text",
    composition: "Strong focal moments and clear navigation",
    motion: "Energetic transitions respecting reduced motion",
  },
  dark: {
    typography: "Balanced weights with sufficient contrast",
    composition: "Layer hierarchy through restrained luminance",
    motion: "Subtle surface and focus transitions",
  },
  ecommerce: {
    typography: "Product names, prices and policies prioritized",
    composition: "Product imagery and comparison tasks",
    motion: "Selection and cart feedback",
  },
  "mobile-dashboard": {
    typography: "Legible data labels at narrow widths",
    composition: "Task priority and progressive disclosure",
    motion: "Navigation continuity and state feedback",
  },
};
export function compileDirection(brief: Brief) {
  return {
    kind: "client-directed-specification",
    brief,
    direction: directions[brief.direction],
    requirements: {
      content: brief.content,
      primaryTask: brief.primaryTask,
      preserveExistingBehavior: true,
      target: "WCAG 2.2 AA; manual review required",
      responsive: [320, 375, 390, 430, 600, 768, 900, 1024, 1280, 1440, 1920],
      reducedMotion: true,
    },
    reviewRequired: [
      "Validate art direction against actual brand and rendered content.",
      "Subjective beauty and usability require AI-client or human review.",
    ],
    evidence:
      "Product facts and direction supplied by client; server compiles enforceable requirements.",
  };
}
export const tokenSchema = z.object({
  colors: z.record(
    z.string().regex(/^[a-z][a-z0-9-]*$/),
    z.string().regex(/^#[0-9a-fA-F]{6}$/),
  ),
  spacing: z.record(
    z.string().regex(/^[a-z][a-z0-9-]*$/),
    z.number().min(0).max(256),
  ),
  typography: z.record(
    z.string().regex(/^[a-z][a-z0-9-]*$/),
    z.string().max(150),
  ),
  radii: z.record(
    z.string().regex(/^[a-z][a-z0-9-]*$/),
    z.number().min(0).max(100),
  ),
  motion: z.object({
    fast: z.number().min(0).max(1000),
    normal: z.number().min(0).max(2000),
    easing: z.string().max(100),
  }),
  darkColors: z
    .record(
      z.string().regex(/^[a-z][a-z0-9-]*$/),
      z.string().regex(/^#[0-9a-fA-F]{6}$/),
    )
    .optional(),
});
export function compileTokens(tokens: z.infer<typeof tokenSchema>) {
  const declarations = [
    ...Object.entries(tokens.colors).map(
      ([name, value]) => `  --color-${name}: ${value};`,
    ),
    ...Object.entries(tokens.spacing).map(
      ([name, value]) => `  --space-${name}: ${value}px;`,
    ),
    ...Object.entries(tokens.typography).map(
      ([name, value]) => `  --type-${name}: ${value.replace(/[{};]/g, "")};`,
    ),
    ...Object.entries(tokens.radii).map(
      ([name, value]) => `  --radius-${name}: ${value}px;`,
    ),
    `  --motion-fast: ${tokens.motion.fast}ms;`,
    `  --motion-normal: ${tokens.motion.normal}ms;`,
    `  --motion-easing: ${tokens.motion.easing.replace(/[{};]/g, "")};`,
  ];
  return `:root {\n${declarations.join("\n")}\n}\n${
    tokens.darkColors
      ? `@media (prefers-color-scheme: dark) { :root {\n${Object.entries(
          tokens.darkColors,
        )
          .map(([name, value]) => `  --color-${name}: ${value};`)
          .join("\n")}\n} }\n`
      : ""
  }@media (prefers-reduced-motion: reduce) { :root { --motion-fast: 0ms; --motion-normal: 0ms; } }\n`;
}
export function contrast(foreground: string, background: string) {
  const luminance = (color: string) => {
    const channels = color
      .match(/[0-9a-f]{2}/gi)!
      .map((value) => parseInt(value, 16) / 255)
      .map((value) =>
        value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
      );
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  };
  const first = luminance(foreground),
    second = luminance(background);
  const ratio =
    (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
  return {
    foreground,
    background,
    ratio,
    normalTextAA: ratio >= 4.5,
    largeTextAA: ratio >= 3,
    nonTextAA: ratio >= 3,
    note: "Applies to opaque solid sRGB colors; image/transparency context requires rendered review.",
  };
}
