// yourScrapingScript.js
import axios from "axios";
import cheerio from "cheerio";

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

    jobs.push({ title, link });
  });

  return jobs;
}

export { fetchFrontEndJobs };
