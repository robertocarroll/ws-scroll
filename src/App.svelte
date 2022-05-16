<script>
	import { onMount } from "svelte";
	import Scroller from "./layout/Scroller.svelte";
	//import Scroller from '@sveltejs/svelte-scroller';
	import Header from "./layout/Header.svelte";
	import Map from "./layout/Map.svelte";

	//	import { Map, MapSource, MapLayer, MapTooltip } from "@onsvisual/svelte-maps";

	let index, offset, progress, count;
	let innerHeight;
	let bgimage = "img/Rail_Technology3.jpg";
	let bgtext;
	let style;
	let fadein = false;

	let time = 0;
	let duration;

	let map = null;
	let location;

	$: time = duration * progress;

	//	$: console.log(progress);
	$: console.log(offset);

	// CONFIG FOR SCROLLER COMPONENTS
	// Config - Once a section crosses this point, it becomes 'active'
	const threshold = 0.7;
	const top = 0;
	const bottom = 1;

	// State

	let id = {}; // Object to hold visible section IDs of Scroller components
	let idPrev = {}; // Object to keep track of previous IDs, to compare for changes

	onMount(() => {
		idPrev = { ...id };
	});

	function changeBackground(bgimage) {
		console.log("background is " + bgimage);
		fadein = false;
		style = `background-image: url(${bgimage}); height: ${innerHeight}px;`;

		setTimeout(() => {
			fadein = true;
		}, 400);
	}


	// Actions for Scroller components
	const actions = {
		first_images: { // Actions for <Scroller/> with id="first-images"
			image01: () => { // Action for <section/> with data-id="image01"
				bgimage = "img/Rail_Technology3.jpg";
				changeBackground(bgimage);
				console.log("first function firing");
			},

			image02: () => { // Action for <section/> with data-id="image02"
				bgimage = "img/test1.jpg";
				changeBackground(bgimage);
				console.log("second function firing");
				bgtext = "Some text in a big font";
			},

			image03: () => { // Action for <section/> with data-id="image03"
				bgtext = "";
				bgimage = "img/Rail_Technology3.jpg";
				changeBackground(bgimage);
				console.log("third function firing");
			}
		},
		first_map: { // Actions for <Scroller/> with id="first_map"
			map01: () => { // Action for <section/> with data-id="map01"
				location = {
					center: [-75.13080, 39.97790],
					zoom: 9.83,
					pitch: 0.00,
					bearing: 0.00
				};
				console.log("first map function firing" + location.centre);
			},

			map02: () => { // Action for <section/> with data-id="map02"
				location = {
					center: [-75.13901, 39.97085],
					zoom: 11.62,
					pitch: 55.50,
					bearing: -7.20
				};
				console.log("second map function firing" + location.centre);
			},

			map03: () => { // Action for <section/> with data-id="map03"
				location = {
					center: [-75.16468, 39.94503],
					zoom: 13.15,
					pitch: 60.00,
					bearing: -16.80
				};
				console.log("third map function firing" + location.centre);
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
	<h1 class="ws-hero-title white hero-title-impact">1.<br> WORLDSKILLS <span class="yellow">INCREASES
			THE NUMBER</span> OF SKILLED YOUNG PEOPLE</h1>
</Header>

<Scroller top="{0}" bottom="{1}" bind:id={id['first_images']} bind:count bind:index bind:offset bind:progress
	{threshold}>
	<div slot="background" class="bg-full-image bg-animate" style="{style}" class:fadein>
		<p>current section: <strong>{index + 1}/{count}</strong></p>
		<progress value="{count ? (index + 1) / count : 0}"></progress>

		<p>offset in current section</p>
		<progress value={offset || 0}></progress>

		<p>total progress</p>
		<progress value={progress || 0}></progress>

		{#if bgtext}
		<h1>{bgtext}</h1>
		{/if}


	</div>

	<div slot="foreground">
		<section data-id="image01">
			<div class="scroll-box">
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

<section style="background-image: url(img/Sky_Frame.jpeg);" class="bg-full-image vh-100">
	<div class="hero">
		<figure class="ws-hero ws-hero-quote ws-hero-cyan ws-hero-sm">
			<blockquote class="ws-hero-title ws-small">“When I won a gold medal at WorldSkills Sao Paulo 2015, the world
				was
				seeing
				a boy that came from a place of social vulnerability, all because that boy had one opportunity to learn
				a skill that he fell in love with.
				My life was transformed because of WorldSkills. And I want everyone in the world to have the opportunity
				to do the same.”</blockquote>
			<figcaption>
				<div class="ws-hero-desc">
					<p>- Leo Rodrigues</p>
				</div>
			</figcaption>
		</figure>
	</div>
</section>

<!-- First map scroller  -->

<Scroller {top} {threshold} {bottom} bind:id={id['first_map']}>
	<div slot="background">

		<Map bind:map={map} height: ${innerHeight}px />

	</div>

	<div slot="foreground">
		<section data-id="map01">
			<div class="col-medium">
				<p>This is a map zoomed to the extents of <span class="em em-muted">England and Wales</span>.</p>
			</div>
		</section>
		<section data-id="map02">
			<div class="col-medium">
				<p>This is where <span class="em em-muted">Fareham, Hampshire</span> is on the map.</p>
			</div>
		</section>
		<section data-id="map03">
			<div class="col-medium">
				<p>This is where <span class="em em-muted">Newport, Gwent</span> is on the map.</p>
			</div>
		</section>
	</div>
</Scroller>


<Scroller top="{0}" bottom="{1}" bind:count bind:index bind:offset bind:progress {threshold}>
	<div slot="background">
		<div class="video-container">
			<video bind:currentTime={time} bind:duration preload="metadata" muted
				src="https://static01.nyt.com/newsgraphics/2019/10/23/turkey-syria-video-upload/71ab097907156ca46fb7ffd4d21dfbd119fb47e8/syria-turkey-reconstruct-7-800.mp4"
				type="video/mp4" />
			<!--
				alternative source:
				src="https://int.nyt.com/newsgraphics/2020/beirut-explosion-video/main/warehouse-800.mp4" 
			  -->
		</div>
	</div>

	<div slot="foreground">
		<section>
			<div class="col-medium">
				<p>This is a map zoomed to the extents of <span class="em em-muted">England and Wales</span>.</p>
			</div>
		</section>
		<section>
			<div class="col-medium">
				<p>This is where <span class="em em-muted">Fareham, Hampshire</span> is on the map.</p>
			</div>
		</section>
		<section>
			<div class="col-medium">
				<p>This is where <span class="em em-muted">Newport, Gwent</span> is on the map.</p>
			</div>
		</section>
	</div>
</Scroller>