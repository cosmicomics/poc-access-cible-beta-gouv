import puppeteer from "puppeteer";
import axe from "axe-core";

export async function runAccessibilityAudit(
  url: string
): Promise<axe.AxeResults | null> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log(`🔍 Audit en cours pour : ${url}`);
    await page.goto(url, { waitUntil: "networkidle2" });

    // Injecte axe-core dans la page
    await page.addScriptTag({
      content: (await fetchAxeCore()).toString(),
    });

    // Exécute axe-core sur la page
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

// Fonction pour récupérer le contenu source d'axe-core
async function fetchAxeCore(): Promise<string> {
  return new Promise((resolve) => {
    resolve(require("axe-core").source);
  });
}
