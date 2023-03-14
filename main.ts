import * as discord from "https://deno.land/x/discordeno@18.0.1/mod.ts";
import * as dotenv from "https://deno.land/std@0.179.0/dotenv/mod.ts";

async function main() {
  await dotenv.load({
    export: true,
    examplePath: "./.env.example",
    envPath: "./.env",
  });

  const bot = discord.createBot({
    token: Deno.env.get("DISCORD_TOKEN") ?? "(error)",
    intents: discord.Intents.Guilds | discord.Intents.GuildMessages |
      discord.Intents.MessageContent,
  });

  bot.events.ready = () => {
    console.log("Successfully connected to gateway");
  };
  bot.events.messageCreate = (bot, message) => {
    console.log("messageCreate", message);
    if (message.content === "!ping") {
      bot.helpers.addReaction(message.channelId, message.id, "✅");
      bot.helpers.sendMessage(message.channelId, {
        content: "Pong!",
        messageReference: {
          failIfNotExists: false,
          guildId: message.guildId,
          channelId: message.channelId,
          messageId: message.id,
        },
      });
    }
    if (message.mentionedUserIds.includes(bot.id)) {
      bot.helpers.addReaction(message.channelId, message.id, "👀");
    }
  };

  await discord.startBot(bot);
}

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  console.log("start");
  await main();
  console.log("bye");
}
