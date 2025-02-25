import { config } from "dotenv"
config()

import fs from "fs"
import path from "path"
import { google } from "googleapis"

const CHANNEL_ID = process.env.CHANNEL_ID
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

if (!CHANNEL_ID) throw new Error("No channel ID found")
if (!YOUTUBE_API_KEY) throw new Error("No YouTube API key found")

/**
 * YouTube client to access the YouTube Data API.
 * {@link https://www.npmjs.com/package/googleapis}
 * {@link https://developers.google.com/youtube/v3/docs/videos/list}
 * {@link https://developers.google.com/youtube/v3/docs/search/list}
 */
const youtube = google.youtube({
	version: "v3",
	auth: YOUTUBE_API_KEY,
})

type VideoDetails = {
	id: string
	title: string
	url: string
	thumbnail: string
	views: number
	likes: number
}

type Stats = {
	views: number
	likes: number
}

/**
 * Get the latest video from the channel using the YouTube API.
 * Includes the video ID, title, URL, thumbnail, views, and likes.
 * If an error occurs, it will be logged and nothing will be returned.
 */
async function getLatestVideo(): Promise<VideoDetails | undefined> {
	console.info("getLatestVideo 🎥")
	try {
		console.info("make a request to youtube API /search 🔦")

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

		const stats = await getVideoStats(id)
		if (!stats) throw new Error("No stats found")
		const { views, likes } = stats

		return { id, title, url, thumbnail, views, likes }
	} catch (err) {
		console.error(err)
	}
}

/**
 * Get the view count and like count for a video.
 * If an error occurs, it will be logged and nothing will be returned.
 */
async function getVideoStats(videoID: string): Promise<Stats | undefined> {
	try {
		console.info("make a request to youtube API /videos 🔦")

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

/**
 * Updates the file 'video.json' with the latest data from the YouTube API.
 */
async function updateVideoData() {
	const video = await getLatestVideo()
	if (!video) {
		console.error("No video data, aborting update")
		return
	}
	console.info("Video data:")
	console.info(video)

	const videoData = JSON.stringify(video)
	const filePath = path.resolve("src", "data", "video.json")
	fs.writeFileSync(filePath, videoData, { encoding: "utf-8" })
	console.info("Video data updated")
}

updateVideoData()
