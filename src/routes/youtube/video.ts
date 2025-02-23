import { CHANNEL_ID, YOUTUBE_API_KEY } from "$env/static/private"
import { google } from "googleapis"

const youtube = google.youtube({
	version: "v3",
	auth: YOUTUBE_API_KEY,
})

export async function getLatestVideo() {
	try {
		const response = await youtube.search.list({
			part: ["id", "snippet"],
			channelId: CHANNEL_ID,
			type: ["video"],
			order: "date",
			maxResults: 1,
		})

		const results = response.data.items
		if (!results) throw new Error("No results found")

		const video = results[0]

		const id = video.id?.videoId ?? ""
		const title = video.snippet?.title ?? ""
		const url = `https://youtu.be/${id}`
		const thumbnail = video.snippet?.thumbnails?.medium?.url ?? ""

		if (!id) throw new Error("No video id found")
		if (!title) throw new Error("No title found")

		return { id, title, url, thumbnail }
	} catch (err) {
		console.error(err)
	}
}
