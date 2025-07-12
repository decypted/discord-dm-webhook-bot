require('dotenv/config');
const { Client, GatewayIntentBits, Partials, 
  ContainerBuilder, TextDisplayBuilder, MessageFlags } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages, // Added for DM support
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel], // Required for DMs
});

client.on('ready', (client) => {
  console.log(`${client.user.username} is online.`);
});

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Configuration - Update these values for your use case
const AUTHORIZED_USER_IDS = ['YOUR_USER_ID_HERE']; // Add your Discord user ID(s)
const WEBHOOK_URL = 'YOUR_WEBHOOK_URL_HERE'; // Your n8n or other webhook endpoints.

client.on('messageCreate', async (message) => {
  // Ignore messages from bots
  if (message.author.bot) return;

  // Only process DMs
  if (message.guild) return;

  // Check if user is authorized
  if (!AUTHORIZED_USER_IDS.includes(message.author.id)) {
    const unauthorizedContainer = new ContainerBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent('**Sorry! You do not have authorized permission to use me.**')
      );
    
    await message.reply({
      components: [unauthorizedContainer],
      flags: [MessageFlags.IsComponentsV2],
    });
    return;
  }

  try {
    // 1. Send initial processing message as a v2 container
    const processingContainer = new ContainerBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent('⏳ **Processing your request…**')
      );

    const processingMsg = await message.reply({
      components: [processingContainer],
      flags: [MessageFlags.IsComponentsV2],
    });

    // 2. Forward to webhook with message details
    console.debug('Sending DM to webhook:', message.content);
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: message.author.username,
        userId: message.author.id,
        content: message.content,
        timestamp: message.createdAt,
        channelId: message.channel.id,
        processingMessageId: processingMsg.id,
      }),
    });
    const responseBody = await response.text();
    console.log('Webhook response:', response.status, responseBody);

    // 3. Edit the processing message with the webhook's response
    const resultContainer = new ContainerBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(responseBody || 'No response received from the webhook.')
      );

    await processingMsg.edit({
      components: [resultContainer],
      flags: [MessageFlags.IsComponentsV2],
    });

  } catch (err) {
    console.error('Failed to send webhook or edit message:', err);
  }
});

client.login(process.env.TOKEN); 