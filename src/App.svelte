<script>
	import { onMount } from "svelte";
	import Scroller from "./layout/Scroller.svelte";
	import Header from "./layout/Header.svelte";

	let index, offset, progress, count;

	let bgimage = null;

	let style = '';

	// CONFIG FOR SCROLLER COMPONENTS
	// Config - Once a section crosses this point, it becomes 'active'
	const threshold = 0.5;
	// State

	let id = {}; // Object to hold visible section IDs of Scroller components
	let idPrev = {}; // Object to keep track of previous IDs, to compare for changes
	onMount(() => {
		idPrev = { ...id };
	});

	// Actions for Scroller components
	const actions = {
		map: { // Actions for <Scroller/> with id="map"
			map01: () => { // Action for <section/> with data-id="map01"
				style = "";
				bgimage = "";
				console.log("first function firing");
				console.log
			},

			map02: () => { // Action for <section/> with data-id="map02"
				console.log("second function firing");
				style = "";
				bgimage = "img/test1.jpg";
				style += `background-image: url(${bgimage});`;
			},

			map03: () => { // Action for <section/> with data-id="map02"
				style = "";
				console.log("third function firing");
			}
		}
	};

	// Code to run Scroller actions when new caption IDs come into view
	function runActions(codes = []) {
		codes.forEach(code => {
			if (id[code] != idPrev[code]) {
				if (actions[code][id[code]]) {
					actions[code][id[code]]();
				}
				idPrev[code] = id[code];
			}
		});
	}
	$: id && runActions(Object.keys(actions)); // Run above code when 'id' object changes

//	$: console.log(id);

</script>

<style>
	section {
		height: 100vh;
	}
</style>

<Header bgimage="img/Australia_Trevor2.jpg">
	<h1>This is the title of the article</h1>
	<p class="text-big" style="margin-top: 5px">
		This is a short text description of the article that might take up a couple of lines
	</p>
</Header>

<Scroller top="{0}" bottom="{0.6}" bind:id={id['map']} bind:count bind:index bind:offset bind:progress {threshold}>
	<div slot="background" style="{style}">
		<p>current section: <strong>{index + 1}/{count}</strong></p>
		<progress value="{count ? (index + 1) / count : 0}"></progress>

		<p>offset in current section</p>
		<progress value={offset || 0}></progress>

		<p>total progress</p>
		<progress value={progress || 0}></progress>
	</div>

	<div slot="foreground">
		<section data-id="map01">
			<div class="scroll-box" class:active={index===0}>
				<p>
					Section 1 - This chart shows the <strong>area in square kilometres</strong> of each local authority
					district in
					the UK. Each circle represents one district. The scale is logarithmic.
				</p>
			</div>
		</section>
		<section data-id="map02">
			<div class="scroll-box">
				<p>
					Section 2 - This chart shows the <strong>area in square kilometres</strong> of each local authority
					district in
					the UK. Each circle represents one district. The scale is logarithmic.
				</p>
			</div>
		</section>

		<section data-id="map03">
			<div class="scroll-box">
				<p>
					Section 3 - This chart shows the <strong>area in square kilometres</strong> of each local authority
					district in
					the UK. Each circle represents one district. The scale is logarithmic.
				</p>
			</div>
		</section>
	</div>
</Scroller>