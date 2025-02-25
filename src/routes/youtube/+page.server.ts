import type { PageServerLoad } from "./$types"

import video from "$lib/data/video.json"

export const load: PageServerLoad = async () => {
	return { video }
}
