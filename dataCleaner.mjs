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

    const filteredData = data.filter((job) => {
      const jobDate = new Date(job.date);
      const ageInDays = (currentDate - jobDate) / (1000 * 60 * 60 * 24);
      return ageInDays <= 30;
    });

    if (data.length === filteredData.length) {
      console.log("No items needed cleaning.");
    } else {
      await fs.writeFile(
        DATA_FILE_PATH,
        JSON.stringify(filteredData, null, 2),
        {
          encoding: "utf8",
        }
      );
      console.log(
        `Cleaned data. Removed ${
          data.length - filteredData.length
        } objects older than 30 days.`
      );
    }
  } catch (err) {
    console.error("Error cleaning data:", err);
  }
}

cleanData();
