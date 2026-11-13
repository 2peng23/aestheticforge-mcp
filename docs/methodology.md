# Evidence and interpretation

## Responsive testing

The standard width matrix is 320, 375, 390, 430, 600, 768, 900, 1024, 1280, 1440 and 1920 CSS pixels. Intermediate widths improve coverage between common breakpoints. Each page uses a fresh Chromium context, DPR1, UTC, en-US, light color scheme and network-idle navigation. `waitMs` can add a bounded settle period. Dynamic applications that continuously request resources can time out at network idle; use stable demo data and review readiness.

Geometry compares actual bounding boxes against the viewport, reports overflowing elements, inspects 24px minimum control dimensions and identifies candidate intersecting control rectangles. WCAG target spacing/exceptions are not evaluated. Intentional overlaps, hidden offscreen menus and nested layout effects need visual judgment. The overlap pass considers at most 500 controls; the DOM scan considers at most 3000 visible elements. Selectors are supplied when the element has an ID; other elements include a diagnostic index and tag. A layout passing sampled widths is not proven correct at every width.

`audit_user_flow`, `validate_interaction` and `validate_page_states` execute explicit `click`, `fill`, `press`, `scroll`, `wait`, `expect-visible`, `expect-text` and `expect-count` actions. Values for count assertions are strings. Actions can change the app, so use a nonproduction demonstration environment. They do not invent user journeys or infer whether backend business rules are correct.

## Accessibility and UX

Axe-core runs WCAG2 A/AA, WCAG2.1 AA and WCAG2.2 AA tagged rules. Its incomplete results are retained. Tab testing captures actual focus order and computed outlines; it cannot independently prove focus contrast or a complete keyboard task. Headings, forms, live regions, dialogs and landmarks are factual inventories. These inventories do not establish clarity, cognitive load or feedback correctness.

Manual review must cover screen readers, meaningful names/content, zoom/reflow, recovery paths, mobile keyboards, touch target exceptions and applicable criteria that automation cannot decide. Reports never claim full WCAG conformance, beauty, conversion uplift or user research.

## Design and implementation

The AI client supplies a product brief, audience, task, content, selected direction and rationale. Direction compilation turns those facts into a structured reviewable specification. Component contracts and interaction graphs validate supplied states and dependencies; they are not LLM generations or working components until implemented. Actual `implement_*` / `refactor_component` tools apply supplied source safely; they do not replace business behavior with sample UI. Framework support means discovery and source preservation, not a bundled compiler for every framework.

## Performance and screenshots

Navigation, resource and paint entries come from actual browser Performance APIs. Buffered observers collect layout shifts, long tasks and LCP entries available during the sampled navigation. This is single-run lab evidence, not field Core Web Vitals. A layout shift observed after the sample window can be missed. `audit_animation_performance` exposes actual animation timing/keyframes; it does not claim a measured frame rate or GPU attribution.

Lighthouse is optional. Install a Node-compatible release yourself (`npm install --no-save --package-lock=false lighthouse@13.6.0` with Node22.19+ running the MCP server), set `CHROME_PATH` through `AESTHETICFORGE_BROWSER_PATH`, authorize its external resource loading, and invoke `run_lighthouse_audit`. It returns actual JSON and scores if installed. The default acceptance demonstration does not run Lighthouse. A separate local probe exercised Lighthouse13.6.0 using Node25 and saved its actual JSON report.

Pixelmatch comparisons require equal PNG dimensions, report changed pixel counts/ratios and optionally save a diff. Fonts, rendering engines and time-dependent content can produce changes unrelated to regressions. A change count cannot determine which version is better. All final subjective visual assessments belong to the human or AI client reviewing screenshots.

## Troubleshooting

- No authorized root: pass an existing absolute `--root` directory. A new artifact directory must be created before authorizing it.
- Browser missing: run `npx playwright install chromium`, or set `AESTHETICFORGE_BROWSER_PATH` to a supported Chrome executable.
- Cross-origin images/fonts absent: explicitly authorize only necessary exact resource origins with `--origin`, or serve assets locally.
- Write rejected: inspect the actual file with `inspect_component_api`, preserve its `hash` as `expectedHash`, and retry the controlled write. A concurrent editor change requires reinspection.
- Screenshot/report exists: artifacts use no-clobber writes. Choose a fresh output path.
- Dynamic routes missing: static discovery is heuristic. Supply explicit URLs and user-flow steps to browser tools.
- Slow audits: increase the MCP client's tool timeout; a width matrix performs multiple fresh navigations.
