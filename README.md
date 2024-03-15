# AdLing Discord Bot

AdLing is a Discord bot designed to automatically scrape open job listings from [finn.no](https://finn.no) and share them within a designated Discord channel. This bot aims to assist development communities in staying up-to-date with the latest job opportunities, facilitating easier access to potential employment options. It is set up to scrape twice per day and post new listings

## Features

- **Automated Scraping**: Periodically scrapes development job listings from finn.no.
- **Scheduled Posting**: Posts new job listings to a specified Discord channel every day at 9 AM.
- **Custom Commands**: Includes a `/jobs` command for manual triggering of job postings.
- **Respectful of Discord's Limits**: Implements delay and pagination to stay within Discord's rate limits and message length constraints.

## Setup

### Prerequisites

- Node.js (v14 or higher recommended)
- A Discord Bot Token (See [Discord's developer portal](https://discord.com/developers/applications) to create a bot and obtain a token)
- A designated Discord Channel ID where job listings will be posted

### Installation

1. Clone this repository or download the source code.

   - Use the command:
     `git clone https://github.com/Spookyrumble/AdLing`

2. Navigate to the project directory and install dependencies:

   - Run the command:
     `npm install`

3. Rename `.env.example` to `.env` and fill in your Discord Bot Token and the target channel ID with your own values:

   - DISCORD_TOKEN=your_discord_bot_token
   - CLIENT_ID=your_discord_bot_ID
   - GUILD_ID=your_discord_server_ID
   - CHANNEL_ID=your_discord_channel_ID

4. Adjust the scraping target or intervals as needed in the source code.

## Running the Bot

To register `/` commands, execute the following in your terminal:

- Command:
  `node deploy-commands.js`

To start the bot, use:

- Command:
  `node index.js`

To clean data.json, use:

- Command:
  `node dataCleaner.mjs`

Ensure your bot is added to your Discord server and has permission to read messages and send messages in the target channel.

## Usage

- **Automated Job Postings**: The bot will automatically post new job listings at 9 AM every day as long as the index script is running. The scrape will happen every 12 hours.
- **Manual Trigger**: Use the `/jobs` command in your Discord server to manually trigger the posting of the latest scraped job listings

## Contributing

Contributions to AdLing are welcome! Whether it's feature requests, bug reports, or code contributions, please feel free to make an issue or pull request on the project's GitHub page.
