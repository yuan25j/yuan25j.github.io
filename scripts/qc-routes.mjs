import { chromium } from "playwright-core";
import { existsSync } from "node:fs";

const base = process.env.QC_BASE_URL ?? "http://127.0.0.1:4321";
const chromeCandidates = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
].filter(Boolean);

const executablePath = chromeCandidates.find((path) => existsSync(path));
if (!executablePath) {
  console.error("No Chrome/Edge executable found for QC.");
  process.exit(1);
}

const routes = ["/", "/about/", "/work/", "/projects/", "/resume/", "/work/wells-fargo-software-engineer/", "/projects/unc-course-scheduler/", "/missing-page/"];
const failures = [];

const browser = await chromium.launch({ headless: true, executablePath });

async function themeOf(page) {
  return page.evaluate(() => document.documentElement.dataset.theme);
}

async function setTheme(page, theme) {
  await page.evaluate((next) => {
    localStorage.setItem("theme", next);
    document.documentElement.dataset.theme = next;
  }, theme);
}

for (const theme of ["dark", "light"]) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await setTheme(page, theme);
  await page.reload({ waitUntil: "networkidle" });
  const start = await themeOf(page);
  if (start !== theme) failures.push(`home reload did not keep ${theme} (got ${start})`);

  for (const name of ["About", "Work", "Projects", "Résumé"]) {
    await page.getByRole("link", { name, exact: true }).first().click();
    await page.waitForTimeout(400);
    const current = await themeOf(page);
    if (current !== theme) failures.push(`nav to ${name} dropped ${theme} (got ${current})`);
  }

  await page.goto(`${base}/projects/unc-course-scheduler/`, { waitUntil: "networkidle" });
  const caseTheme = await themeOf(page);
  if (caseTheme !== theme) failures.push(`case study direct load dropped ${theme} (got ${caseTheme})`);
  await page.close();
}

for (const theme of ["dark", "light"]) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  for (const route of routes) {
    await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
    await setTheme(page, theme);
    await page.reload({ waitUntil: "networkidle" });
    const current = await themeOf(page);
    if (current !== theme) failures.push(`direct ${route} did not keep ${theme} (got ${current})`);
  }
  await page.close();
}

const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await desktop.goto(`${base}/about/`, { waitUntil: "networkidle" });
if (await desktop.locator(".menu-toggle").isVisible()) failures.push("mobile menu toggle is visible at 1440px");
await desktop.close();

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(`${base}/about/`, { waitUntil: "networkidle" });
await setTheme(mobile, "dark");
await mobile.reload({ waitUntil: "networkidle" });
const menu = mobile.locator(".menu-toggle");
if (!(await menu.isVisible())) failures.push("mobile menu toggle is not visible at 390px");
await menu.click();
const aboutLink = mobile.locator("#mobile-nav a", { hasText: "Work" });
if (!(await aboutLink.isVisible())) failures.push("mobile nav did not open");
await aboutLink.click();
await mobile.waitForURL("**/work/");
if ((await themeOf(mobile)) !== "dark") failures.push("mobile nav dropped dark theme");
const overflow = await mobile.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  clientWidth: document.documentElement.clientWidth,
}));
if (overflow.scrollWidth > overflow.clientWidth + 1) {
  failures.push(`mobile work page overflow ${overflow.scrollWidth} > ${overflow.clientWidth}`);
}

await mobile.emulateMedia({ reducedMotion: "reduce" });
await mobile.goto(`${base}/about/`, { waitUntil: "networkidle" });
const hiddenReveals = await mobile.locator("[data-reveal]").evaluateAll((elements) =>
  elements.filter((element) => getComputedStyle(element).opacity === "0").length,
);
if (hiddenReveals > 0) failures.push(`${hiddenReveals} reveals stuck hidden with reduced motion`);

const favicon = await mobile.evaluate(() => document.querySelector("link[rel='icon']")?.getAttribute("href") ?? "");
if (favicon.includes("d8ff62")) failures.push("favicon still uses leftover lime green");

await mobile.close();

const interact = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  permissions: ["clipboard-read", "clipboard-write"],
});
const page = await interact.newPage();
await page.goto(`${base}/`, { waitUntil: "networkidle" });
await page.keyboard.press("Escape");

const emailMe = page.locator(".hero [data-copy-email]");
await emailMe.click();
await page.waitForFunction((el) => el?.textContent?.trim() === "Copied", await emailMe.elementHandle());

const contactEmail = page.locator(".contact-card [data-copy-email]");
await contactEmail.scrollIntoViewIfNeeded();
await contactEmail.click();
await page.waitForFunction((el) => el?.textContent?.trim() === "Copied", await contactEmail.elementHandle());

await page.getByRole("link", { name: /View experience/ }).click();
await page.waitForURL("**/work/");
if (!page.url().includes("/work/")) failures.push("View experience did not navigate to /work/");

await page.goto(`${base}/`, { waitUntil: "networkidle" });
const beforeTheme = await themeOf(page);
await page.locator(".theme-toggle").click();
const afterTheme = await themeOf(page);
if (afterTheme === beforeTheme) failures.push("theme toggle did not change data-theme");

const github = page.locator(".footer-links a[href*='github.com']");
const linkedin = page.locator(".footer-links a[href*='linkedin.com']");
if ((await github.getAttribute("target")) !== "_blank") failures.push("footer GitHub is not target=_blank");
if ((await linkedin.getAttribute("target")) !== "_blank") failures.push("footer LinkedIn is not target=_blank");

await interact.close();
await browser.close();

if (failures.length) {
  console.error(JSON.stringify({ ok: false, failures }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, theme: "persisted", routes: routes.length }, null, 2));
