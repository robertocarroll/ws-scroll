<script>
	import { onMount } from "svelte";
	import Scroller from "./layout/Scroller.svelte";
	//import Scroller from '@sveltejs/svelte-scroller';
	import Header from "./layout/Header.svelte";
	import Map from "./layout/Map.svelte";

	//	import { Map, MapSource, MapLayer, MapTooltip } from "@onsvisual/svelte-maps";

	let index, offset, progress, count;
	let innerHeight;
	let bgimage;
	let bgtext;
	let style;
	let fadein = false;
	let scrollerActive = false;

	let time = 0;
	let duration;

	let map = null;
	let location;

	$: time = duration * progress;

	$: if (0 < progress && progress < 1) {
		console.log('scroller active');
		scrollerActive = true;
	}
	else {
		console.log('scroller off');
		scrollerActive = false;
	}


	// CONFIG FOR SCROLLER COMPONENTS
	// Config - Once a section crosses this point, it becomes 'active'
	const threshold = 0.7;
	const top = 0;
	const bottom = 1;

	// State

	let id = {}; // Object to hold visible section IDs of Scroller components
	let idPrev = {}; // Object to keep track of previous IDs, to compare for changes

	/* 	onMount(() => {
			idPrev = { ...id };
		}); */

	function changeBackground(bgimage) {
		console.log("background is " + bgimage);
		bgtext = "";
		fadein = false;
		style = `background-image: url(${bgimage}); height: ${innerHeight}px;`;

		setTimeout(() => {
			fadein = true;
		}, 400);
	}


	// Actions for Scroller components
	const actions = {
		first_images: { // Actions for <Scroller/> with id="first-images"


			image01: () => { // Action for <section/> with data-id="image02"
				bgimage = "";
				changeBackground(bgimage);
				console.log("first function firing");
				bgtext = "<h2 class='white lh-solid'>WorldSkills Members are <span class='text-serif yellow'>attracting</span> more young people to skills</h2>";
			},

			image02: () => { // Action for <section/> with data-id="image01"
				bgimage = "img/first_images-image01.jpg";
				changeBackground(bgimage);
				console.log("second function firing");
			},

			image03: () => { // Action for <section/> with data-id="image03"
				bgimage = "";
				changeBackground(bgimage);
				console.log("third function firing");
				bgtext = "<h2 class='yellow text-uppercase lh-solid'>55% in 2016 to 62% in 2019</h2>";
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
				map['flyTo'](location);
				console.log("first map function firing" + JSON.stringify(location));
			},

			map02: () => { // Action for <section/> with data-id="map02"
				location = {
					center: [-75.13901, 39.97085],
					zoom: 11.62,
					pitch: 55.50,
					bearing: -7.20
				};
				map['flyTo'](location);
				console.log("second map function firing" + JSON.stringify(location));
			},

			map03: () => { // Action for <section/> with data-id="map03"
				location = {
					center: [-75.16468, 39.94503],
					zoom: 13.15,
					pitch: 60.00,
					bearing: -16.80
				};
				map['flyTo'](location);
				console.log("third map function firing" + JSON.stringify(location));
			}
		}

	};

	$: console.log(progress);

	// Code to run Scroller actions when new caption IDs come into view
	function runActions(codes = []) {
		codes.forEach(code => {
			console.log('the current id is' + id[code]);
			console.log('the previous id is' + idPrev[code]);
			if (id[code] != idPrev[code]) {
				console.log('id is different');
				if (actions[code][id[code]]) {
					actions[code][id[code]]();
				}
				idPrev[code] = id[code];
			}
		});
	}
	$: id && scrollerActive && runActions(Object.keys(actions)); // Run above code when 'id' object changes



</script>

<svelte:window bind:innerHeight={innerHeight} />

<svelte:head>
	<link rel="preload" as="image" href="img/Euphrasia_YoungPerson.jpg" />
</svelte:head>

<Header bgimage="img/Euphrasia_YoungPerson.jpg">
	<h1 class="ws-hero-title white hero-title-impact lh-solid text-uppercase">1.<br> WorldSkills <span
			class="yellow">increases the
			number</span> of skilled young people</h1>
</Header>

<Scroller top="{0}" bottom="{1}" bind:id={id['first_images']} bind:count bind:index bind:offset bind:progress
	{threshold}>
	<div slot="background" class="bg-full-image bg-animate" style="{style}" class:fadein>

		{#if bgtext}
		<div class="container">
			<div class="row align-items-center" style='height: {innerHeight}px'>
				<div class="col-sm order-last">
					{@html bgtext}
				</div>
				<div class="col-sm">

				</div>
			</div>
		</div>

		{/if}


	</div>

	<div slot="foreground">
		<section data-id="image01">
			<div class="scroll-box ws-content">
				<p>
					The number of young people interested in learning about VET is going up. WorldSkills Members are
					sharing data that points to an overall increase in students considering a vocational or technical
					career path.
				</p>
			</div>
		</section>
		<section data-id="image02">
			<div class="scroll-box ws-content">
				<p>
					WorldSkills Sweden shared data from its 2016-2019 evaluation that showed how its effort to increase
					the attractiveness of VET has increased the number of young people interested in vocational
					education.
				</p>
			</div>
		</section>

		<section data-id="image03">
			<div class="scroll-box ws-content">
				<p>
					The number of ninth graders who consider taking a VET education grew from 55% in 2016 to 62% in
					2019. In
					2019, 72% of young people also said that vocational programs provide a good education.
				</p>
			</div>
		</section>
	</div>
</Scroller>

<section>
	<div class="hero">
		<figure class="ws-hero ws-hero-quote ws-hero-cyan ws-hero-sm ws-impact-quote text-serif">
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

<Scroller {top} {threshold} {bottom} bind:id={id['first_map']} bind:count bind:index bind:offset bind:progress>
	<div slot="background" style='height: {innerHeight}px'>

		<Map bind:map={map} />

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

<section>
	<div class="hero">
		<figure class="ws-hero ws-hero-quote ws-hero-cyan ws-hero-sm ws-impact-quote text-serif">
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


<Scroller top="{0}" bottom="{1}" bind:count bind:index bind:offset bind:progress {threshold}>
	<div slot="background">
		<div class="video-container">
			<video bind:currentTime={time} bind:duration preload="metadata" muted src="/img/test-clip1.mp4"
				type="video/mp4" />

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