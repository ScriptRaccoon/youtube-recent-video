import type { PageServerLoad } from "./$types"
import { getCachedLatestVideo } from "./video"

export const load: PageServerLoad = async () => {
	const videoPromise = getCachedLatestVideo()
	return { videoPromise }
}
