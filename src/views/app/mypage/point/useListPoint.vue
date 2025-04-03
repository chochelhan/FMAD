<template>
    <div class="member-container">

        <div :class="'contents '+mobileClass">
            <div class="from-box">
                <ul class="list-ul">
                    <li v-for="item in dataList">
                        <div class="left-box">
                            <div class="date">
                                {{item.rdate}}
                            </div>
                            <div class="info-box">
                                {{item.serviceName}}
                            </div>
                        </div>
                        <div class="right-box">
                            <div class="price">
                                {{item.price}}원
                            </div>
                            <div class="pay-result">
                                결제완료
                            </div>
                        </div>

                    </li>
                    <li class="no-data" v-if="dataList.length<1">
                        충전내역이 없습니다
                    </li>
                </ul>
            </div>

        </div>

    </div>
</template>


<script>
	import {
		API_URL_MEMBER_POINT_USE_LIST,
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';

	export default {
		name: 'useListPoint',
		data() {
			return {
				dataList: [],
				mobileClass: '',
				mobileView: false,
			}
		},
		created() {
			if (this.$isMobile()) {
				this.mobileView = true;
				this.mobileClass = 'mobile'
			}
			this.getData();
		},

		methods: {

			getData() {

				const frm = new FormData()
				apiService.post(API_URL_MEMBER_POINT_USE_LIST, frm, (res) => {
					this.dataList = res.list;
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
            width: 100%;
            margin: auto;
            padding: 30px 0 80px 0;
            text-align: center;
            .list-ul {
                padding: 0;
                li {
                    border-bottom: solid 1px #dcdcdc;
                    &:first-child {
                        border-top: solid 1px #dcdcdc;
                    }
                    display:flex;
                    padding:20px;
                    .left-box {
                        width:70%;
                        text-align:left;
                        .date {
                            font-size:10pt;
                            color:#999;
                        }
                        .info-box {
                            font-size:12pt;
                            color:#000;
                            font-weight:bold;
                            margin:5px 0;
                        }
                        .pay-method {
                            font-size:10pt;
                            color:#999;
                        }
                    }
                    .right-box {
                        width:30%;
                        text-align:right;
                        .price {
                            font-size:14pt;
                            color:#686EFB;
                            font-weight:bold;
                            margin:11px 0 1px 0;
                        }
                        .pay-result {
                            font-size:10pt;
                            color:#999;
                        }
                    }
                    &.no-data {
                        display:block;
                        padding: 40px 0;
                        text-align: center;
                        font-size: 10pt;
                    }

                }
            }
            &.mobile {
                width: 100%;
                padding:30px 0 0 0;

            }

        }

    }


</style>