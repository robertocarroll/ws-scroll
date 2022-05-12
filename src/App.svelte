<script>
	import { onMount } from "svelte";
	import Scroller from "./layout/Scroller.svelte";
	//import Scroller from '@sveltejs/svelte-scroller';
	import Header from "./layout/Header.svelte";

	import { Map, MapSource, MapLayer, MapTooltip } from "@onsvisual/svelte-maps";

	let index, offset, progress, count;
	let innerHeight;
	let bgimage = "img/Sky_Frame.jpeg";
	let style;

	// CONFIG FOR SCROLLER COMPONENTS
	// Config - Once a section crosses this point, it becomes 'active'
	const threshold = 0.3;
	const top = 0;
	const bottom = 1;

	// State

	let id = {}; // Object to hold visible section IDs of Scroller components
	let idPrev = {}; // Object to keep track of previous IDs, to compare for changes

	onMount(() => {
		idPrev = { ...id };
		// set first background image
		style = `background-image: url(${bgimage});
		height: ${innerHeight}px;`;
	});

	// Actions for Scroller components
	const actions = {
		first_images: { // Actions for <Scroller/> with id="first-images"
			image01: () => { // Action for <section/> with data-id="image01"
				style = "";
				bgimage = "img/Sky_Frame.jpeg";
				console.log("first function firing");
				style = `background: url(${bgimage});
		height: ${innerHeight}px;`;
			},

			image02: () => { // Action for <section/> with data-id="image02"
				style = "";
				bgimage = "img/test1.jpg";
				style = `background-image: url(${bgimage});
		height: ${innerHeight}px;`;
				console.log("second function firing");

			},

			image03: () => { // Action for <section/> with data-id="image03"
				bgimage = "img/Rail_Technology3.jpg";
				style = `background-image: url(${bgimage});
		height: ${innerHeight}px;`;
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

</script>

<svelte:window bind:innerHeight={innerHeight} />

<svelte:head>
	<link rel="preload" as="image" href="img/Australia_Trevor2.jpg" />
</svelte:head>

<Header bgimage="img/Australia_Trevor2.jpg">
	<h1>This is the title of the article</h1>
	<p class="text-big" style="margin-top: 5px">
		This is a short text description of the article that might take up a couple of lines
	</p>
</Header>

<Scroller top="{0}" bottom="{1}" bind:id={id['first_images']} bind:count bind:index bind:offset bind:progress
	{threshold}>
	<div slot="background" style="{style}">
		<p>current section: <strong>{index + 1}/{count}</strong></p>
		<progress value="{count ? (index + 1) / count : 0}"></progress>

		<p>offset in current section</p>
		<progress value={offset || 0}></progress>

		<p>total progress</p>
		<progress value={progress || 0}></progress>
	</div>

	<div slot="foreground">
		<section data-id="image01">
			<div class="scroll-box" class:active={index===0}>
				<p>
					Section 1 - This chart shows the <strong>area in square kilometres</strong> of each local authority
					district in
					the UK. Each circle represents one district. The scale is logarithmic.
				</p>
			</div>
		</section>
		<section data-id="image02">
			<div class="scroll-box">
				<p>
					Section 2 - This chart shows the <strong>area in square kilometres</strong> of each local authority
					district in
					the UK. Each circle represents one district. The scale is logarithmic.
				</p>
			</div>
		</section>

		<section data-id="image03">
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


<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
	aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
	Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
	sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
<p>

	Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
	aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
	Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
	sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

<p>

	Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
	aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
	Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
	sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>