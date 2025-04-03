<template>
    <div class="page-contents">
        <goodsListComponent mtype="admin"></goodsListComponent>
    </div>
</template>


<script>
	import goodsListComponent from '../../admin/shop/components/goodsListComponent';
	export default {
		name: 'shopAdminGoodsList',
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
