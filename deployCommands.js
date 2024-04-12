import { REST, Routes } from "discord.js"
import fs from "fs"
import path, { dirname } from "path"
import { fileURLToPath, pathToFileURL } from "url"

import { config } from "dotenv"

config()

const token = process.env.DISCORD_TOKEN
const clientId = process.env.CLIENT_ID
const guildId = process.env.SERVER_ID
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const commands = []
const foldersPath = path.join(__dirname, "commands")
const commandFolders = fs.readdirSync(foldersPath)

for (const folder of commandFolders) {
  // Grab all the command files from the commands directory you created earlier
  const commandsPath = path.join(foldersPath, folder)
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"))
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    const command = await import(pathToFileURL(filePath).href)
    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON())
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
    }
  }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token)
;(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`)

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })

    console.log(`Successfully reloaded ${data.length} application (/) commands.`)
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error)
  }
})()
