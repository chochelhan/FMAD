<template>
    <div class="page-contents">
        <goodsListComponent mtype="shop"></goodsListComponent>
    </div>
</template>


<script>
	import goodsListComponent from '../../admin/shop/components/goodsListComponent';
	export default {
		name: 'shopManagerGoodsList',
		components: {
			goodsListComponent
		},
		data() {
			return {
			}
		},
		created() {
		},


	}
</script>
