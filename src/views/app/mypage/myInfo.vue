<template>
    <div class="mypage-container">
        <div :class="'contents '+mobileClass">

            <div v-if="!mobileView" class="stitle">
                <span>회원정보 변경</span>
            </div>
            <div class="title-desc" v-if="!mobileView">회원정보를 변경합니다.</div>
            <div class="member-set">
                <ul :class="'tab '+mobileFTab" v-if="!myMenuHidden">
                    <li v-for="mnu in myMenus" :class="mnu.gclass" :key="mnu.code" @click="showMyInfo(mnu.code)">
                        {{mnu.name}}
                    </li>
                </ul>
                <updateMyInfo :memberInfo="memberInfo" @updateInfo="getMemberInfo" v-if="myinfoView.info"></updateMyInfo>
                <updateMyPass v-else-if="myinfoView.pass"></updateMyPass>
                <updateMyYoutube :yType="yType" v-else-if="myinfoView.youtube"></updateMyYoutube>
                <updateBank  v-else-if="myinfoView.bank"></updateBank>

            </div>
        </div>
    </div>
</template>


<script>
	import AUTH from '../../../api/auth'
	import updateMyInfo from './memberInfo/updateMyInfo'
	import updateMyPass from './memberInfo/updateMyPass'
	import updateMyYoutube from './memberInfo/updateMyYoutube'
	import updateBank from './memberInfo/updateBank'
	import {
		API_URL_MEMBER_INFO
	} from '../../../api/urls';
	import apiService from '../../../api/apiService';
    import {mapActions} from "vuex";

	export default {
		name: 'myInfo',
		components: {
			updateMyInfo,
			updateMyPass,
			updateMyYoutube,
			updateBank
		},
		data() {
			return {
				mobileView: false,
				mobileClass: '',
				myMenus: [],
				mtype: '',
				myinfoView: {
					info: false,
					pass: false,
					youtube: false,
					bank: false,
				},
				memberInfo:{},
				yType:'',
				myMenuHidden:false,
                mobileFTab:'',
			}
		},
		created() {
			let memberInfo = AUTH.getSession(this.$isMobile());
			if (!memberInfo.AUTHTOKEN) {
				this.$router.push({path: '/'});
				return;
			}

			this.mtype = memberInfo.mtype;
			if (this.$isMobile()) {
                this.setClass('sub')
                this.setTitle('회원정보 변경');
                this.setBackUrl('');
				this.mobileView = true;
				this.mobileClass = 'mobile'
			}
			this.getMemberInfo();

		},
		methods: {
            ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
			getMemberInfo() {
				const frm = new FormData()
				apiService.post(API_URL_MEMBER_INFO, frm, (res) => {
					this.memberInfo = res.memberInfo;
					this.yType = res.memberInfo.yType;
					this.setMyMenus();
					this.myinfoView.info = true;
				})
			},
			setMyMenus() {
				this.myMenus = [
					{name: '개인정보 변경', code: 'info', gclass: 'active'},
              	];

				if(!this.memberInfo.sns) {
					this.myMenus.push({name: '비밀번호 변경', code: 'pass', gclass: ''});
                }
				if (this.mtype == 'shop') {
					this.myMenus.push({name: '유튜버 인증', code: 'youtube', gclass: ''})
				}
				if(this.myMenus.length<2) {
				    this.myMenuHidden = true;
                } else if(this.myMenus.length==4) {
                    this.mobileFTab = 'mobileFtab'
                }


			},
			showMyInfo(code) {
				for (let mnu of this.myMenus) {
					if (code == mnu.code) {
						mnu.gclass = 'active'
						this.myinfoView[mnu.code] = true;
					} else {
						mnu.gclass = ''
						this.myinfoView[mnu.code] = false;
					}
				}

			}
		}

	}
</script>
<style lang="scss" scoped>
    .mypage-container {
        width: 100%;
        background: #fff;
        .contents {
            .member-set {
                width: 500px;
                margin: auto;
                .tab {
                    display: flex;
                    padding:0;
                    li {
                        width: 50%;
                        cursor: pointer;
                        color: #000;
                        border:solid 1px #dcdcdc;
                        border-left:none;
                        text-align:center;
                        height:50px;
                        line-height:50px;
                        &.active {
                            color: #fff;
                            background:#686EFB;
                        }
                        &:first-child {
                            border-left:solid 1px #dcdcdc;
                        }
                    }

                }
            }
            &.mobile {
                width: 100%;
                padding:30px 15px;
                .member-set {
                    width: 100%;
                    margin: auto;
                    .tab {
                        display: flex;
                        padding:0;
                        margin-bottom:20px;
                        li {
                            width: 50%;
                            height:43px;
                            line-height:43px;
                            font-size:10pt;
                            &.active {
                                color: #fff;
                                background:#686EFB;
                            }
                            &:first-child {
                                border-left:solid 1px #dcdcdc;
                            }
                        }
                        &.mobileFtab {
                            flex-wrap: wrap;
                            li {
                                &:nth-child(3n) {
                                    border-top:none;
                                    border-left:solid 1px #dcdcdc;
                                }
                                &:last-child {
                                    border-top:none;
                                }
                            }

                        }

                    }
                }
            }

        }

    }


</style>
