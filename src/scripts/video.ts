import fs from "fs"
import path from "path"
import { google } from "googleapis"

import { CHANNEL_ID, YOUTUBE_API_KEY } from "./env"

/**
 * YouTube client to access the YouTube Data API.
 * {@link https://www.npmjs.com/package/googleapis}
 */
const youtube = google.youtube({
	version: "v3",
	auth: YOUTUBE_API_KEY!,
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
 * {@link https://developers.google.com/youtube/v3/docs/search/list}
 */
async function get_latest_video(): Promise<VideoDetails | undefined> {
	try {
		const response = await youtube.search.list({
			part: ["snippet"],
			channelId: CHANNEL_ID!,
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

		const stats = await get_video_stats(id)
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
 * {@link https://developers.google.com/youtube/v3/docs/videos/list}
 */
async function get_video_stats(videoID: string): Promise<Stats | undefined> {
	try {
		const response = await youtube.videos.list({
			part: ["statistics"],
			id: [videoID],
		})

		const results = response.data.items
		if (!results?.length) throw new Error("No results found")

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
async function update_video_data() {
	console.info("Updating video data ...")

	const filePath = path.resolve("src", "data", "video.json")

	const oldVideoData = fs.readFileSync(filePath, { encoding: "utf-8" })
	console.info("Old video data:")
	console.info(oldVideoData)

	console.info("Fetching latest video data ...")

	const video = await get_latest_video()
	if (!video) {
		console.error("No video data, aborting update")
		return
	}

	const videoData = JSON.stringify(video)

	if (videoData === oldVideoData) {
		console.info("Video data is up to date")
		return
	}

	console.info("Video data:")
	console.info(videoData)

	fs.writeFileSync(filePath, videoData, { encoding: "utf-8" })
	console.info("Video data updated")
}

update_video_data()
