<template>
	<div class="page-container">
		<boardView v-if="pageView=='board'" :access="'chatArticle'" :propNo="no"></boardView>
		<photoView v-else-if="pageView=='photo'" :access="'chatArticle'"></photoView>
		<detailView v-else-if="pageView=='home'" :access="'chatArticle'"></detailView>
		<meetView v-else-if="pageView=='meet'" :access="'chatArticle'" :propGno="gno" :propNo="no"></meetView>
	</div>
</template>

<script>
import detailView from '../Game/page/detail'
import boardView from './BoardView.vue'
import photoView from './PhotoView.vue'
import meetView from './Meet.vue'

export default {
	name: 'GuildChatArticleDetail',
	components: {
		detailView,
		boardView,
		photoView,
		meetView
	},
	data() {
		return {
			gno:'',
			no:'',
			pageView:'',
		}
	},
	created() {
		this.pageView = this.$route.params.gtype
		this.no = this.$route.params.no
		this.gno = this.$route.params.gno
	},
    methods: {
		
		
		
    }

}
</script>

<style lang="scss" scoped>
.page-container {
	top:0;
	height:calc(100vh);
	overflow-x:hidden;
	overflow-y:auto;
}
</style>