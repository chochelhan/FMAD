<template>
    <div :class="'mypage-container '+mobileClass">

        <div class="contents">
            <div class="from-box">

                <div class="stitle"><span class="line">참가자 정보</span></div>
                <div class="data-list-box">
                    <table class="data-list"  v-if="dataList.length>0" callpadding="0" cellspacing="0" border="0">
                        <thead>
                        <tr>
                            <th style="width:70px">회원여부 </th>
                            <th style="width:80px">이름<br>이메일 </th>
                            <th>시작시간<br>종료시간</th>
                            <th>접속시간<br>종료후접속</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(data,idx) in dataList">
                            <td>{{data.member}}</td>
                            <td>{{data.name}}<br>{{data.email}}</td>
                            <td>
                                <div v-html="data.rdate"></div>
                                <div class="double-line" v-if="data.doubleData">
                                    <div v-html="data.afterStDate"></div>
                                </div>
                                <div v-html="data.endDate"></div>
                                <div class="double-line" v-if="data.doubleData">
                                    <div v-html="data.afterEnDate"></div>
                                </div>
                            </td>
                            <td>
                                <div class="time-line">{{data.jointime}}</div>
                                <div class="time-line top-border" v-if="data.doubleData">
                                    <div v-html="data.afterJointime"></div>
                                </div>
                                <div>{{data.afterjoin}}</div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="no-data"  v-if="dataList.length<1" style="width:100%;text-align:center;">
                    참가자 내역이 없습니다
                </div>
            </div>

        </div>

    </div>
</template>


<script>
	import {mapGetters} from "vuex";
	import {
		API_URL_BROADCAST_LIVE_END_USER_INFO
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';

	export default {
		name: 'afterUser',
		data() {
			return {
				mobileView: false,
				mobileClass: '',
				no: '',
				dataList: [],
			    stream: '',
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
				apiService.post(API_URL_BROADCAST_LIVE_END_USER_INFO, frm, (ret) => {
					let endates;
					let rdates;
					for(let item of ret.list) {
						rdates = item.rdate.toString();
						item.rdate = rdates.replace(' ', '<br>');
						if (item.endDate) {
							endates = item.endDate.toString();
							item.endDate = endates.replace(' ', '<br>');
							let endate = new Date(endates);
							let stdate = new Date(rdates);
							let time = (endate.getTime() - stdate.getTime()) / 1000;
							item.jointime = this.setTimeVal(time);
						}
						if (item.uno > 0) {
							item.member = 'O';
						} else {
							item.member = 'X';
						}
						item.doubleData = false;
						if (item.afterjoin == 'yes') {
							item.afterjoin = 'O';
							if (item.status) {
								rdates = item.afterStDate.toString();
								item.afterStDate = rdates.replace(' ', '<br>');
								item.doubleData = true
								if (item.afterEnDate) {
									endates = item.afterEnDate.toString();
									item.afterEnDate = endates.replace(' ', '<br>');
									let endate = new Date(endates);
									let stdate = new Date(rdates);
									let time = (endate.getTime() - stdate.getTime()) / 1000;
									item.afterJointime = this.setTimeVal(time);

								} else {
									item.jointime = '';
									item.endDate = '';
								}
							} else {
								if (item.afterEnDate) {
									endates = item.afterEnDate.toString();
									item.endDate = endates.replace(' ', '<br>');
									let endate = new Date(endates);
									let stdate = new Date(rdates);
									let time = (endate.getTime() - stdate.getTime()) / 1000;
									item.jointime = this.setTimeVal(time);
								} else {
									item.jointime = '';
									item.endDate = '';
								}
							}
						}
						this.dataList.push(item)
					}
				});
			},
			setTimeVal(sec) {
				sec = parseInt(sec);
				if (isNaN(sec)) return '00:00:00';
				if (sec < 0) return '00:00:00';
				let resultSec = sec % 60;
				resultSec = Math.floor(resultSec)
				let min = sec / 60;
				min = Math.floor(min);
				let resultMin;
				if (min >= 60) {
					resultMin = min % 60;
				} else {
					resultMin = min;
				}
				resultMin = Math.floor(resultMin);
				let hour = min / 60;
				hour = Math.floor(hour);
				let resultHour;
				let day = '';
				if (hour >= 24) {
					resultHour = hour % 24;
				} else {
					resultHour = hour;
				}
				resultHour = Math.floor(resultHour);
				return day + this.zf(resultHour) + ':' + this.zf(resultMin) + ':' + this.zf(resultSec);
			},
			zf(date) {
				date = parseInt(date);
				if (date < 10) {
					return "0" + date;
				} else return date;
			}
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
        padding-top: 30px;

        .data-list {
            width: 100%;
            color: #000;
            font-size: 11pt;

            th {
                &:last-child {
                    border-right: solid 1px #DCDCDC;
                }

                text-align: center;
                background: #E8F4FF;
                border-top: solid 1px #DCDCDC;
                border-left: solid 1px #DCDCDC;
                border-bottom: solid 1px #DCDCDC;
                height: 40px;
                line-height: 40px;
                color: #000;
                font-weight: bold;
            }

            tbody tr {
                td {
                    text-align: center;
                    height: 50px;
                    padding-top: 5px;
                    padding-bottom: 5px;
                    background: #FFFFFF;
                    border-left: solid 1px #DCDCDC;
                    border-bottom: solid 1px #DCDCDC;
                    font-weight: bold;

                    &:last-child {
                        border-right: solid 1px #DCDCDC;
                    }

                    .double-line {
                        width: 100%;
                        border-top: solid 1px #dcdcdc;
                        padding-top: 5px;
                        margin-top: 2px;
                    }

                    .time-line {
                        line-height: 50px;
                    }

                    .top-border {
                        border-top: solid 1px #dcdcdc;
                    }
                }
            }

        }
    }

    .no-data {
        background: #F4F4F4;
        border: solid 1px #DCDCDC;
        min-height:100px;
        line-height:100px;

    }
    &.mobile {
        .data-list-box {
            padding-top: 30px;
            .data-list {
                width: 100%;
                color: #000;
                font-size: 10pt;
                th {
                    height:50px;
                    line-height:120%;

                }

                tbody tr {
                    td {
                        text-align: center;
                        height: 50px;
                        padding-top: 5px;
                        padding-bottom: 5px;
                        background: #FFFFFF;
                        border-left: solid 1px #DCDCDC;
                        border-bottom: solid 1px #DCDCDC;
                        font-weight: bold;

                        &:last-child {
                            border-right: solid 1px #DCDCDC;
                        }

                        .double-line {
                            width: 100%;
                            border-top: solid 1px #dcdcdc;
                            padding-top: 5px;
                            margin-top: 2px;
                        }

                        .time-line {
                            line-height: 50px;
                        }

                        .top-border {
                            border-top: solid 1px #dcdcdc;
                        }
                    }
                }

            }
        }

        .no-data {
            background: #F4F4F4;
            border: solid 1px #DCDCDC;

        }
    }

}
</style>