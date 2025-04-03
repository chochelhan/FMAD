<template>
	<div class="page-container" >
		<div class="md-toolbar">
			<div class="md-toolbar-row">
				<div class="md-toolbar-section-start">
					<md-button class="md-icon-button" @click="$router.go(-1)">
						<i class="fas fa-chevron-left" style='color:#fff;'></i>
					</md-button>
				</div>
			</div>	
		</div>
		<div class="data-layout">
			<iframe  class="iframeView" :src="'https://www.youtube.com/embed/'+vid" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
			
		</div>
		
    </div>
</template>
<script>
export default {
	name: 'GuildChatVideo',
	data() {
		return {
			vid:'',
		}
	},
	created() {
	
		this.vid = this.$route.params.vid;
	},
    methods: {
		
    },
	mounted() {
		
		
	},	
	updated() {
		
	}
}
</script>

<style lang="scss" scoped>
.page-container {
	padding:0;
	margin:0;
	height:calc(100vh);
	position:relative;
	top:0;
	background:#000;
	.data-layout {
		margin-top:50px;
		width:100%;
		.iframeView {
			width:calc(100vw);
			height:400px;
		}
	}
	
}
</style>
