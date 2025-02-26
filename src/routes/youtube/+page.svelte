<script lang="ts">
	let { data } = $props()
	const { video } = data
</script>

<svelte:head>
	<title>YouTube</title>
</svelte:head>

<h1>YouTube</h1>

<p>I run a YouTube channel on software development.</p>

<h2>Latest video</h2>

<p>{video.title}</p>

<a href={video.url} target="_blank">
	<img src={video.thumbnail} alt={video.title} />
</a>

<div class="secondary">{video.views} views, {video.likes} likes</div>

<style>
	img {
		border-radius: 0.5rem;
		border: 1px solid #444;
		width: 250px;
	}

	img:hover {
		border-color: #aaa;
	}
</style>
