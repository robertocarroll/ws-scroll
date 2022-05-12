<script>

    export let bgimage = null;

    let style = '';

    if (bgimage) {
        style += `background-image: url(${bgimage});`;
    } else {
        style += 'background-image: none;';
    }

</script>

<header style="{style}">
    <div class="hero ws-neg-margin">
        <div class="center">
            <slot></slot>
        </div>
    </div>
</header>