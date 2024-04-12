# 🎙️ Discord Conversation Recorder Bot 🎙️

🤖 This repository serves as a template to help you start creating your own Discord bot capable of recording conversations using [`discord.js`](https://github.com/discordjs/discord.js) library

🎙️ Currently implemented is the ability to connect with automatic recording of one or multiple users into separate .opus audio files in a short stream, such as short voice commands. 
Webhook sending to Discord and external applications supporting webhooks or APIs is also implemented.

## Features

- 🎧 Automatic recording of one or multiple users into separate .opus audio files
- 📡 Webhook sending to Discord and external applications
- 💬 Command functionality:
  - `/ping` - Test that the bot is working after connection
  - `/connect` - Connect the bot to a room and it will automatically record your conversation
  - `/disconnect` - Disconnect the bot manually, or it will disconnect after a timeout
  - `/sendAndTranscribe` - Send your final recording to a channel and/or external service

📜 Make sure to adhere to Discord rules when using recording functions and notify users of ongoing conversation recording.

🔊 This bot saves raw audio in the opus format. For converting opus to a playable file and running audio data converter, refer to the [`ffmpeg`](https://www.npmjs.com/package/ffmpeg) library.
