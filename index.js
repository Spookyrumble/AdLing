import { Client, Events, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import cron from "node-cron";
import { fetchFrontEndJobs } from "./scrapeJobs.mjs";
import { postJobsToDiscord } from "./postingJobs.mjs";
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
    "0 0,12 * * *",
    async () => {
      console.log("Running scheduled scraping...");
      await fetchFrontEndJobs(); // Scrape new jobs
    },
    {
      scheduled: true,
      timezone: "Europe/Oslo",
    }
  );

  cron.schedule(
    "0 9 * * *",
    async () => {
      console.log("Running scheduled job fetch and post...");

      await postJobsToDiscord();
    },
    {
      scheduled: true,
      timezone: "Europe/Oslo",
    }
  );
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "jobs") {
    await interaction.deferReply();

    try {
      // Trigger the scraping of new jobs
      await fetchFrontEndJobs();

      // And then trigger posting the jobs to Discord
      await postJobsToDiscord();

      // Let the user know the process is complete or in progress
      await interaction.editReply(
        "The job listings have been updated and posted."
      );
    } catch (error) {
      console.error("Error during fetch or post process: ", error);
      await interaction.editReply(
        "There was an error updating or posting the job listings. Please check the logs."
      );
    }
  }
});

client.login(process.env.DISCORD_TOKEN);

export { client };
