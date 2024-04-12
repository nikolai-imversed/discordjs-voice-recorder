import fs from "fs"
import path, { dirname } from "path"
import { fileURLToPath, pathToFileURL } from "url"
import { Client, Collection, GatewayIntentBits } from "discord.js"

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers],
})
import { config } from "dotenv"
import { getVoiceConnection, VoiceConnectionStatus } from "@discordjs/voice"

config()

const token = process.env.DISCORD_TOKEN
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

client.commands = new Collection()

const folderPath = path.join(__dirname, "commands")
const commandFolders = fs.readdirSync(folderPath)

for (const folder of commandFolders) {
  const commands = path.join(folderPath, folder)
  const commandFiles = fs.readdirSync(commands).filter((file) => file.endsWith(".js"))
  for (const file of commandFiles) {
    const filePath = path.join(commands, file)
    const command = await import(pathToFileURL(filePath).href)
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command)
    } else {
      console.error(`Command ${file} is missing data or execute function`)
    }
  }
}

const eventsPath = path.join(__dirname, "events")
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".js"))

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file)
  const event = await import(pathToFileURL(filePath).href)
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args))
  } else {
    client.on(event.name, (...args) => event.execute(...args))
  }
}

client.login(token)
