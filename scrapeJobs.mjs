// yourScrapingScript.js
import axios from "axios";
import cheerio from "cheerio";
import fs from "fs/promises"; // Use the promise-based version of fs for async/await
import path from "path"; // For handling file paths
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function fetchFrontEndJobs() {
  const url =
    "https://www.finn.no/job/fulltime/search.html?location=0.20001&occupation=0.23";
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
      // Read the existing data.json file
      const data = await fs.readFile(filePath, { encoding: "utf8" });
      existingJobs = JSON.parse(data);
    } catch (err) {
      console.log("No existing data file found. A new one will be created.");
    }

    // Combine the existing jobs with the newly fetched jobs
    const updatedJobs = existingJobs.concat(jobs);

    // Write the combined list back to data.json
    await fs.writeFile(filePath, JSON.stringify(updatedJobs, null, 2), {
      encoding: "utf8",
    });
    console.log("Data has been written/updated in data.json");
  } catch (err) {
    console.error("Error handling the file:", err);
  }

  return jobs;
}

export { fetchFrontEndJobs };
