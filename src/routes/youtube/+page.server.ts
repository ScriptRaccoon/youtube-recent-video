import type { PageServerLoad } from "./$types"

import video from "../../data/video.json"

export const load: PageServerLoad = async () => {
	return { video }
}
