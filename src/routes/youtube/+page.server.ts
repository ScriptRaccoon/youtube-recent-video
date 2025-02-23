import { error } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"
import { getCachedLatestVideo } from "./video"

export const load: PageServerLoad = async () => {
	const video = await getCachedLatestVideo()
	if (!video) {
		return error(500, "Failed to fetch latest video")
	}
	return { video }
}
