import { chromium, type Page } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";
import { Workspace, redact } from "../security/workspace.js";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { promises as filesystem } from "node:fs";
export type BrowserOptions = {
  url: string;
  width?: number;
  height?: number;
  waitMs?: number;
  reducedMotion?: boolean;
};
export type Action = {
  type:
    | "click"
    | "fill"
    | "press"
    | "scroll"
    | "wait"
    | "expect-visible"
    | "expect-text"
    | "expect-count";
  selector?: string;
  value?: string;
  x?: number;
  y?: number;
  milliseconds?: number;
};
export class BrowserService {
  private active = 0;
  private browsers = new Set<Awaited<ReturnType<typeof chromium.launch>>>();
  async close() {
    await Promise.all([...this.browsers].map((browser) => browser.close()));
    this.browsers.clear();
  }
  constructor(
    private workspace: Workspace,
    private origins: string[] = [],
    private executablePath?: string,
  ) {}
  validateURL(input: string) {
    const url = new URL(input);
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password
    )
      throw new Error("Only HTTP(S) URLs without credentials are accepted.");
    if (
      !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) &&
      !this.origins.includes(url.origin)
    )
      throw new Error(
        "Remote URLs require an exact --origin authorization at startup.",
      );
    return url;
  }
  async page<T>(
    options: BrowserOptions,
    operation: (page: Page) => Promise<T>,
  ): Promise<T> {
    this.validateURL(options.url);
    if (this.active >= 2) throw new Error("Browser concurrency limit reached.");
    this.active++;
    let browser;
    try {
      browser = await chromium.launch({
        headless: true,
        executablePath: this.executablePath,
      });
      this.browsers.add(browser);
      const context = await browser.newContext({
        viewport: {
          width: options.width ?? 1440,
          height: options.height ?? 900,
        },
        deviceScaleFactor: 1,
        locale: "en-US",
        timezoneId: "UTC",
        colorScheme: "light",
        reducedMotion: options.reducedMotion ? "reduce" : "no-preference",
        serviceWorkers: "block",
        acceptDownloads: false,
      });
      const approvedOrigins = new Set([
        new URL(options.url).origin,
        ...this.origins,
      ]);
      await context.route("**/*", (route) => {
        try {
          const resourceURL = this.validateURL(route.request().url());
          if (!approvedOrigins.has(resourceURL.origin))
            throw new Error("Cross-origin resource blocked.");
          return route.continue();
        } catch {
          return route.abort();
        }
      });
      await context.routeWebSocket("**/*", (socket) => socket.close());
      await context.addInitScript(() => {
        const observed = {
          layoutShifts: [] as unknown[],
          longTasks: [] as unknown[],
          largestContentfulPaint: [] as unknown[],
        };
        (window as any).__aestheticforgePerformance = observed;
        for (const [type, key] of [
          ["layout-shift", "layoutShifts"],
          ["longtask", "longTasks"],
          ["largest-contentful-paint", "largestContentfulPaint"],
        ] as const) {
          try {
            new PerformanceObserver((list) => {
              (observed[key] as unknown[]).push(
                ...list
                  .getEntries()
                  .slice(0, 100)
                  .map((entry) => entry.toJSON()),
              );
            }).observe({ type, buffered: true });
          } catch {}
        }
      });
      const page = await context.newPage();
      page.setDefaultTimeout(10_000);
      await page.goto(options.url, {
        waitUntil: "networkidle",
        timeout: 25_000,
      });
      await page.evaluate(() => document.fonts.ready);
      if (options.waitMs)
        await page.waitForTimeout(Math.min(options.waitMs, 5000));
      await page.addStyleTag({
        content:
          "input[type=password],input[autocomplete*=cc-],[data-private],[data-sensitive]{visibility:hidden!important} *{caret-color:transparent!important}",
      });
      return await operation(page);
    } catch (error) {
      throw new Error(
        redact(error instanceof Error ? error.message : String(error)),
      );
    } finally {
      if (browser) {
        this.browsers.delete(browser);
        await browser.close();
      }
      this.active--;
    }
  }
  async screenshot(options: BrowserOptions, output: string, fullPage = false) {
    const target = await this.workspace.resolve(output, true);
    return this.page(options, async (page) => {
      const dimensions = await page.evaluate(() => ({
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
      }));
      if (
        fullPage &&
        (dimensions.height > 16000 ||
          dimensions.width > 7680 ||
          dimensions.width * dimensions.height > 16_000_000)
      )
        throw new Error(
          "Full-page capture limited to 16 megapixels, 7680px width and 16000px height.",
        );
      const pixels = await page.screenshot({
        fullPage,
        animations: "disabled",
        mask: [
          page.locator(
            "input,textarea,select,[contenteditable],[data-private],[data-sensitive],iframe,frame",
          ),
        ],
        maskColor: "#64748b",
      });
      await this.workspace.artifact(target, pixels);
      return {
        path: target,
        width: options.width ?? 1440,
        height: options.height ?? 900,
        fullPage,
        privacy:
          "All input values and explicitly marked private elements masked; operator must use synthetic data.",
      };
    });
  }
  async geometry(options: BrowserOptions) {
    return this.page(options, async (page) =>
      page.evaluate(() => {
        const visible = (element: Element) => {
          const style = getComputedStyle(element);
          const rectangle = element.getBoundingClientRect();
          return (
            style.visibility !== "hidden" &&
            style.display !== "none" &&
            rectangle.width > 0 &&
            rectangle.height > 0
          );
        };
        const describe = (element: Element, index: number) => ({
          selector: element.id ? "#" + CSS.escape(element.id) : null,
          elementIndex: index,
          tag: element.tagName.toLowerCase(),
          role: element.getAttribute("role"),
          rectangle: JSON.parse(
            JSON.stringify(element.getBoundingClientRect()),
          ),
        });
        const elements = [...document.querySelectorAll("body *")]
          .filter(visible)
          .slice(0, 3000);
        const overflow = elements
          .map(describe)
          .filter(
            (element) =>
              element.rectangle.right > innerWidth + 1 ||
              element.rectangle.left < -1,
          );
        const controls = elements
          .filter((element) =>
            element.matches(
              "button,a[href],input:not([type=hidden]),select,textarea,[role=button]",
            ),
          )
          .slice(0, 500);
        const touchTargets = controls
          .map(describe)
          .filter(
            (element) =>
              element.rectangle.width < 24 || element.rectangle.height < 24,
          );
        const forms = [...document.forms].map((form) => ({
          action: form.getAttribute("action"),
          controls: [...form.elements]
            .filter(
              (element) =>
                element instanceof HTMLInputElement ||
                element instanceof HTMLSelectElement ||
                element instanceof HTMLTextAreaElement,
            )
            .map((element) => ({
              tag: element.tagName,
              type: element.getAttribute("type"),
              name: element.getAttribute("name"),
              labelled:
                !!element.getAttribute("aria-label") ||
                !!element.getAttribute("aria-labelledby") ||
                !!(element as HTMLInputElement).labels?.length,
              required: element.hasAttribute("required"),
            })),
        }));
        const headings = [
          ...document.querySelectorAll("h1,h2,h3,h4,h5,h6"),
        ].map((element) => ({
          level: Number(element.tagName[1]),
          text: element.textContent?.trim().slice(0, 140),
        }));
        const navigation = [
          ...document.querySelectorAll("nav,[role=navigation]"),
        ].map((element) => ({
          label: element.getAttribute("aria-label"),
          links: [...element.querySelectorAll("a")].map((link) => ({
            text: link.textContent?.trim().slice(0, 80),
            href: link.getAttribute("href"),
          })),
        }));
        const overlaps: any[] = [];
        for (let firstIndex = 0; firstIndex < controls.length; firstIndex++) {
          for (
            let secondIndex = firstIndex + 1;
            secondIndex < controls.length && overlaps.length < 100;
            secondIndex++
          ) {
            const first = controls[firstIndex],
              second = controls[secondIndex];
            if (first.contains(second) || second.contains(first)) continue;
            const firstRect = first.getBoundingClientRect(),
              secondRect = second.getBoundingClientRect();
            if (
              Math.min(firstRect.right, secondRect.right) -
                Math.max(firstRect.left, secondRect.left) >
                2 &&
              Math.min(firstRect.bottom, secondRect.bottom) -
                Math.max(firstRect.top, secondRect.top) >
                2
            )
              overlaps.push({
                first: describe(first, firstIndex),
                second: describe(second, secondIndex),
                classification: "candidate-overlap",
              });
          }
        }
        const animations = document
          .getAnimations()
          .slice(0, 100)
          .map((animation) => ({
            playState: animation.playState,
            timing: animation.effect?.getTiming(),
            keyframes:
              animation.effect instanceof KeyframeEffect
                ? animation.effect.getKeyframes()
                : [],
          }));
        return {
          viewport: { width: innerWidth, height: innerHeight },
          document: {
            width: document.documentElement.scrollWidth,
            height: document.documentElement.scrollHeight,
          },
          overflow,
          touchTargets,
          forms,
          headings,
          navigation,
          overlaps,
          animations,
          landmarks: {
            main: document.querySelectorAll("main,[role=main]").length,
            header: document.querySelectorAll("header").length,
          },
          states: {
            dialogs: document.querySelectorAll("dialog,[role=dialog]").length,
            liveRegions: document.querySelectorAll(
              "[aria-live],[role=status],[role=alert]",
            ).length,
            busy: document.querySelectorAll("[aria-busy=true]").length,
          },
          limits:
            "Geometry is heuristic; intentional overlaps and exceptions require visual review.",
        };
      }),
    );
  }
  async accessibility(options: BrowserOptions) {
    return this.page(options, async (page) => {
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      return {
        url: options.url,
        violations: results.violations,
        incomplete: results.incomplete,
        passes: results.passes.map((result) => ({
          id: result.id,
          description: result.description,
        })),
        manualRequired: [
          "Screen reader reading order",
          "Meaningful content and accessible names",
          "Keyboard tasks and recovery",
          "Zoom/reflow and mobile assistive technology",
        ],
        conformanceClaim: false,
      };
    });
  }
  async keyboard(options: BrowserOptions, steps = 12) {
    return this.page(options, async (page) => {
      const focusOrder = [];
      for (let index = 0; index < steps; index++) {
        await page.keyboard.press("Tab");
        focusOrder.push(
          await page.evaluate(() => {
            const element = document.activeElement;
            if (!element) return null;
            const style = getComputedStyle(element);
            return {
              tag: element.tagName,
              id: element.id,
              role: element.getAttribute("role"),
              name:
                element.getAttribute("aria-label") ??
                element.textContent?.trim().slice(0, 80),
              outlineStyle: style.outlineStyle,
              outlineWidth: style.outlineWidth,
              boxShadow: style.boxShadow,
              focusVisible: element.matches(":focus-visible"),
            };
          }),
        );
      }
      return {
        focusOrder,
        limitation:
          "Computed outlines are evidence, not proof of visible focus contrast or a complete keyboard path.",
      };
    });
  }
  async flow(options: BrowserOptions, actions: Action[]) {
    if (actions.length > 30) throw new Error("At most 30 actions per flow.");
    return this.page(options, async (page) => {
      const results = [];
      for (const action of actions) {
        if (action.type === "wait") {
          await page.waitForTimeout(Math.min(action.milliseconds ?? 100, 2000));
        } else if (action.type === "scroll") {
          await page.mouse.wheel(action.x ?? 0, action.y ?? 400);
        } else {
          if (!action.selector) throw new Error("Selector required.");
          const locator = page.locator(action.selector);
          if (action.type === "expect-visible") {
            if (!(await locator.isVisible()))
              throw new Error("Expected element to be visible.");
          } else if (action.type === "expect-text") {
            if ((await locator.textContent())?.trim() !== action.value)
              throw new Error("Expected element text did not match.");
          } else if (action.type === "expect-count") {
            if ((await locator.count()) !== Number(action.value))
              throw new Error("Expected element count did not match.");
          } else if (action.type === "fill") {
            const sensitive = await locator.evaluate(
              (element) =>
                element.matches(
                  "input[type=password],input[type=email],input[type=tel],input[autocomplete*=cc-],input[autocomplete=email],input[autocomplete=tel],[data-private],[data-sensitive]",
                ) ||
                /password|token|secret|card|ssn/i.test(
                  element.getAttribute("name") ?? "",
                ),
            );
            if (sensitive)
              throw new Error("Sensitive field interaction is blocked.");
            await locator.fill(action.value ?? "");
          } else if (action.type === "click") {
            await locator.click();
          } else await locator.press(action.value ?? "Tab");
        }
        results.push({
          type: action.type,
          selector: action.selector,
          status: "completed",
          url: page.url(),
        });
      }
      return {
        steps: results,
        finalURL: page.url(),
        title: await page.title(),
      };
    });
  }
  async performance(options: BrowserOptions) {
    return this.page(options, async (page) =>
      page.evaluate(() => ({
        navigation: performance
          .getEntriesByType("navigation")
          .map((entry) => entry.toJSON()),
        resources: performance
          .getEntriesByType("resource")
          .map((entry) => entry.toJSON()),
        paint: performance
          .getEntriesByType("paint")
          .map((entry) => entry.toJSON()),
        observed: (window as any).__aestheticforgePerformance,
        note: "Single lab navigation; these are not field Core Web Vitals or a Lighthouse score.",
      })),
    );
  }
}
async function readPNG(workspace: Workspace, file: string) {
  const safe = await workspace.resolve(file);
  const stat = await filesystem.stat(safe);
  if (stat.size > 40_000_000) throw new Error("PNG inputs limited to 40 MB.");
  const bytes = await filesystem.readFile(safe);
  if (
    bytes.length < 24 ||
    bytes.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a"
  )
    throw new Error("Expected a PNG image.");
  const width = bytes.readUInt32BE(16),
    height = bytes.readUInt32BE(20);
  if (
    !width ||
    !height ||
    width > 16000 ||
    height > 16000 ||
    width * height > 16_000_000
  )
    throw new Error(
      "Decoded PNG limited to 16 megapixels and 16000px per edge.",
    );
  return PNG.sync.read(bytes);
}
export async function compareImages(
  workspace: Workspace,
  before: string,
  after: string,
  output?: string,
  threshold = 0.1,
) {
  const first = await readPNG(workspace, before);
  const second = await readPNG(workspace, after);
  if (first.width !== second.width || first.height !== second.height)
    return {
      sameDimensions: false,
      before: { width: first.width, height: first.height },
      after: { width: second.width, height: second.height },
      changedPixels: null,
    };
  const diff = new PNG({ width: first.width, height: first.height });
  const changedPixels = pixelmatch(
    first.data,
    second.data,
    diff.data,
    first.width,
    first.height,
    { threshold },
  );
  const artifact = output
    ? await workspace.artifact(output, PNG.sync.write(diff))
    : undefined;
  return {
    sameDimensions: true,
    changedPixels,
    totalPixels: first.width * first.height,
    changedRatio: changedPixels / (first.width * first.height),
    threshold,
    diff: artifact,
    note: "Pixel change is not a judgment of design quality.",
  };
}
