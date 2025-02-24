<div class="loader"></div>

<style>
	.loader {
		margin-block: 1rem;
		width: min(100%, 250px);
		height: 140px;
		background-color: #fff;
		border-radius: 1rem 0.5rem 1rem 0.5rem;
		animation: flash 1.5s infinite;
		position: relative;
	}

	@keyframes flash {
		0% {
			opacity: 0.05;
		}
		70% {
			opacity: 0.1;
		}
		100% {
			opacity: 0.05;
		}
	}
</style>
