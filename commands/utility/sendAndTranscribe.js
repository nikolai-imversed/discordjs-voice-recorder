import { EmbedBuilder, WebhookClient, SlashCommandBuilder } from "discord.js"
import fs from "fs"
import path from "path"
// import { sendWebhook } from "../../webhooks/sendWebhook.js"

// Send recording to Discord channel
const webhookClient = new WebhookClient({
  url: process.env.DISCORD_WEBHOOK_URL,
})
const data = new SlashCommandBuilder().setName("transcribe").setDescription("save recording to Discord channel, call a transcribe webhook")

async function execute(interaction) {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const embed = new EmbedBuilder().setTitle("Conversation recording").setDescription("Get your conversation while it's hot").setColor(0x379c6f)

  function getFile(directory) {
    const files = fs.readdirSync(directory)
    const opusFile = files.find((file) => path.extname(file) === ".opus")
    return opusFile ? path.join(directory, opusFile) : null
  }

  const file = getFile("./")
  let message
  try {
    // message =
    await webhookClient.send({
      content: "File upload test",
      username: "your-bot-name",
      embeds: [embed],
      files: [file ? { attachment: file, name: "audio.opus" } : null].filter(Boolean),
    })
  } catch (error) {
    console.error(error)
  }
  // Send to any outside app that allows webhooks
  // if (message) await sendWebhook(message.attachments[0].url)
}

export { data, execute }
