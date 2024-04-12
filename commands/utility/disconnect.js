import { SlashCommandBuilder } from "discord.js"
import { getVoiceConnection } from "@discordjs/voice"

const data = new SlashCommandBuilder().setName("disconnect").setDescription("Disconnect from my voice channel")

async function execute(interaction) {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const { channel } = interaction.member.voice
  if (channel) {
    const connection = getVoiceConnection(channel.guild.id.toString())
    connection.destroy()

    await interaction.reply({
      content: `Disconnected from ${channel.name}`,
      ephemeral: true,
    })
  } else {
    await interaction.reply({ content: "You need to be in a voice channel to use this command!", ephemeral: true })
  }
}

export { data, execute }
