<template>
    <div  :class="'mypage-container '+mobileClass">

        <div class="contents">
            <div class="from-box">

                <div class="stitle"><span class="line">투표 내역</span></div>
                <div class="data-list-box">
                    <div class="people"  v-if="dataList.length>0"><i class="fas fa-user"></i> 참여인원 : <span>{{totalCount}}</span>명</div>
                    <div class="sub-title" v-if="dataList.length>0">{{subject}}</div>
                    <table class="data-list" v-if="dataList.length>0">
                        <thead>
                        <tr>
                            <th>항목명 </th>
                            <th>결과 </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(data,idx) in dataList">
                            <td>{{data.text}}</td>
                            <td>
                                <div class="gline-box" >
                                    <div class="gline" :style="data.style"></div>
                                    <div class="result" v-if="data.per>0">{{data.per}}% ({{data.result}}명)</div>
                                </div>
                            </td>
                        </tr>
                        </tbody>

                    </table>
                    <div   style="width:100%;text-align:center;color:#000;font-weight: bold;" v-if="dataList.length<1">
                        진행한 투료가 없습니다
                    </div>
                </div>
            </div>

        </div>

    </div>
</template>


<script>
	import {mapGetters} from "vuex";
	import {
		API_URL_BROADCAST_LIVE_VOTE_AFTER_INFO
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';

	export default {
		name: 'afterVote',
		data() {
			return {
				mobileView: false,
				mobileClass: '',
				no: '',
				dataList: [],
			    subject: '',
			    totalCount: '',
			}
		},
		created() {
            if (this.$isMobile()) {
                this.mobileView = true;
                this.mobileClass = 'mobile'
            }
			this.no = this.getGno;
			this.getData();
		},
		computed: {
			...mapGetters('etc', ["getGno"]),

		},
		methods: {
			getData() {
				const frm = new FormData()
				frm.append('gno', this.no)
				apiService.post(API_URL_BROADCAST_LIVE_VOTE_AFTER_INFO, frm, (ret) => {
					this.subject = ret.info.subject;
					let item = {};
					let problems = ret.info.items;
					let answerResult = {};
					let key='';
					let answerString= '';
					let ans = '';
					for(let answer of ret.replyList) {
						ans =answer.answers.toString();
						answerString = ans.split(',');
						for(let ans of answerString) {
							key = ans;
							answerResult[key] = ((answerResult[key] > 0) ? parseInt(answerResult[key]) : 0) + 1;
						}
					}
					console.log(problems)
					this.totalCount = ret.replyList.length;
					let resultCount=0;
					let keynum = 1;
					let style = {};
					let result = 0;
					let per = 0;
					let width = 0;
					for(let data of problems) {
						if(this.totalCount>0) {
							result = (isNaN(answerResult[keynum.toString()]))?0:answerResult[keynum.toString()];
							per = Math.floor((result/this.totalCount)*100);
							width = ((800 - 120)/100) * per;
							style = {'width':width+'px'};
						}
						item = {
							text:data.answer,
							result:result,
							style:style,
							per:per
						}
						this.dataList.push(item);
						keynum++;
					}
				});
			},

		},

	}
</script>
<style lang="scss" scoped>
    ul {
        padding: 0;
        li {

        }
    }
    .mypage-container {
        .data-list-box {
            margin-top: 30px;
            background: #F4F4F4;
            border: solid 1px #DCDCDC;
            padding: 40px;

            .people {
                margin-bottom: 10px;
                padding-left: 6px;

                span {
                    color: #2D8CFF;
                    font-weight: bold;
                }
            }

            .sub-title {
                width: 100%;
                color: #000;
                font-weight: bold;
                text-align: center;
                margin-bottom: 15px;

            }

            .data-list {
                width: 100%;
                color: #000;
                font-size: 11pt;

                th {
                    &:first-child {
                        width: 200px;
                        border-right: none;
                    }

                    text-align: center;
                    background: #E8F4FF;
                    border: solid 1px #DCDCDC;
                    height: 40px;
                    line-height: 40px;
                    font-weight: normal;
                }

                tbody tr {
                    td {
                        height: 50px;
                        background: #FFFFFF;
                        border: solid 1px #DCDCDC;
                        border-top: none;
                        font-weight: bold;

                        &:first-child {
                            padding: 3px 0 0 20px;
                            border-right: none;
                        }

                        .gline-box {
                            width: 800px;
                            display: flex;

                            .gline {
                                background: #2D8CFF;
                                height: 30px;
                            }

                            .result {
                                padding: 7px 0 0 10px;
                                width: 120px;
                                font-size: 9pt;
                                font-weight: normal;
                            }
                        }

                    }
                }

            }
        }
        &.mobile {
            .data-list-box {
                padding:15px;
                .people {
                    margin-bottom: 10px;
                    padding-left: 6px;

                    span {
                        color: #2D8CFF;
                        font-weight: bold;
                    }
                }

                .data-list {
                    width: 100%;
                    color: #000;
                    font-size: 10pt;

                    th {
                        width:65%;
                        &:first-child {
                            max-width:35%;
                            border-right: none;
                        }

                        text-align: center;
                        background: #E8F4FF;
                        border: solid 1px #DCDCDC;
                        height: 40px;
                        line-height: 40px;
                        font-weight: normal;
                    }

                    tbody tr {
                        td {
                            height: 50px;
                            background: #FFFFFF;
                            border: solid 1px #DCDCDC;
                            border-top: none;
                            font-weight: bold;

                            &:first-child {
                                padding: 3px 0 0 20px;
                                border-right: none;
                            }

                            .gline-box {
                                width:100%;
                                display: flex;

                                .gline {
                                    background: #2D8CFF;
                                    height: 30px;
                                }

                                .result {
                                    padding: 7px 0 0 10px;
                                    width: 120px;
                                    font-size: 9pt;
                                    font-weight: normal;
                                }
                            }

                        }
                    }

                }
            }
        }
    }

</style>