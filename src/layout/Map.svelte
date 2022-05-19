<script>
    import { onMount } from 'svelte';
    import mapbox from 'mapbox-gl';

    export let location = {
        lon: -49.6657512,
        lat: -15.1054913,
        zoom: 3,
        pitch: 0,
        bearing: 0
    };

    export let map;

    let container;
    let options;


    if (location.lon && location.lat) {
        options = {
            center: [location.lon, location.lat]
        }
        if (location.zoom) {
            options.zoom = location.zoom;
        }
    };

    onMount(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.8.2/mapbox-gl.css';

        link.onload = () => {
            mapbox.accessToken = 'pk.eyJ1IjoiaXBwZiIsImEiOiJjbDMwYmV3YW4waWQ4M2ptdWZxanN4cTV6In0.3cbYcSbeRKB--M9vvoYNPQ';
            map = new mapbox.Map({
                container,
                style: 'mapbox://styles/mapbox/streets-v11',
                interactive: false,
                ...options
            });
            map.scrollZoom.disable();
        };


        document.head.appendChild(link);

        return () => {
            map.remove();
            link.parentNode.removeChild(link);
        };
    });
</script>

<style>
    div {
        width: 100%;
        height: 100%;
    }

    /* Fix issue on mobile browser where scroll breaks  */
    .mapboxgl-canvas-container.mapboxgl-touch-zoom-rotate.mapboxgl-touch-drag-pan,
    .mapboxgl-canvas-container.mapboxgl-touch-zoom-rotate.mapboxgl-touch-drag-pan .mapboxgl-canvas {
        touch-action: unset;
    }
</style>

<div bind:this={container}>
    {#if map}
    <slot></slot>
    {/if}
</div>