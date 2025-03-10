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

/**
 * Get the latest video from the channel using the YouTube API.
 * If an error occurs, it will be logged and nothing will be returned.
 * {@link https://developers.google.com/youtube/v3/docs/search/list}
 */
async function get_latest_video() {
	try {
		const response = await youtube.search.list({
			part: ["snippet"],
			channelId: CHANNEL_ID!,
			type: ["video"],
			order: "date",
			maxResults: 1,
			fields: "items(id/videoId,snippet(title,thumbnails/medium,publishedAt))",
		})

		const results = response.data.items
		if (!results?.length) throw new Error("No results found")

		const video = results[0]

		const id = video.id?.videoId ?? ""
		const title = video.snippet?.title ?? ""
		const url = `https://youtu.be/${id}`
		const thumbnail = video.snippet?.thumbnails?.medium?.url ?? ""
		const published = video.snippet?.publishedAt ?? ""

		if (!id) throw new Error("No video id found")
		if (!title) throw new Error("No title found")

		const stats = await get_video_stats(id)
		if (!stats) throw new Error("No stats found")
		const { views, likes } = stats

		return { id, title, url, thumbnail, published, views, likes }
	} catch (err) {
		console.error(err)
	}
}

/**
 * Get the view count and like count for a video.
 * If an error occurs, it will be logged and nothing will be returned.
 * {@link https://developers.google.com/youtube/v3/docs/videos/list}
 */
async function get_video_stats(id: string) {
	try {
		const response = await youtube.videos.list({
			part: ["statistics"],
			id: [id],
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

	const file_path = path.resolve("..", "src", "data", "video.json")

	const old_video = fs.readFileSync(file_path, { encoding: "utf-8" })
	console.info("Old video data:")
	console.info(old_video)

	console.info("Fetching latest video data ...")

	const video = await get_latest_video()
	if (!video) {
		console.error("No video data, aborting update")
		return
	}

	const video_data = JSON.stringify(video)

	if (video_data === old_video) {
		console.info("Video data is up to date")
		return
	}

	console.info("Video data:")
	console.info(video_data)

	fs.writeFileSync(file_path, video_data, { encoding: "utf-8" })
	console.info("Video data updated")
}

update_video_data()
