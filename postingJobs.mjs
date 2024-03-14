import fs from "fs/promises";
import path from "path";
import { client } from "./index.js"; // Make sure this import matches your setup

const DATA_FILE_PATH = path.join(__dirname, "data.json");
const CHANNEL_ID = "1165931354127609876"; // Replace with your actual channel ID
const POST_DELAY_MS = 1000; // Delay between posts, 1000 milliseconds = 1 second

async function postJobsToDiscord() {
  const channel = await client.channels.fetch(CHANNEL_ID);
  const data = JSON.parse(
    await fs.readFile(DATA_FILE_PATH, { encoding: "utf8" })
  );

  for (const job of data) {
    if (!job.posted) {
      await channel.send(`${job.title}\n${job.link}`);
      job.posted = true; // Mark as posted

      // Wait for a bit before posting the next job
      await new Promise((resolve) => setTimeout(resolve, POST_DELAY_MS));
    }
  }

  // Save the updated data back to the file
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), {
    encoding: "utf8",
  });
}

export { postJobsToDiscord };
