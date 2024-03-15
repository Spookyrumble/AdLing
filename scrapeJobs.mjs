import axios from "axios";
import cheerio from "cheerio";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function fetchFrontEndJobs() {
  const url = process.env.DATA_TARGET;
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const jobs = [];

  $("article.sf-search-ad").each((_, element) => {
    const jobLinkElement = $(element).find("h2 a.sf-search-ad-link");
    const title = jobLinkElement.text().trim();
    const link = jobLinkElement.attr("href");
    const currentDate = new Date().toISOString().split("T")[0];
    jobs.push({ title, link, date: currentDate, posted: false });
  });

  const filePath = path.join(__dirname, "data.json");

  try {
    let existingJobs = [];
    try {
      const data = await fs.readFile(filePath, { encoding: "utf8" });
      existingJobs = JSON.parse(data);
    } catch (err) {
      console.log("No existing data file found. A new one will be created.");
    }

    const existingLinks = new Set(existingJobs.map((job) => job.link));

    const uniqueJobs = jobs.filter((job) => !existingLinks.has(job.link));

    const updatedJobs = existingJobs.concat(uniqueJobs);

    await fs.writeFile(filePath, JSON.stringify(updatedJobs, null, 2), {
      encoding: "utf8",
    });
    console.log(uniqueJobs.length + " new job(s) have been added to data.json");
  } catch (err) {
    console.error("Error handling the file:", err);
  }

  return jobs;
}

export { fetchFrontEndJobs };
