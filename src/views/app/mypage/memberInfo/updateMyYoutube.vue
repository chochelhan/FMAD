<template>
    <div class="member-container">

        <div :class="'contents '+mobileClass">
            <div class="from-box">
                <ul class="field-icon-box">
                    <li @click="setMyPart('a')">
                        <div :class="'icon-box '+gclass.a">
                            <img src="../../../../assets/images/ico_f1.png">

                        </div>
                        <div class="text">뉴스/정치</div>
                    </li>
                    <li @click="setMyPart('b')">
                        <div :class="'icon-box '+gclass.b">
                            <img src="../../../../assets/images/ico_f2.png">

                        </div>
                        <div class="text">뷰티/패션</div>
                    </li>
                    <li @click="setMyPart('c')">
                        <div :class="'icon-box '+gclass.c">
                            <img src="../../../../assets/images/ico_f3.png">

                        </div>
                        <div class="text">코미디</div>
                    </li>

                </ul>
                <ul class="field-icon-box">
                    <li @click="setMyPart('d')">
                        <div :class="'icon-box '+gclass.d">
                            <img src="../../../../assets/images/ico_f4.png">
                        </div>
                        <div class="text">스포츠</div>
                    </li>
                    <li @click="setMyPart('e')">
                        <div :class="'icon-box '+gclass.e">
                            <img src="../../../../assets/images/ico_f5.png">
                        </div>
                        <div class="text">음악</div>
                    </li>
                    <li @click="setMyPart('f')">
                        <div :class="'icon-box '+gclass.f">
                            <img src="../../../../assets/images/ico_f6.png">
                        </div>
                        <div class="text">기술</div>
                    </li>
                </ul>
                <ul class="field-icon-box">
                    <li @click="setMyPart('g')">
                        <div :class="'icon-box '+gclass.g">
                            <img src="../../../../assets/images/ico_f7.png">
                        </div>
                        <div class="text">게임</div>
                    </li>
                    <li @click="setMyPart('h')">
                        <div :class="'icon-box '+gclass.h">
                            <img src="../../../../assets/images/ico_f8.png">
                        </div>
                        <div class="text">요리/건강</div>
                    </li>
                    <li @click="setMyPart('i')">

                        <div :class="'icon-box '+gclass.i">
                            <img src="../../../../assets/images/ico_f9.png">
                        </div>
                        <div class="text">영화/엔터테인먼트</div>
                    </li>

                </ul>


                <p>
                    <v-btn
                        @click="googleLogin()"
                        type="button"
                        class="submit-button"  style="background:#D44330;color:#fff;"
                    >
                        <i class="fab fa-youtube"></i> 유튜브로 인증
                    </v-btn>
                </p>


            </div>

        </div>

    </div>
</template>


<script>
	import AUTH from '../../../../api/auth'
	import {
		API_URL_MEMBER_YOUTUBER_CHECK,
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';

	export default {
		name: 'updateMyYoutube',
        props:["yType"],
		data() {
			return {
				insertFlag: false,
				youtubeType: '',
				gclass: {
					a: '',
					b: '',
					c: '',
					d: '',
					e: '',
					f: '',
					g: '',
					h: '',
					i: '',
				},
				mobileView: false,
				uid: '',
				mobileClass: '',
				clientId: '99231061866-ukek1eir01bi44st3al0h0o4soi1q2ne.apps.googleusercontent.com',
				redirectUrl: '',
				scope: 'https://www.googleapis.com/auth/youtube',

			}
		},
		created() {
			if (this.$isMobile()) {
				this.mobileView = true;
				this.mobileClass = 'mobile'
			}
			let protocol = window.location.protocol;
			let host = window.location.host;
			this.redirectUrl = 'https://www.fatmouse.co.kr/api/googleApi/redirect';
			this.youtubeType = this.yType;
			this.gclass[this.youtubeType] = 'active'
			let memberInfo = AUTH.getSession(this.$isMobile());
			if (memberInfo.AUTHTOKEN) {
				this.uid = memberInfo.uid;
			} else {

            }

		},
		methods: {
			setMyPart(type) {
				if (this.insertFlag) return;
				this.insertFlag = true;
				this.youtubeType = type;
				for (let key in this.gclass) {
					if (key == type) {
						this.gclass[key] = 'active';
					} else this.gclass[key] = '';
				}
				this.formSubmit()
			},
			googleLogin() {

				window.open('https://accounts.google.com/o/oauth2/v2/auth?client_id=' + this.clientId + '&redirect_uri=' + this.redirectUrl + '&state=' + this.uid + '&access_type=offline&approval_prompt=force&response_type=code&scope=' + this.scope, 'loginWin', 'top=30,left=100,width=400,height=500');


			},
			formSubmit() {
				sessionStorage.setItem('yType',this.youtubeType);

				const frm = new FormData()
				frm.append('yType', this.youtubeType)
				apiService.post(API_URL_MEMBER_YOUTUBER_CHECK, frm, (res) => {

					let result = res.result;
					let params = {}
					this.insertFlag = false;
					switch (result) {
						case 'fail':
							params = {
								message: '시스템 에러',
							};
							this.$eventBus.$emit('modalOpen', params);
							break;
						case 'succ':

							break;
					}
				})
			},
		},

	}
</script>
<style lang="scss" scoped>
    .member-container {
        width: 100%;
        background: #fff;
        padding: 0;
        .contents {
            width: 450px;
            margin: auto;
            padding: 40px 0 80px 0;
            text-align: center;
            .submit-button {
                margin: 50px auto 0 auto;
                width: 400px;
                border-radius: 0;
                min-height: 70px;
                font-size: 12pt;
                i {
                    margin-right:10px;
                }
            }

            .field-icon-box {
                padding: 0;
                width: 100%;
                margin: 0 0 40px 0;
                display: flex;
                justify-content: space-between;
                li {
                    .icon-box {
                        width: 110px;
                        height: 110px;
                        background: #DCDCDC;
                        border-radius: 50%;
                        text-align: center;
                        line-height: 130px;
                        cursor: pointer;
                        img {

                        }
                        &.active {
                            background: #686EFB;
                        }
                    }
                    .text {
                        margin-top:10px;
                    }

                }
            }

            &.mobile {
                width: 100%;
                padding:0;
                .submit-button {
                    margin: 30px auto 0 auto;
                    width:100%;
                    border-radius: 0;
                    min-height:50px;
                    font-size: 10pt;
                }
                .field-icon-box {
                    padding: 0;
                    width: 100%;
                    margin: 0 0 20px 0;
                    display: flex;
                    justify-content: space-between;
                    li {
                        .icon-box {
                            width:80px;
                            height: 80px;
                            background: #DCDCDC;
                            border-radius: 50%;
                            text-align: center;
                            line-height: 100px;
                            cursor: pointer;
                            img {

                            }
                            &.active {
                                background: #686EFB;
                            }
                        }
                        .text {
                            width:80px;
                            margin-top:10px;
                            font-size:9pt;
                        }

                    }
                }
            }

        }

    }


</style>
