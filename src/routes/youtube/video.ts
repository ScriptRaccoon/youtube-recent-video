/**
 * Documentation:
 * {@link https://www.npmjs.com/package/googleapis}
 * {@link https://developers.google.com/youtube/v3/docs/videos/list}
 * {@link https://developers.google.com/youtube/v3/docs/search/list}
 */

import { CHANNEL_ID, YOUTUBE_API_KEY } from "$env/static/private"
import { google } from "googleapis"
import { redis } from "./redis"

/**
 * YouTube client to access the YouTube Data API.
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
export async function getLatestVideo(): Promise<VideoDetails | undefined> {
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
 * Tries to get the latest video from the Redis cache.
 * If the cache is empty, it will fetch the latest video from the channel
 * using the YouTube API and store it in the cache.
 * If an error occurs, it will be logged and nothing will be returned.
 */
export async function getCachedLatestVideo(): Promise<VideoDetails | undefined> {
	console.info("getCachedLatestVideo 🔦")

	const cached = await redis.get("latest_video")
	if (cached) {
		console.info("cache hit 🚀")
		console.info("cached value:", cached)
		return JSON.parse(cached)
	}

	console.info("cache miss 😢")
	const video = await getLatestVideo()
	if (!video) return

	const ONE_DAY_IN_SECONDS = 60 * 60 * 24
	await redis.set("latest_video", JSON.stringify(video), "EX", ONE_DAY_IN_SECONDS)

	return video
}
