import puppeteer from "puppeteer";
import axe from "axe-core";

export async function runAccessibilityAudit(
  url: string
): Promise<axe.AxeResults | null> {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    headless: true,
  });
  const page = await browser.newPage();

  try {
    console.log(`🔍 Audit en cours pour : ${url}`);
    await page.goto(url, { waitUntil: "networkidle2" });

    // Inject axe-core in the page
    await page.addScriptTag({
      content: (await fetchAxeCore()).toString(),
    });

    // Run axe-core in the page
    const results = await page.evaluate(async () => {
      return await (window as any).axe.run();
    });

    console.log(`✅ Audit terminé pour : ${url}`);
    return results;
  } catch (error) {
    console.error("Erreur lors de l'audit :", error);
    return null;
  } finally {
    await browser.close();
  }
}

// Retrieve the content source of axe-core
async function fetchAxeCore(): Promise<string> {
  return new Promise((resolve) => {
    resolve(require("axe-core").source);
  });
}
