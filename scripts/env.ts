import { config } from "dotenv"
config()

const CHANNEL_ID = process.env.CHANNEL_ID
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

if (!CHANNEL_ID) throw new Error("No channel ID found")
if (!YOUTUBE_API_KEY) throw new Error("No YouTube API key found")

export { CHANNEL_ID, YOUTUBE_API_KEY }
