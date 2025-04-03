<template>
    <div class="board-container">
       <articleView :no="no"  :isAdmin="isAdmin"></articleView>
    </div>
</template>


<script>
	import articleView from '../../../components/board/duckkuArticleView'

	export default {
		name: 'userArticleView',
		components: {
			articleView,
		},
		data() {
			return {
				no: '',
                isAdmin:'',
			}
		},
		created() {

			this.no = this.$route.params.no;
		},
		methods: {

		}

	}
</script>
<style lang="scss">
    .board-container {
        padding: 40px;
        background: #fff;
        min-height: calc(100vh);
        .stitle {
            font-size: 17pt;
            font-weight: bold;
            padding: 0 0 10px 0;
            color: #686EFB;
            border-bottom: solid 1px #dcdcdc;
            span {
                padding-bottom: 13px;
                border-bottom: solid 2px #686EFB;
            }
        }
    }
</style>