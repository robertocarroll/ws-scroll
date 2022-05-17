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

<style>

header {
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	height: 500px;
	height: 100vh;
	-webkit-box-pack: center;
	-ms-flex-pack: center;
	justify-content: center;
	background-position: 50% 50%;
	background-repeat: no-repeat;
	background-size: cover;
	flex-direction: column;
}

.hero {
	text-align: center;
	padding: 4.5rem 40px 5.5rem;
}

</style>
