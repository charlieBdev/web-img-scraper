import puppeteer from "puppeteer";

export default async function scraper(req, res) {
  const { url } = req.query;

  try {
    const browser = await puppeteer.launch({headless: 'new'});
    const page = await browser.newPage();
    await page.goto(url);

    const imgInfo = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll("img"));
      const seenSrcs = new Set()
      const imgArr = []

      images.forEach(img => {
        const src = img.src
        if (
          // Number(img.width) > 100 &&
          !img.src.toLowerCase().endsWith('.gif') &&
          !img.src.toLowerCase().startsWith('data:image/gif') &&
          !seenSrcs.has(src)
        ) {
          imgArr.push({src: img.src, alt: img.alt, height: img.height, width: img.width})
          seenSrcs.add(src)
        }
      })

      return imgArr
    });

    const result = {
      imgInfo,
    };

    await browser.close();

    res.status(200).json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
}
