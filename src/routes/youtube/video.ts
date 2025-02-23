import { CHANNEL_ID, YOUTUBE_API_KEY } from "$env/static/private"
import { google } from "googleapis"
import { redis } from "./redis"

const ONE_DAY_IN_SECONDS = 60 * 60 * 24

export async function getCachedLatestVideo() {
	console.log("getCachedLatestVideo 🔦")
	const cached = await redis.get("latest_video")
	if (cached) {
		console.log("cache hit 🚀")
		return JSON.parse(cached)
	}
	console.log("cache miss 😢")
	const video = await getLatestVideo()
	if (!video) return null
	await redis.set("latest_video", JSON.stringify(video), "EX", ONE_DAY_IN_SECONDS)
	return video
}

const youtube = google.youtube({
	version: "v3",
	auth: YOUTUBE_API_KEY,
})

export async function getLatestVideo() {
	console.log("getLatestVideo 🎥")
	try {
		const response = await youtube.search.list({
			part: ["id", "snippet"],
			channelId: CHANNEL_ID,
			type: ["video"],
			order: "date",
			maxResults: 1,
		})

		console.log("made a request to youtube API 🤖")

		const results = response.data.items
		if (!results) throw new Error("No results found")

		const video = results[0]

		const id = video.id?.videoId ?? ""
		const title = video.snippet?.title ?? ""
		const url = `https://youtu.be/${id}`
		const thumbnail = video.snippet?.thumbnails?.medium?.url ?? ""

		if (!id) throw new Error("No video id found")
		if (!title) throw new Error("No title found")

		const stats = await getVideoStats(id)
		if (!stats) throw new Error("No stats found")
		const { views, likes } = stats

		return { id, title, url, thumbnail, views, likes }
	} catch (err) {
		console.error(err)
	}
}

export async function getVideoStats(videoID: string) {
	try {
		const response = await youtube.videos.list({
			part: ["statistics"],
			id: [videoID],
		})

		const results = response.data.items
		if (!results) throw new Error("No results found")

		const video = results[0]

		const views = Number(video.statistics?.viewCount) ?? 0
		const likes = Number(video.statistics?.likeCount) ?? 0

		return { views, likes }
	} catch (err) {
		console.error(err)
	}
}
