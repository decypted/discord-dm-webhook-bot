# Discord Bot with Webhook Integration

A Discord bot that forwards direct messages to a webhook endpoint and displays responses using Discord's Components v2. Perfect for integrating Discord with AI agents, n8n workflows, or any webhook-based service.

## Features

- **User Authorization**: Only authorized users can interact with the bot
- **DM Processing**: Processes direct messages only (no server messages)
- **Webhook Integration**: Forwards messages to your webhook endpoint
- **Modern UI**: Uses Discord Components v2 for message displays
- **Real-time Updates**: Shows "Processing..." message that updates with the response
- **Error Handling**: Graceful error handling with fallback messages in the console.

## Prerequisites

- Node.js 16.9.0 or higher
- A Discord bot token
- A webhook endpoint (n8n, Zapier, custom API, etc.)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd discord-bot-webhook
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment File

Create a `.env` file in the root directory:

```env
TOKEN=your_discord_bot_token_here
```

### 4. Configure the Bot

Open `src/index-public.js` and update the configuration:

```javascript
// Replace with your Discord user ID(s)
const AUTHORIZED_USER_IDS = ['YOUR_USER_ID_HERE'];

// Replace with your webhook URL
const WEBHOOK_URL = 'YOUR_WEBHOOK_URL_HERE';
```

#### How to Get Your Discord User ID:
1. Enable Developer Mode in Discord (User Settings > Advanced > Developer Mode)
2. Right-click on your username and select "Copy ID"

#### How to Get Your Webhook URL:
- **n8n**: Create a webhook node and copy the URL
- **Zapier**: Create a webhook trigger and copy the URL
- **Custom API**: Your endpoint that accepts POST requests

### 5. Run the Bot

#### Development Mode (with auto-restart):
```bash
npm run dev
```

#### Production Mode:
```bash
npm start
```

## Usage

1. **Start the bot** using the commands above or ```npm start```
2. **DM the bot** from an authorized user account. If you don't know how here' a guide from discord: https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID
3. **Send a message** - the bot will show "Processing your request..."
4. **Wait for response** - the bot will update the message with the webhook response

## Webhook Payload Format

The bot sends the following JSON payload to your webhook:

```json
{
  "user": "username",
  "userId": "123456789",
  "content": "User's message",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "channelId": "123456789",
  "processingMessageId": "123456789"
}
```

## Response Handling

Your webhook should return a text response that will be displayed to the user. If the response is empty, the bot will show "No response received from the webhook."

## File tree structure

```
├── src/
│   ├── index.js          
│   
├── package.json
├── .env                  # Your bot token (you have create this manually)
└── README.md
```

## Configuration Options

### Multiple Authorized Users
```javascript
const AUTHORIZED_USER_IDS = ['USER_ID_1', 'USER_ID_2', 'USER_ID_3'];
```
This is perfect for if you have multiple accounts that you want to use.

### Different Webhook Endpoints
```javascript
const WEBHOOK_URL = 'https://your-domain.com/webhook/discord';
```

## Troubleshooting

### Bot Not Responding to DMs?
- Ensure the bot has the `DirectMessages` intent enabled
- Check that your user ID is in the `AUTHORIZED_USER_IDS` array
- Verify the bot is online and running. This will display on the console.

### Webhook Not Receiving Messages
- Check the `WEBHOOK_URL` is correct and accessible
- Ensure your webhook endpoint accepts **POST** requests
- Check the console for error logs.

### Components v2 Not Working
- Ensure you're using Discord.js v14.19 or higher
- The bot uses Components v2 which is a new thing that discord release instead of the old standard embed.

## Dependencies

- `discord.js` ^14.18.0 - Discord API wrapper
- `dotenv` ^16.5.0 - Environment variable management
- `node-fetch` ^3.3.2 - HTTP requests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Use Cases

- **AI Chat Integration**: Connect to ChatGPT, Claude, or other AI services
- **Workflow Automation**: Trigger n8n/make workflows from Discord instead of Slack lol
- **Notification System**: Send alerts and get responses or whatever
