<template>
    <div class="page-contents">
        <shopCategoryComponent></shopCategoryComponent>
    </div>
</template>


<script>
	import shopCategoryComponent from '../../admin/shop/components/categoryComponent';

	export default {
		name: 'shopAdminCategory',
		components: {
			shopCategoryComponent
		},
		data() {
			return {
			}
		},
		created() {

		},


	}
</script>