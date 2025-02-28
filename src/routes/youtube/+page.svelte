<script lang="ts">
	import video from "../../data/video.json"

	const publishDateString = new Date(video.published).toLocaleDateString()
</script>

<svelte:head>
	<title>YouTube</title>
</svelte:head>

<h1>YouTube</h1>

<p>I run a YouTube channel on software development.</p>

<h2>Latest video</h2>

<p>{video.title}</p>

<p class="secondary">
	Published {publishDateString}
</p>

<a href={video.url} target="_blank">
	<img src={video.thumbnail} alt={video.title} />
</a>

<div class="secondary">
	{video.views} views, {video.likes} likes
</div>

<style>
	img {
		border-radius: 0.5rem;
		border: 1px solid #444;
		width: 250px;
		transition: border-color 150ms;
	}

	img:hover {
		border-color: #888;
	}
</style>
