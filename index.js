import { Client, Events, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import { fetchFrontEndJobs } from "./scrapeJobs.mjs"; // Make sure this is correctly imported

config(); // Loads the .env file

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Listen for interactions
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "jobs") {
    await interaction.deferReply();
    const jobs = await fetchFrontEndJobs();
    const response = jobs
      .map((job) => `${job.title}\n${job.link}`)
      .join("\n\n");
    if (response.length > 0) {
      await interaction.editReply(`Here are the jobs:\n${response}`);
    } else {
      await interaction.editReply("No jobs found at the moment.");
    }
  } else if (commandName === "pingling") {
    // Add this else-if block
    await interaction.reply("Pong!");
  }
});

client.login(process.env.DISCORD_TOKEN);
