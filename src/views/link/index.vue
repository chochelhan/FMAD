<template>
    <div>
        <defaultLayout v-if="defaultLayoutShow"></defaultLayout>
        <mobileLayout v-else-if="mobileLayoutShow"></mobileLayout>


    </div>
</template>

<script>
	import defaultLayout from './layout/linkDefaultLayout';
	import mobileLayout from './layout/linkMobileLayout';
	import AUTH from '../../api/auth'

	export default {
		components: {
			defaultLayout,
			mobileLayout,

		},
		data() {
			return {
				defaultLayoutShow: true,
				mobileLayoutShow: false,
			};
		},
		created() {
			AUTH.setDevice(this.$isMobile());
            this.setLayout()

		},
		methods: {
			setLayout() {
			 	this.defaultLayoutShow = false;
				this.mobileLayoutShow = false;
				if (!this.$isMobile()) {
					this.defaultLayoutShow = true;
				} else this.mobileLayoutShow = true;

			},
		},


	}
</script>
<style lang="scss" scoped="true">

</style>
<style lang="scss">
    @font-face {
        font-family: NanumGothic;
        src: url(../../assets/fonts/NanumGothic/NanumGothic-Regular.ttf) format("embededed-opentype");
        font-style: normal;
    }
    html, body {
        background: #ffffff;
    }
    div, td, th, span, h1, h2, h3, h4, a, li {
        font-family: NanumGothic, sans-serif;
    }
    ul {
        list-style: none;
        padding:0;
        margin:0;
        li {
            padding:0;
            margin:0;
            font-family: NanumGothic, sans-serif;
        }
    }


</style>
