<template>
    <div class="mypage-container">

        <div :class="'contents '+mobileClass">

            <div v-if="!mobileView" class="stitle">
                <span>마일리지 관리</span>
            </div>
            <div class="title-desc" v-if="!mobileView" >메타룸에서 사용할 마일리지를 관리하는 페이지입니다.</div>
            <div class="member-set">
                <ul class="tab">
                    <li v-for="mnu in myMenus" :class="mnu.gclass" :key="mnu.code" @click="showMyInfo(mnu.code)">
                        {{mnu.name}}
                    </li>
                </ul>
                <buyPoint v-if="myinfoView.buy" @goHistory="showTabBuyList"></buyPoint>
                <useListPoint v-else-if="myinfoView.useList"></useListPoint>
                <buyListPoint v-else-if="myinfoView.buyList"></buyListPoint>
            </div>
        </div>
    </div>
</template>


<script>
	import AUTH from '../../../api/auth'
	import buyPoint from './point/buyPoint'
	import buyListPoint from './point/buyListPoint'
	import useListPoint from './point/useListPoint'
	import {
		API_URL_MEMBER_INFO
	} from '../../../api/urls';
	import apiService from '../../../api/apiService';
    import {mapActions} from "vuex";

	export default {
		name: 'myPoint',
		components: {
			useListPoint,
			buyListPoint,
            buyPoint
		},
		data() {
			return {
				mobileView: false,
				mobileClass: '',
				myMenus: [
					{name: '마일리지', code: 'buy', gclass: 'active'},
					{name: '충전 내역', code: 'buyList', gclass: ''},
					{name: '사용내역', code: 'useList', gclass: ''},
                ],
				myinfoView: {
					buy: true,
					buyList: false,
					useList: false,
				},


			}
		},
		created() {
			let memberInfo = AUTH.getSession(this.$isMobile());
			if (!memberInfo.AUTHTOKEN) {
				this.$router.push({path: '/'});
				return;
			}

			if (this.$isMobile()) {
                this.setClass('sub')
                this.setTitle('마일리지 관리');
                this.setBackUrl('');
				this.mobileView = true;
				this.mobileClass = 'mobile'
			}

		},
		methods: {
            ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
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
				//console.log(this.myMenus)
			},
			showTabBuyList() {
				this.showMyInfo('buyList');
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
                width: 450px;
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
                        margin:0;
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

                    }
                }
            }

        }

    }


</style>