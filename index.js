require("dotenv").config();

const { Client, GatewayIntentBits, PermissionsBitField } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.once("ready", () => {
  console.log(`Trap ban bot is online as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  try {
    if (!message.guild) return;
    if (message.author.bot) return;
    if (message.channel.id !== process.env.TRAP_CHANNEL_ID) return;

    const member = await message.guild.members.fetch(message.author.id);

    if (message.guild.ownerId === message.author.id) return;
    if (process.env.STAFF_ROLE_ID && member.roles.cache.has(process.env.STAFF_ROLE_ID)) return;
    if (member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

    await message.delete().catch(() => null);

    await message.guild.members.ban(message.author.id, {
      reason: `Posted in protected trap channel: #${message.channel.name}`,
      deleteMessageSeconds: 3600
    });

    console.log(`Banned ${message.author.tag}`);
  } catch (error) {
    console.error("Error:", error);
  }
});

client.login(process.env.DISCORD_TOKEN);
