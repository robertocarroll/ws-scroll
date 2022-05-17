import App from './App.svelte';

const app = new App({
	target: document.getElementById('svelteContainer'),
	props: {
		name: 'world'
	}
});

export default app;