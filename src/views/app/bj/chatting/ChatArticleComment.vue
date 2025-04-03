<template>
	<div>
		<guildBoardRepleView v-if="repleView=='board'" :propParent="parent" :propParentNo="no"></guildBoardRepleView>
		<guildWriteComment v-if="repleView=='home'"  :propParent="parent" :propParentNo="gno"  :propRno="no"></guildWriteComment>
	</div>
</template>

<script>
import guildBoardRepleView from './GuildBoardRepleView.vue'
import guildWriteComment from '../Game/page/comment.vue'

export default {
	name: 'GuildChatArticleComment',
	components: {
		guildBoardRepleView,
		guildWriteComment
	},
	data() {
		return {
			repleView:'',
			gno:'',
			no:'',
			parent:'',

		}
	},
	created() {
	
		this.parent = this.$route.params.gtype;
		switch(this.parent) {
			case 'gldbrd':
			case 'gldpho':
				this.repleView = 'board';		
			break;
			default:
				this.repleView = 'home';	
			break;
		}
		this.gno = this.$route.params.gno;
		this.no = this.$route.params.no;
		
	},
    methods: {
		
		
    }

}
</script>

<style lang="scss" scoped>

</style>