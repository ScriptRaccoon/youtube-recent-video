<script lang="ts">
	import "./app.css"
</script>

<nav>
	<a href="/">Home</a>
	<a href="/youtube">YouTube</a>
</nav>

<div class="wrapper">
	<slot></slot>
</div>

<style>
	nav {
		display: flex;
		justify-content: center;
		gap: 1.25rem;
		padding-block: 0.5rem;
		background-color: rgb(82, 22, 65);
	}

	.wrapper {
		max-width: 42rem;
		margin: 0 auto;
		padding-inline: 1rem;
	}
</style>
