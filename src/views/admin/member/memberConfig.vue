<template>
    <div class="page-contents">
        <div class="tab-form-box">
            <v-tabs>
                <!--v-tab class="tab-item">회원가입등록폼</v-tab-->
                <!--v-tab class="tab-item">SNS 로그인</v-tab-->
                <!--v-tab-- class="tab-item">회원등급</v-tab-->
                <v-tab class="tab-item">이용약관</v-tab>
                <v-tab class="tab-item">개인정보처리방침</v-tab>
                <v-tab class="tab-item">개인정보위탁동의</v-tab>
                <v-tab class="tab-item">개인정보제3자제공</v-tab>
                <!--v-tab-item>
                    <div class="tab-form-item">
                        <JOINCFG></JOINCFG>
                    </div>
                </v-tab-item-->
                <!--v-tab-item>
                    <div class="tab-form-item">
                        <SNSCFG></SNSCFG>
                    </div>
                </v-tab-item>
                <v-tab-item>
                    <div class="tab-form-item">
                        <LEVELCFG></LEVELCFG>
                    </div>
                </v-tab-item-->
                <v-tab-item>
                    <div class="tab-form-item">
                        <AGRCFG></AGRCFG>
                    </div>
                </v-tab-item>
                <v-tab-item>
                    <div class="tab-form-item">
                        <PRVCFG></PRVCFG>
                    </div>
                </v-tab-item>
                <v-tab-item>
                    <div class="tab-form-item">
                        <AGRA></AGRA>
                    </div>
                </v-tab-item>
                <v-tab-item>
                    <div class="tab-form-item">
                        <AGRB></AGRB>
                    </div>
                </v-tab-item>
            </v-tabs>
        </div>

    </div>
</template>


<script>
	//import JOINCFG from './config/joincfg';
	//import SNSCFG from './config/snscfg';
	import AGRCFG from './config/agrcfg';
	import PRVCFG from './config/prvcfg';
	import AGRA from './config/agrA';
	import AGRB from './config/agrB';
	//import LEVELCFG from './config/levcfg';

	export default {
		name: 'memberConfig',
		components: {
			//JOINCFG,
			//SNSCFG,
			//LEVELCFG,
			AGRCFG,
			PRVCFG,
            AGRA,
            AGRB
		},
		data() {
			return {}
		},
		created() {
		},
		methods: {},

	}
</script>
<style lang="scss" scoped="true">
    .page-contents {
    }

    .tab-form-box {
        padding: 0;
        width: 900px;
        min-height: 500px;
        margin: 0;
        .tab-item {
            border-bottom: solid 2px #ccc;
            width: 33.33%;
            color: #000;
            font-weight: bold;
            font-size: 11pt;
            margin: 0;
        }
        .tab-form-item {
            padding: 50px 20px;
            width: auto;
        }
    }

</style>
