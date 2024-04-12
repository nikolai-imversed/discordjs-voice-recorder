import { SlashCommandBuilder } from "discord.js"

const data = new SlashCommandBuilder().setName("ping").setDescription("Test the bot")

async function execute(interaction) {
  await interaction.reply(`Pong! ${interaction.client.ws.ping}ms by ${interaction.user.username}`)
}

export { data, execute }
