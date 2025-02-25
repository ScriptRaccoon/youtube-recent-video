import type { PageServerLoad } from "./$types"
import { getLatestVideo } from "./video"

export const load: PageServerLoad = async () => {
	const videoPromise = getLatestVideo()
	return { videoPromise }
}
