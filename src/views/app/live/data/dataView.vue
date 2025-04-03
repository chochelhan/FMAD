<template>
    <div :class="'exam-content '+mobileClass">
        <div class="title-box" v-if="!mobileView">
            <div class="dt-title">자료공유</div>
            <div class="del-box" @click="hideEventBox()"><i class="fas fa-times"></i></div>
        </div>
        <div class="contents">
            <div class="data-list-box">
                <ul class="data-list">
                    <li v-for="(data,idx) in dataList" :key="data.type+data.no" @click="getDataInfo(idx)">
                        <span class="gtype">자료</span>
                        <div class="subject">
                            {{data.name}}
                        </div>
                        <div class="date">{{data.viewDate}}</div>

                    </li>

                </ul>
            </div>
        </div>
        <div class="bottom-box" v-if="!mobileView">
            <v-btn color="submit-button" type="button" @click="hideEventBox()">닫기</v-btn>
        </div>
    </div>
</template>


<script>
	import {mapGetters} from "vuex";
	import {
		API_URL_BROADCAST_LIVE_DATA_LIST,
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';

	export default {
		name: 'liveDataView',
		data() {
			return {
				mobileView: false,
				mobileClass: '',
				dataList: [],
			}
		},
		props: ["gno"],
		created() {
		 	if (this.$isMobile()) {
				this.mobileView = true;
				this.mobileClass = 'mobile'
			}
			this.getData();
		},

		methods: {
			hideEventBox() {
				this.$emit("hideEvent", {page: 'data'});
			},
			getData() {
				const frm = new FormData()
				frm.append('gno', this.gno)
				apiService.post(API_URL_BROADCAST_LIVE_DATA_LIST, frm, (res) => {
					this.dataList = [];
					for (let item of res.fileList) {
						let rdate = item.rdate.toString();
						item.viewDate = rdate.substring(0, 10)
						this.dataList.push(item);
					}
				});
			},
			getDataInfo(idx) {
				let fdata = this.dataList[idx];
				if(fdata.ext == 'hwp') {
					let message = {
						message: 'hwp 파일은 다운로드만 가능합니다',
						doAction: () => {
							this.shareDataChoice(fdata.no);
						}
					};
					this.$eventBus.$emit('modalOpen', message);
				} else {
					this.shareDataChoice(fdata.no);
                }

			},
			shareDataChoice(no) {
				this.$emit("hideEvent", {page: 'data', action: 'view', data: no});
			}
		}

	}
</script>
<style lang="scss" scoped>
    ul {
        padding: 0;
    }

    .exam-content {
        width: 1100px;
        height: 700px;
        -webkit-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
        -moz-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
        box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
        border-radius: 10px;
        position: absolute;
        left: 50%;
        top: 50%;
        background: #ffffff;
        margin: -350px 0 0 -550px;
        .title-box {
            height: 55px;
            line-height: 55px;
            border-bottom: solid 1px #dcdcdc;
            position: relative;
            .dt-title {
                font-size: 12pt;
                font-weight: bold;
                color: #000;
                text-align: center;
            }
            .del-box {
                cursor: pointer;
                position: absolute;
                right: 15px;
                top: 17px;
                background: #999999;
                width: 20px;
                height: 20px;
                text-align: center;
                line-height: 20px;
                border-radius: 10px;
                i {
                    font-size: 10pt;
                    color: #fff;
                }
            }
        }
        .contents {
            background: #f4f4f4;
            padding: 40px 60px;
            height: 580px;
            overflow-y: auto;
            border-radius: 0 0 10px 10px;
            .data-list-box {
                .data-list {
                    display: flex;
                    flex-wrap: wrap;
                    li {
                        background: #fff;
                        -webkit-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                        -moz-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                        box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                        width: 31%;
                        margin: 0 30px 30px 0;
                        height: 140px;
                        padding: 18px 0 0 30px;
                        border-radius: 10px;
                        position: relative;
                        &:nth-child(3n) {
                            margin-right: 0;
                        }

                    }
                    .gtype {
                        display: inline-block;
                        height: 21px;
                        min-width: 50px;
                        padding: 0 10px;
                        text-align: center;
                        line-height: 20px;
                        border-radius: 10px;
                        font-size: 9pt;
                        color: #fff;
                        background: #2D8CFF;
                        cursor: pointer;
                    }
                    .subject {
                        color: #000;
                        font-weight: bold;
                        padding: 10px 0;
                        font-size: 12pt;
                        cursor: pointer;
                    }
                    .date {
                        color: #999;
                        font-size: 10pt;
                        cursor: pointer;

                    }
                }
            }
        }
        .bottom-box {
            height: 65px;
            line-height: 65px;
            border-top: solid 1px #dcdcdc;
            display: flex;
            padding: 0 20px;
            font-size: 10pt;
            .submit-button {
                width: 250px;
                height: 40px;
                border-radius: 20px;
                color: #fff;
                margin: auto;
                background: #5E65E3;
            }
        }
        &.mobile {
            width:100%;
            height:auto;
            -webkit-box-shadow:none;
            -moz-box-shadow:none;
            box-shadow:none;
            border-radius:0;
            position:relative;
            left:0;
            top:0;
            background: #ffffff;
            margin:0;
            .contents {
                background: #f4f4f4;
                padding:20px 15px;
                height:auto;
                overflow-y:visible;
                border-radius: 0;
                .data-list-box {
                    .data-list {
                        display: flex;
                        flex-wrap: wrap;
                        li {
                            background: #fff;
                            -webkit-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                            -moz-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                            box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                            width: 48%;
                            margin: 0 4% 30px 0;
                            height: 140px;
                            padding: 18px 0 0 30px;
                            border-radius: 10px;
                            position: relative;
                            &:nth-child(3n) {
                                margin-right: 4%;
                            }
                            &:nth-child(2n) {
                                margin-right:0;
                            }

                        }
                        .gtype {
                            display: inline-block;
                            height: 21px;
                            min-width: 50px;
                            padding: 0 10px;
                            text-align: center;
                            line-height: 20px;
                            border-radius: 10px;
                            font-size: 9pt;
                            color: #fff;
                            background: #2D8CFF;
                            cursor: pointer;
                        }
                        .subject {
                            color: #000;
                            font-weight: bold;
                            padding: 10px 0;
                            font-size: 12pt;
                            cursor: pointer;
                        }
                        .date {
                            color: #999;
                            font-size: 10pt;
                            cursor: pointer;

                        }
                    }
                }
            }
            .bottom-box {
                height: 65px;
                line-height: 65px;
                border-top: solid 1px #dcdcdc;
                display:flex;
                padding:0 20px;
                font-size:10pt;
                .author {
                    width:0;
                    padding-left:0;
                }
                .timelimit {
                    width:0;

                }
                .button {
                    width:100%;
                    button {
                        width:100%;
                        height:40px;
                        margin:auto;
                        border-radius:0;
                        color:#fff;
                        background: #5E65E3;
                    }
                }
            }
        }
    }


</style>