<template>
    <v-app>
        <app-modal></app-modal>
        <app-overlay></app-overlay>
        <app-memberaddinfo></app-memberaddinfo>
        <router-view/>
    </v-app>
</template>

<script>
	import Modal from './common/Modal'
    import AppMemberAddInfo from './common/AppMemberAddInfo'
    import Overlay from './common/Overlay'
	export default {
		name: 'App',
		components: {
			'app-modal': Modal,
			'app-memberaddinfo':AppMemberAddInfo,
            'app-overlay':Overlay
		},
		data: () => ({
			//
		}),
	};
</script>
<style>
    @font-face {
        font-family: NanumGothic;
        src: url(./assets/fonts/NanumGothic/NanumGothic-Regular.ttf) format("embededed-opentype");
        font-style: normal;
    }

    html, body {
        margin: 0;
        font-family: NanumGothic, sans-serif;
        padding: 0;
    }

    div, td, th, span, h1, h2, h3, h4, a, li {
        font-family: NanumGothic, sans-serif;
    }
    ul {
        list-style: none;
        padding:0;
        margin:0;
    }
</style>
<style lang="scss">
    @import "./assets/fontawesome/css/all.css";

    @font-face {
        font-family: NanumGothic;
        src: url(./assets/fonts/NanumGothic/NanumGothic-Regular.ttf) format("embededed-opentype");
        font-style: normal;
    }

    html, body {
        margin: 0;
        font-family: NanumGothic, sans-serif;
        padding: 0;
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

    .dialog-layout {
        width: 900px;
        max-width: 900px;
        background: #fff;
        border-radius:10px;
        .header-box {
            border-radius:10px 10px 0 0;
            border-bottom:solid 1px #dcdcdc;
            width: 100%;
            text-align: center;
            position: relative;
            line-height: 60px;
            height: 60px;
            font-weight: bold;
            color: #000;
            font-size: 18pt;
            background: #fafafa;
            i {
                position: absolute;
                top: 20px;
                right: 20px;
                cursor: pointer;
            }
        }
        .message-box {
            padding:30px;
            height:500px;
            font-size:11pt;
            line-height:70%;
            overflow-y:auto;
        }
        .footer-box {
            border-radius:0 0 10px 10px;
            border-top:solid 1px #dcdcdc;
            width: 100%;
            background: #fafafa;
            line-height: 60px;
            height: 60px;
            text-align:right;
            padding-right:40px;

        }

    }
</style>
