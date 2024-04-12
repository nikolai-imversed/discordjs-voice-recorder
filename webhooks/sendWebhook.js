import axios from "axios"
import FormData from "form-data"

// Sends webhook to app outside of discord

const webhookUrl = process.env.WEBHOOK_URL

async function sendWebhook(url) {
  const formData = new FormData()
  formData.append("content", "Get file from discord bot")
  formData.append("username", "Your bot name")
  formData.append("url", url)

  console.log("Form data:", formData)

  try {
    const response = await axios.post(webhookUrl, formData, {
      headers: formData.getHeaders(),
    })
    console.log(response.data)
  } catch (error) {
    if (error.response) {
      console.log(error.response.data)
      console.log(error.response.status)
      console.log(error.response.headers)
    } else {
      console.log("Error", error.message)
    }
    console.log(error.config)
  }
}

export { sendWebhook }
