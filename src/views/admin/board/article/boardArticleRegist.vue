<template>
    <div>
       <articleRegist :no="no" :bid="bid" :isAdmin="isAdmin"></articleRegist>
    </div>
</template>


<script>
	import articleRegist from '../../../../components/board/articleRegist'

	export default {
		name: 'boardArticleRegist',
		components: {
			articleRegist,
		},
		data() {
			return {
				no: '',
                bid:'',
                isAdmin:'admin',


			}
		},
		created() {

			this.bid = this.$route.params.bid;
			this.no = this.$route.params.no;
		},
		methods: {

		}

	}
</script>
