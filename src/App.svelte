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
	let bgtext = {
		first: '',
		second: '',
		third: '',
		fourth: ''
	};
	let style = {
		first: '',
		second: '',
		third: '',
		fourth: ''
	};
	let fadein = false;
	let scrollerActive = false;

	let time = 0;
	let duration;

	let map = null;
	let location;

	/* 	$: time = duration * progress;
	
		$: if (0 < progress && progress < 1) {
			//	console.log('scroller active');
			scrollerActive = true;
		}
		else {
			//	console.log('scroller off');
			scrollerActive = false;
		} */

	// CONFIG FOR SCROLLER COMPONENTS
	// Config - Once a section crosses this point, it becomes 'active'
	const threshold = 0.7;
	const top = 0;
	const bottom = 1;

	// State

	let id = {}; // Object to hold visible section IDs of Scroller components
	let idPrev = {}; // Object to keep track of previous IDs, to compare for changes

	function changeBackground(key, bgimage) {
		bgtext[key] = "";
		fadein = false;
		style[key] = `background-image: url(${bgimage}); height: ${innerHeight}px;`;

		setTimeout(() => {
			fadein = true;
		}, 400);
	}


	// Actions for Scroller components
	const actions = {
		first_images: { // Actions for <Scroller/> with id="first-images"
			image_01_01: () => { // Action for <section/> with data-id="image02"
				bgimage = "";
				changeBackground('first', bgimage);
				bgtext['first'] = "<h2 class='white lh-solid'>WorldSkills Members are <span class='text-serif yellow'>attracting</span> more young people to skills</h2>";
			},

			image_01_02: () => { // Action for <section/> with data-id="image01"
				bgimage = "img/first_images-image01.jpg";
				changeBackground('first', bgimage);
			},

			image_01_03: () => { // Action for <section/> with data-id="image03"
				bgimage = "";
				changeBackground('first', bgimage);
				bgtext['first'] = "<h2 class='yellow text-uppercase lh-solid'>55% in 2016 to 62% in 2019</h2>";
			}
		},
		second_images: { // Actions for <Scroller/> with id="second-images"
			image_02_01: () => { // Action for <section/> with data-id="image02"
				bgimage = "img/second_images-image02.jpg";
				changeBackground('second', bgimage);
				bgtext['second'] = "";
			},

			image_02_02: () => { // Action for <section/> with data-id="image01"
				bgimage = "";
				changeBackground('second', bgimage);
				bgtext['second'] = "<h2 class='yellow text-uppercase lh-solid'>Three-quarters of visitors say they learned about new career options in TVET</h2>";
			},

			image_02_03: () => { // Action for <section/> with data-id="image03"
				bgimage = "img/second_images-image01.jpg";
				changeBackground('second', bgimage);
				bgtext['second'] = "";
			}
		},
		first_map: { // Actions for <Scroller/> with id="first_map"
			map01: () => { // Action for <section/> with data-id="map01"
				location = {
					center: [-49.6657512, -15.1054913],
					zoom: 3,
					pitch: 0.00,
					bearing: 0.00
				};
				if (map) {
					map['flyTo'](location);
				}

			},
			map02: () => { // Action for <section/> with data-id="map02"
				location = {
					center: [-43.3431517, -22.8651765],
					zoom: 9.62,
					pitch: 55.50,
					bearing: -7.20
				};
				if (map) {
					map['flyTo'](location);
					console.log("second map function firing" + JSON.stringify(location));
				}
			}
		},
		third_images: { // Actions for <Scroller/> with id="third_images"
			image_03_01: () => {
				bgimage = "img/third_images-image01.jpg";
				changeBackground('third', bgimage);
				bgtext['third'] = "";
			},
			image_03_02: () => {
				bgimage = "";
				changeBackground('third', bgimage);
				bgtext['third'] = "<h2 class='white lh-solid'>Leo didn’t fit the typical profile of a jeweler and was told as much. He knew nothing about the industry. But what he saw, he quickly fell in love with.</h2>";
			},
			image_03_03: () => {
				bgimage = "img/third_images-image02.jpg";
				changeBackground('third', bgimage);
				bgtext['third'] = "";
			},
			image_03_04: () => {
				bgimage = "img/third_images-image03.jpg";
				changeBackground('third', bgimage);
				bgtext['third'] = "";
			},
			image_03_05: () => {
				bgimage = "img/third_images-image04.jpg";
				changeBackground('third', bgimage);
				bgtext['third'] = "";
			},
			image_03_06: () => {
				bgimage = "img/globe.jpg";
				changeBackground('third', bgimage);
				bgtext['third'] = "";
			}
		},
		fourth_images: { // Actions for <Scroller/> with id="fourth-images"
			image_04_01: () => {
				bgimage = "img/Skilled_Worker_V2.jpg";
				changeBackground('fourth', bgimage);
				bgtext['fourth'] = "";
			},

			image_04_02: () => {
				bgimage = "";
				changeBackground('fourth', bgimage);
				bgtext['fourth'] = "<h2 class='white lh-solid'>Being an entrepreneur in Brazil is tough. <span class='text-serif yellow'>Only 1 in 5 companies</span> succeed after their first year of operations.</h2>";
			},

			image_04_03: () => {
				bgimage = "img/third_images-image01.jpg";
				changeBackground('fourth', bgimage);
				bgtext['fourth'] = "";
			}
		}

	};

	//$: console.log(progress);

	// Code to run Scroller actions when new caption IDs come into view
	function runActions(codes = []) {
		codes.forEach(code => {
			//console.log('the current id is' + id[code]);
			//console.log('the previous id is' + idPrev[code]);
			if (id[code] != idPrev[code]) {
				//		console.log('id is different');
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
	<link rel="preload" as="image" href="img/Euphrasia_YoungPerson.jpg" />
</svelte:head>

<Header bgimage="img/Euphrasia_YoungPerson.jpg">
	<h1 class="ws-hero-title white hero-title-impact lh-solid text-uppercase">1.<br> WorldSkills <span
			class="yellow">increases the
			number</span> of skilled young people</h1>
</Header>

<Scroller top="{0}" bottom="{1}" bind:id={id['first_images']} bind:count bind:index bind:offset bind:progress
	{threshold}>
	<div slot="background" class="bg-full-image bg-animate" style="{style['first']}" class:fadein>

		{#if bgtext['first']}
		<div class="container">
			<div class="row align-items-center" style='height: {innerHeight}px'>
				<div class="col-sm order-sm-2">
					{@html bgtext['first']}
				</div>
				<div class="col-sm d-none d-sm-block">

				</div>
			</div>
		</div>

		{/if}


	</div>

	<div slot="foreground">
		<section data-id="image_01_01">
			<div class="scroll-box ws-content">
				<p>
					The number of young people interested in learning about VET is going up. WorldSkills Members are
					sharing data that points to an overall increase in students considering a vocational or technical
					career path.
				</p>
			</div>
		</section>
		<section data-id="image_01_02">
			<div class="scroll-box ws-content">
				<p>
					WorldSkills Sweden shared data from its 2016-2019 evaluation that showed how its effort to increase
					the attractiveness of VET has increased the number of young people interested in vocational
					education.
				</p>
			</div>
		</section>

		<section data-id="image_01_03">
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

<section class="bg-full-image" style="background-image:url('img/Australia_Trevor2.jpg'); height: {innerHeight}px">
	<div class="container h-100">
		<div class="d-flex flex-column h-100 text-center">
			<h2 class='white lh-solid'>WorldSkills Competitions are <span class='text-serif yellow'>inspiring</span>
				young
				people to get involved in skills
		</div>
	</div>
</section>

<!-- Second image scroller  -->

<Scroller top="{0}" bottom="{1}" bind:id={id['second_images']} bind:count bind:index bind:offset bind:progress
	{threshold}>
	<div slot="background" class="bg-full-image bg-animate" style="{style['second']}" class:fadein>

		{#if bgtext['second']}
		<div class="container">
			<div class="row align-items-center" style='height: {innerHeight}px'>
				<div class="col-sm order-last">
					{@html bgtext['second']}
				</div>
				<div class="col-sm d-none d-sm-block">

				</div>
			</div>
		</div>

		{/if}


	</div>

	<div slot="foreground">
		<section data-id="image_02_01">
			<div class="scroll-box ws-content">
				<p>
					Member data shows that national WorldSkills competitions can have a positive spill-over effect,
					motivating more young people to pursue training or a career in technical skills.
				</p>
			</div>
		</section>
		<section data-id="image_02_02">
			<div class="scroll-box ws-content">
				<p>
					Skills Canada noticed the competition’s impact on spectators. In 2019, 68% of visitors to the
					national competition said they learned new sources of information on how to pursue a career in
					technical and vocational education and training (TVET), and three-quarters (76%) say they learned
					about new career options in TVET.
				</p>
			</div>
		</section>

		<section data-id="image_02_03">
			<div class="scroll-box ws-content">
				<p>
					WorldSkills Sweden shared details from its work in Uppsala County. After hosting the national skill
					competition in 2018, the region saw an increase in students taking part in vocational programmes.
				</p>
			</div>
		</section>
	</div>
</Scroller>

<section class="container">
	<div class="row align-items-center" style='height: {innerHeight}px'>
		<div class="hero">
			<figure class="ws-hero ws-hero-quote ws-hero-cyan ws-hero-sm ws-impact-quote text-serif">
				<blockquote class="h2">“When I won a gold medal at WorldSkills Sao Paulo 2015, the
					world
					was
					seeing
					a boy that came from a place of social vulnerability, all because that boy had one opportunity to
					learn
					a skill that he fell in love with.
					My life was transformed because of WorldSkills. And I want everyone in the world to have the
					opportunity
					to do the same.”</blockquote>
				<figcaption>
					<div class="ws-hero-desc">
						<p>— Leo Rodrigues, WorldSkills Champion</p>
					</div>
				</figcaption>
			</figure>
		</div>
	</div>
</section>

<!-- First map scroller  -->

<Scroller {top} {threshold} {bottom} bind:id={id['first_map']} bind:count bind:index bind:offset bind:progress>
	<div slot="background" style='height: {innerHeight}px'>

		<Map bind:map={map} />

	</div>

	<div slot="foreground">
		<section data-id="map01">
			<div class="scroll-box ws-content">
				<p>
					In Brazil, about 17.1 million people live in the favelas of Rio de Janeiro.
				</p>
			</div>
		</section>
		<section data-id="map02">
			<div class="scroll-box ws-content">
				<p>
					That’s 23% of the city’s population, around 1.5 million people. It is a harsh reality that doesn’t
					present young people
					with many opportunities to develop themselves.
				</p>
			</div>
		</section>

	</div>
</Scroller>

<!-- Third image scroller  -->

<Scroller top="{0}" bottom="{1}" bind:id={id['third_images']} bind:count bind:index bind:offset bind:progress
	{threshold}>
	<div slot="background" class="bg-full-image bg-animate" style="{style['third']}" class:fadein>

		{#if bgtext['third']}
		<div class="container">
			<div class="row align-items-center" style='height: {innerHeight}px'>
				<div class="col-sm order-last">
					{@html bgtext['third']}
				</div>
				<div class="col-sm d-none d-sm-block">

				</div>
			</div>
		</div>

		{/if}


	</div>

	<div slot="foreground">
		<section data-id="image_03_01">
			<div class="scroll-box ws-content">
				<p>
					Leo Rodrigues grew up in this environment. But from a young age, Leo was a dreamer. He would look up
					at planes overhead and wish he was going wherever they were going.
				</p>
			</div>
		</section>
		<section data-id="image_03_02">
			<div class="scroll-box ws-content">
				<p>
					As a 15 year-old, Leo was just like each one of the 15% of young people in Brazil who were
					unemployed. He went searching for work and handed his CV out to anyone and everyone, leading to a
					call back for an apprenticeship with HStern — a luxury jewelry maker. Curious, Leo accepted the
					apprenticeship.
				</p>
			</div>
		</section>

		<section data-id="image_03_03">
			<div class="scroll-box ws-content">
				<p>
					After noticing another jewelry student train to compete in the national WorldSkills competition, Leo
					was inspired. What he saw was someone entirely focused on their craft. He realized to be good at
					something he would have to put in the work. So, with the help of his WorldSkills trainer, Claudinei,
					he honed his talents.
				</p>
			</div>
		</section>

		<section data-id="image_03_04">
			<div class="scroll-box ws-content">
				<p>
					He trained 8 to 10 hours a day in the workshop working on technical skills like design, soldering,
					surface finishing, sawing and dimension control. The WorldSkills Brazil trainers also prepared Leo
					for other skills
					he’d need for the competition - such as resilience, time keeping
					and communication.
				</p>
			</div>
		</section>

		<section data-id="image_03_05">
			<div class="scroll-box ws-content">
				<p>
					His success at the regional and national WorldSkills competitions saw Leo, a kid from the favelas,
					take center stage for Team Brazil at WorldSkills São Paulo 2015. He took home Gold for Jewelry -
					winning it for his country, his family and to show that a young person from a socially vulnerable
					background can be the best and can redefine what it means to be a skilled jeweler.
				</p>
			</div>
		</section>

		<section data-id="image_03_06">
			<div class="scroll-box ws-content">
				<p>
					After becoming the best, Leo wanted to train the best. He travelled to India to train the 2019
					candidate.
				</p>
			</div>
		</section>
	</div>
</Scroller>

<section class="container">
	<div class="row align-items-center" style='height: {innerHeight}px'>
		<div class="hero">
			<figure class="ws-hero ws-hero-quote ws-hero-cyan ws-hero-sm ws-impact-quote text-serif">
				<blockquote class="h2">“I could see in their life, how I saw in my own, that there are people who
					perhaps
					wouldn’t usually have the opportunity to learn a profession and transform their lives, having their
					lives transformed because they were selected to train for the WorldSkills.”</blockquote>
				<figcaption>
					<div class="ws-hero-desc">
						<p>— Leo Rodrigues, WorldSkills Champion</p>
					</div>
				</figcaption>
			</figure>
		</div>
	</div>
</section>

<Scroller top="{0}" bottom="{1}" bind:id={id['fourth_images']} bind:count bind:index bind:offset bind:progress
	{threshold}>
	<div slot="background" class="bg-full-image bg-animate" style="{style['fourth']}" class:fadein>

		{#if bgtext['fourth']}
		<div class="container">
			<div class="row align-items-center" style='height: {innerHeight}px'>
				<div class="col-sm order-sm-2">
					{@html bgtext['fourth']}
				</div>
				<div class="col-sm d-none d-sm-block">

				</div>
			</div>
		</div>

		{/if}

	</div>

	<div slot="foreground">
		<section data-id="image_04_01">
			<div class="scroll-box ws-content">
				<p>
					Suddenly opportunities opened for Leo and he decided to start his own jewelry business — not an easy
					decision in the middle of an economic crisis. He had to quickly learn how to do everything in his
					business from accounting to marketing.
				</p>
			</div>
		</section>
		<section data-id="image_04_02">
			<div class="scroll-box ws-content">
				<p>
					The
					perseverance and determination he gained from training and competing with WorldSkills helped him
					secure his first client - the famous Brazilian haircare entrepreneur Zica Assis who also grew up in
					the favelas and could relate to the struggles Leo had overcome.
				</p>
			</div>
		</section>

		<section data-id="image_04_03">
			<div class="scroll-box ws-content">
				<p>
					Leo’s success has all come from that initial opportunity to train with WorldSkills. “I have been
					able to build a business and create more jobs in my community. I love that my skills overflow and
					bless the lives of other people.” One of these people who have been inspired by Leo is his own
					sister Larissa, who is also a jeweler, and training to try and win gold at WorldSkills Brazil. “She
					saw my story; she saw my pathway.”
				</p>
			</div>
		</section>

	</div>
</Scroller>

<section style="height: {innerHeight}px; background-image: url(' img/Sky_Frame.jpeg');" class="bg-full-image">
	<div class="container" style="height: {innerHeight}px;">
		<div class="row h-100">
			<div class="hero align-self-center">
				<h2 class='white lh-title text-serif'><span class='pink'>The Impact?</span> WorldSkills reaches
					young
					people
					who
					might not have equal access to education and training and shows them what’s possible through
					skills.
					Through
					training, competitions, and its global network, WorldSkills helps young people be more
					ambitious and unlock opportunities to excel.</h2>
			</div>
			<section style="height: {innerHeight}px; background-image: url(' img/Sky_Frame.jpeg');"
				class="bg-full-image d-flex">
				<div class="container my-auto" style="height: {innerHeight}px;">
					<div class=" row align-items-center justify-content-center">
						<div class="hero">
							<h2 class='white lh-title text-serif'><span class='pink'>The Impact?</span> WorldSkills
								reaches young
								people
								who
								might not have equal access to education and training and shows them what’s possible
								through skills.
								Through
								training, competitions, and its global network, WorldSkills helps young people be more
								ambitious and unlock opportunities to excel.</h2>
						</div>
					</div>
			</section>

			<!-- <Scroller top="{0}" bottom="{1}" bind:count bind:index bind:offset bind:progress {threshold}>
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
</Scroller> -->