<template>
    <div class="page-container">

        <div v-if="mobileView" class="top-menu-bar">
            <div class="top-menu-bar-content">
                <div class="back-button" @click="$router.go(-1)">
                    <i class="fas fa-chevron-left"></i>
                </div>
                <span class="m-title">{{agreeTitle}}</span>
            </div>
        </div>
        <div :class="'contents '+mobileClass">
            <div class="from-box">

                <div v-if="!mobileView" class="stitle">{{agreeTitle}}</div>
                <div class="message-box">
                    <div class="message-content" v-html="agreeContent"></div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>

	import SITECONFIG from '../../../api/siteConfig';
	export default {
		name: 'Agree',
		watch: {
            '$route'(to, from) {
	            this.showAgree(this.$route.params.cmd)
			}
		},
		data() {
			return {
				agreeTitle: '',
				agreeContent: '',
                agreeInfo:{},

			}
		},
		created() {
			if (SITECONFIG.memberServer) {

				this.setConfig();
			} else {
				this.configInterval = setInterval(() => {
					if (SITECONFIG.memberServer) {
						this.setConfig();
						clearInterval(this.configInterval);
					}
				}, 200)
			}
			if (this.$isMobile()) {
				this.mobileView = true;
				this.mobileClass = 'mobile'
			}

		},
		destroyed() {
			if (this.configInterval) {
				clearInterval(this.configInterval);
			}
		},
		methods: {
			setConfig() {
				let config = SITECONFIG.getMemberConfig();
				if (config.agree) {
					this.agreeInfo['agree'] = config.agree
				}
				if (config.privacy) {
					this.agreeInfo['privacy'] = config.privacy
				}

				this.showAgree(this.$route.params.cmd)
			},
			showAgree(cmd) {
				switch (cmd) {
					case 'agree':
						this.agreeTitle = '이용약관';
						break;
					case 'privacy':
						this.agreeTitle = '개인정보 처리방침';
						break;
				}
				this.agreeContent = this.agreeInfo[cmd];

			}
		}

	}
</script>
<style lang="scss" scoped>
    .page-container {
        width: 100%;
        min-height: calc(100vh);
        background: #fff;
        .contents {
            width: 900px;
            margin: auto;
            padding: 30px 0 80px 0;

            .stitle {
                font-size:16pt;
                color:#000;
                font-weight:bold;
                margin:20px 0;
            }
            .message-box {
                border:solid 1px #dcdcdc;
                height:calc(100vh - 190px);
                overflow-y:auto;
                width:100%;
                padding:30px;
                font-size:10pt;
                .message-content {
                    line-height:130%;

                }
            }
            &.mobile {
                width: 100%;
                padding: 70px 20px 100px 20px;
                width: auto;
                .space {
                    height: 20px;
                }
                .submit-button {
                    position: fixed;
                    bottom: 0;
                    width: calc(100vw);
                    margin-left: -20px;
                    border-radius: 0;
                }
                .tab {
                    width: calc(100vw);
                    margin-left: -20px;

                    li {
                        font-size: 12pt;
                    }
                }

            }

        }

    }


</style>