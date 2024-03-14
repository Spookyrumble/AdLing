import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE_PATH = path.join(__dirname, "data.json");

async function cleanData() {
  try {
    const data = JSON.parse(
      await fs.readFile(DATA_FILE_PATH, { encoding: "utf8" })
    );
    const currentDate = new Date();

    // Filter out jobs older than 30 days
    const filteredData = data.filter((job) => {
      const jobDate = new Date(job.date);
      const ageInDays = (currentDate - jobDate) / (1000 * 60 * 60 * 24); // Convert milliseconds to days
      return ageInDays <= 30;
    });

    // Write the filtered list back to data.json
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(filteredData, null, 2), {
      encoding: "utf8",
    });
    console.log(`Cleaned data. Removed objects older than 30 days.`);
  } catch (err) {
    console.error("Error cleaning data:", err);
  }
}

cleanData();
