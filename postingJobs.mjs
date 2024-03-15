import fs from "fs/promises";
import path from "path";
import { client } from "./index.js";
import { fileURLToPath } from "url";
import { config } from "dotenv";
config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE_PATH = path.join(__dirname, "data.json");
const CHANNEL_ID = process.env.CHANNEL_ID;
const POST_DELAY_MS = 1000;

async function postJobsToDiscord() {
  const channel = await client.channels.fetch(CHANNEL_ID);
  const data = JSON.parse(
    await fs.readFile(DATA_FILE_PATH, { encoding: "utf8" })
  );

  const jobsToPost = data.filter((job) => !job.posted);

  if (jobsToPost.length === 0) {
    console.log("No new jobs to post.");
    return;
  }

  for (const job of jobsToPost) {
    await channel.send(`${job.link}`);
    job.posted = true; // Mark as posted
    await new Promise((resolve) => setTimeout(resolve, POST_DELAY_MS));
  }

  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), {
    encoding: "utf8",
  });
  console.log(`${jobsToPost.length} new job(s) have been posted.`);
}

export { postJobsToDiscord };
