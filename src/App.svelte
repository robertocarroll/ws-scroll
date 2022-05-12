<script>
	import { onMount } from "svelte";
	import Scroller from "./layout/Scroller.svelte";
	//import Scroller from '@sveltejs/svelte-scroller';
	import Header from "./layout/Header.svelte";

	import { Map, MapSource, MapLayer, MapTooltip } from "@onsvisual/svelte-maps";

	let index, offset, progress, count;
	let innerHeight;
	let bgimage = "img/Rail_Technology3.jpg";
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

	// Constants
	const datasets = ["region", "district"];
	const topojson = "./data/geo_lad2021.json";
	const mapstyle = "https://bothness.github.io/ons-basemaps/data/style-omt.json";
	const mapbounds = {
		uk: [
			[-9, 49],
			[2, 61]
		]
	};
	// Data
	let data = { district: {}, region: {} };
	let metadata = { district: {}, region: {} };
	let geojson;
	// Element bindings
	let map = null; // Bound to mapbox 'map' instance once initialised
	// State
	let hovered; // Hovered district (chart or map)
	let selected; // Selected district (chart or map)
	$: region = selected && metadata.district.lookup ? metadata.district.lookup[selected].parent : null; // Gets region code for 'selected'
	$: chartHighlighted = metadata.district.array && region ? metadata.district.array.filter(d => d.parent == region).map(d => d.code) : []; // Array of district codes in 'region'
	let mapHighlighted = []; // Highlighted district (map only)
	let xKey = "area"; // xKey for scatter chart
	let yKey = null; // yKey for scatter chart
	let zKey = null; // zKey (color) for scatter chart
	let rKey = null; // rKey (radius) for scatter chart
	let mapKey = "density"; // Key for data to be displayed on map
	let explore = false; // Allows chart/map interactivity to be toggled on/off


	// Actions for Scroller components
	const actions = {
		first_images: { // Actions for <Scroller/> with id="first-images"
			image01: () => { // Action for <section/> with data-id="image01"
				style = "";
				bgimage = "img/Rail_Technology3.jpg";
				console.log("first function firing");
				style = `background-image: url(${bgimage});
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
		},
		second_images: { // Actions for <Scroller/> with id="first-images"
			image01: () => { // Action for <section/> with data-id="image01"
				style = "";
				bgimage = "img/WS_Impact_Illustrated_Set01.jpg";
				console.log("first function firing");
				style = `background-image: url(${bgimage});
		height: ${innerHeight}px;`;
			},

			image02: () => { // Action for <section/> with data-id="image02"
				style = "";
				bgimage = "img/WS_Impact_Illustrated_Set02.jpg";
				style = `background-image: url(${bgimage});
		height: ${innerHeight}px;`;
				console.log("second function firing");

			},

			image03: () => { // Action for <section/> with data-id="image03"
				bgimage = "img/WS_Impact_Illustrated_Set03.jpg";
				style = `background-image: url(${bgimage});
		height: ${innerHeight}px;`;
				console.log("third function firing");
			},

			image03: () => { // Action for <section/> with data-id="image03"
				bgimage = "img/WS_Impact_Illustrated_Set04.jpg";
				style = `background-image: url(${bgimage});
		height: ${innerHeight}px;`;
				console.log("third function firing");
			},
			map: { // Actions for <Scroller/> with id="map"
				map01: () => { // Action for <section/> with data-id="map01"
					fitBounds(mapbounds.uk);
					mapKey = "density";
					mapHighlighted = [];
					explore = false;
				},
				map02: () => {
					fitBounds(mapbounds.uk);
					mapKey = "age_med";
					mapHighlighted = [];
					explore = false;
				},
				map03: () => {
					let hl = [...data.district.indicators].sort((a, b) => b.age_med - a.age_med)[0];
					fitById(hl.code);
					mapKey = "age_med";
					mapHighlighted = [hl.code];
					explore = false;
				},
				map04: () => {
					fitBounds(mapbounds.uk);
					mapKey = "age_med";
					mapHighlighted = [];
					explore = true;
				}
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


	datasets.forEach(geo => {
		getData(`./data/data_${geo}.csv`)
			.then(arr => {
				let meta = arr.map(d => ({
					code: d.code,
					name: d.name,
					parent: d.parent ? d.parent : null
				}));
				let lookup = {};
				meta.forEach(d => {
					lookup[d.code] = d;
				});
				metadata[geo].array = meta;
				metadata[geo].lookup = lookup;
				let indicators = arr.map((d, i) => ({
					...meta[i],
					area: d.area,
					pop: d['2020'],
					density: d.density,
					age_med: d.age_med
				}));
				if (geo == "district") {
					['density', 'age_med'].forEach(key => {
						let values = indicators.map(d => d[key]).sort((a, b) => a - b);
						let breaks = getBreaks(values);
						indicators.forEach((d, i) => indicators[i][key + '_color'] = getColor(d[key], breaks, colors.seq));
					});
				}
				data[geo].indicators = indicators;
				let years = [
					2001, 2002, 2003, 2004, 2005,
					2006, 2007, 2008, 2009, 2010,
					2011, 2012, 2013, 2014, 2015,
					2016, 2017, 2018, 2019, 2020
				];
				let timeseries = [];
				arr.forEach(d => {
					years.forEach(year => {
						timeseries.push({
							code: d.code,
							name: d.name,
							value: d[year],
							year
						});
					});
				});
				data[geo].timeseries = timeseries;
			});
	});
	getTopo(topojson, 'geog')
		.then(geo => {
			geo.features.sort((a, b) => a.properties.AREANM.localeCompare(b.properties.AREANM));
			geojson = geo;
		});

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
	<div slot="background" class="bg-full-image" style="{style}">
		<p>current section: <strong>{index + 1}/{count}</strong></p>
		<progress value="{count ? (index + 1) / count : 0}"></progress>

		<p>offset in current section</p>
		<progress value={offset || 0}></progress>

		<p>total progress</p>
		<progress value={progress || 0}></progress>
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


<Scroller top="{0}" bottom="{1}" bind:id={id['second_images']} bind:count bind:index bind:offset bind:progress
	{threshold}>
	<div slot="background" class="bg-full-image" style="{style}">
		<p>current section: <strong>{index + 1}/{count}</strong></p>
		<progress value="{count ? (index + 1) / count : 0}"></progress>

		<p>offset in current section</p>
		<progress value={offset || 0}></progress>

		<p>total progress</p>
		<progress value={progress || 0}></progress>
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

{#if geojson && data.district.indicators}
<Scroller {threshold} bind:id={id['map']}>
	<div slot="background">
		<figure>
			<div class="col-full height-full">
				<Map style={mapstyle} bind:map interactive={false} location={{bounds: mapbounds.uk}}>
					<MapSource id="lad" type="geojson" data={geojson} promoteId="AREACD" maxzoom={13}>
						<MapLayer id="lad-fill" idKey="code" colorKey={mapKey + "_color" }
							data={data.district.indicators} type="fill" select {selected} on:select={doSelect}
							clickIgnore={!explore} hover {hovered} on:hover={doHover} highlight
							highlighted={mapHighlighted} paint={{ 'fill-color' : ['case', ['!=', ['
							feature-state', 'color' ], null], ['feature-state', 'color' ], 'rgba(255, 255, 255, 0)'
							], 'fill-opacity' : 0.7 }}>
							<MapTooltip content={ hovered ? `${metadata.district.lookup[hovered].name}<br />
							<strong>${data.district.indicators.find(d => d.code == hovered)[mapKey].toLocaleString()}
								${units[mapKey]}</strong>` : ''
							}/>
						</MapLayer>
						<MapLayer id="lad-line" type="line" paint={{ 'line-color' : ['case', ['==', ['
							feature-state', 'hovered' ], true], 'orange' , ['==', [' feature-state', 'selected' ],
							true], 'black' , ['==', [' feature-state', 'highlighted' ], true], 'black'
							, 'rgba(255,255,255,0)' ], 'line-width' : 2 }} />
					</MapSource>
				</Map>
			</div>
		</figure>
	</div>

	<div slot="foreground">
		<section data-id="map01">
			<div class="col-medium">
				<p>
					This map shows <strong>population density</strong> by district. Districts are coloured from <Em
						color={colors.seq[0]}>least dense</Em> to <Em color={colors.seq[4]}>most dense</Em>. You can
					hover to see the district name and density.
				</p>
			</div>
		</section>
		<section data-id="map02">
			<div class="col-medium">
				<p>
					The map now shows <strong>median age</strong>, from <Em color={colors.seq[0]}>youngest</Em> to <Em
						color={colors.seq[4]}>oldest</Em>.
				</p>
			</div>
		</section>
		<section data-id="map03">
			<div class="col-medium">
				<!-- This gets the data object for the district with the oldest median age -->
				{#each [[...data.district.indicators].sort((a, b) => b.age_med - a.age_med)[0]] as district}
				<p>
					The map is now zoomed on <Em color={district.age_med_color}>{district.name}</Em>, the district with
					the oldest median age, {district.age_med} years.
				</p>
				{/each}
			</div>
		</section>
		<section data-id="map04">
			<div class="col-medium">
				<h3>Select a district</h3>
				<p>Use the selection box below or click on the map to select and zoom to a district.</p>
				{#if geojson}
				<p>
					<!-- svelte-ignore a11y-no-onchange -->
					<select bind:value={selected} on:change={()=> fitById(selected)}>
						<option value={null}>Select one</option>
						{#each geojson.features as place}
						<option value={place.properties.AREACD}>
							{place.properties.AREANM}
						</option>
						{/each}
					</select>
				</p>
				{/if}
			</div>
		</section>
	</div>
</Scroller>
{/if}