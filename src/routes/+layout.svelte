<script lang="ts">
	import "./app.css"
	import Nav from "$lib/Nav.svelte"
</script>

<Nav />

<div class="wrapper">
	<slot></slot>
</div>

<style>
	.wrapper {
		max-width: 42rem;
		margin: 0 auto;
		padding-inline: 1rem;
	}
</style>
