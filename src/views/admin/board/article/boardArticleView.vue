<template>
    <div>

       <articleView :no="no" :isAdmin="isAdmin"></articleView>
    </div>
</template>


<script>
	import articleView from '../../../../components/board/articleView'

	export default {
		name: 'boardArticleView',
		components: {
			articleView,
		},
		data() {
			return {
				no: '',
                isAdmin:'admin',


			}
		},
		created() {

			this.no = this.$route.params.no;
		},
		methods: {

		}

	}
</script>
