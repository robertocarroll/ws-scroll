<script>
    import { onMount } from 'svelte';
    import mapbox from 'mapbox-gl';

    export let location = {
        bounds: [[-5.816, 49.864], [1.863, 55.872]] // England & Wales bounding box
    };
    export let style;
    export let map;

    let container;
    let options;


    if (location.bounds) {
        options = { bounds: location.bounds };
    } else if (location.lon && location.lat) {
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
</style>

<div bind:this={container}>
    {#if map}
    <slot></slot>
    {/if}
</div>