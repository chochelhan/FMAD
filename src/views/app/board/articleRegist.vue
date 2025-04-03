<template>
    <div class="board-container">
       <articleRegist :bid="bid" :no="no"  :isAdmin="isAdmin"></articleRegist>
    </div>
</template>


<script>
	import articleRegist from '../../../components/board/duckkuArticleRegist'

	export default {
		name: 'userArticleRegist',
		components: {
			articleRegist,
		},
		data() {
			return {
				bid:'',
				no: 'new',
                isAdmin:'',
			}
		},
		created() {

			this.bid = this.$route.params.bid;
		},
		methods: {

		}

	}
</script>
<style lang="scss">
    .board-container {
        padding:40px;
        background:#fff;
        min-height:calc(100vh);
        .stitle {
            font-size: 17pt;
            font-weight: bold;
            padding: 0 0 10px 0;
            color: #686EFB;
            border-bottom:solid 1px #dcdcdc;
            span {
                padding-bottom:13px;
                border-bottom:solid 2px #686EFB;
            }
        }

    }
</style>