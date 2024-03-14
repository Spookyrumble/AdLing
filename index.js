import { Client, Events, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import cron from "node-cron";
import { fetchFrontEndJobs } from "./scrapeJobs.mjs";
import { postJobsToDiscord } from "./postJobs.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE_PATH = path.join(__dirname, "data.json");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user.tag}!`);

  cron.schedule(
    "0 9 * * *",
    async () => {
      console.log("Running scheduled job fetch and post...");
      await fetchFrontEndJobs();
      await postJobsToDiscord();
    },
    {
      scheduled: true,
      timezone: "Your/Timezone",
    }
  );
});

// Existing interaction handling code here...
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "jobs") {
    await interaction.deferReply();
    const data = JSON.parse(
      await fs.readFile(DATA_FILE_PATH, { encoding: "utf8" })
    );
    let jobsToPost = data.filter((job) => !job.posted).slice(0, 5);

    if (jobsToPost.length > 0) {
      for (const job of jobsToPost) {
        // For testing, consider not marking them as posted yet
        // job.posted = true;
        await client.channels
          .fetch(CHANNEL_ID)
          .then((channel) => channel.send(`${job.title}\n${job.link}`));
      }
      // Save the updated jobs back to the file if you're marking them as posted
      // await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), { encoding: "utf8" });
      await interaction.editReply("Posted 5 jobs.");
    } else {
      await interaction.editReply("No new jobs found to post.");
    }
  }
  // You can add more commands or event handlers here as needed
});

client.login(process.env.DISCORD_TOKEN);
