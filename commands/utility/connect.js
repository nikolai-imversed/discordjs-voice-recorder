import { SlashCommandBuilder } from "discord.js"
import { EndBehaviorType, entersState, joinVoiceChannel, VoiceConnectionStatus } from "@discordjs/voice"
import pkg from "@discordjs/opus"
import fs from "fs"

const data = new SlashCommandBuilder().setName("connect").setDescription("Connect to my voice channel")

async function execute(interaction) {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const { channel } = interaction.member.voice
  if (channel) {
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
      selfDeaf: false,
    })

    connection.on("stateChange", (oldState, newState) => {
      console.log(`Connection transitioned from ${oldState.status} to ${newState.status}`)
    })

    connection.on(VoiceConnectionStatus.Ready, (oldState, newState) => {
      console.log(`Connection transitioned from ${oldState.status} to ${newState.status}`)

      const { receiver } = connection

      receiver.speaking.on("start", (userId) => {
        console.log(`User ${userId} started speaking`)
        const writeStream = fs.createWriteStream(`./${userId}.opus`)
        const { OpusEncoder } = pkg

        const audioStream = receiver.subscribe(userId, {
          end: {
            behavior: EndBehaviorType.AfterSilence,
            duration: 3000,
          },
        })

        const encoder = new OpusEncoder(48000, 2)

        audioStream.on("data", (chunk) => {
          const decodedAudio = encoder.decode(chunk)
          writeStream.write(decodedAudio)
        })
        audioStream.on("error", console.error)

        audioStream.on("end", () => {
          console.log(`User ${userId} stopped speaking`)
          writeStream.end()
        })
      })
    })

    connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
      try {
        await Promise.race([
          entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
          entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
        ])
        // Seems to be reconnecting to a new channel - ignore disconnect
      } catch (error) {
        // Seems to be a real disconnect which SHOULDN'T be recovered from
        connection.destroy()
      }
    })

    await interaction.reply({
      content: `Connected to ${channel.name}`,
      ephemeral: true,
    })
  } else {
    await interaction.reply({ content: "You need to be in a voice channel to use this command!", ephemeral: true })
  }
}

export { data, execute }
