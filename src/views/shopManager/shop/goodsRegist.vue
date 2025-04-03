<template>
    <div class="page-contents">
        <goodsRegistComponent :no="no"></goodsRegistComponent>
    </div>
</template>


<script>
	import goodsRegistComponent from '../../admin/shop/components/goodsRegistComponent';
	export default {
		name: 'shopManagerGoodsRegist',
		components: {
			goodsRegistComponent
		},
		data() {
			return {
		        no:'',
			}
		},
		created() {
            this.no = this.$route.params.no;
		},


	}
</script>
