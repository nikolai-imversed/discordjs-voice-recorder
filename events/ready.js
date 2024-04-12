import { Events } from "discord.js"
import { getVoiceConnection } from "@discordjs/voice"

const name = Events.ClientReady
const once = true

function execute(client) {
  console.log(`Ready! Logged in as ${client.user.tag}`)

  client.guilds.cache.forEach((guild) => {
    for (const [channelID, channel] of guild.channels.cache) {
      if (channel.type === "GUILD_VOICE") {
        console.log(` - ${channel.name} ${channel.type} ${channel.id}`)

        const connection = getVoiceConnection(guild.id.toString())

        connection.on("error", (error) => {
          console.error(error)
        })

        connection.on("debug", (message) => {
          console.log(message)
        })
      }
    }
  })
}

export { name, once, execute }
