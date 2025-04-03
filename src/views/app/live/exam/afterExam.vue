<template>
    <div :class="'mypage-container '+mobileClass">

        <div class="contents">
            <div class="from-box">
                <div class="stitle"><span class="line">시험 내역</span></div>
                <div class="data-list-box">
                    <ul class="data-list">
                        <li v-for="(data,idx) in dataList">
                            <div class="del-box" @click="deleteData(data.no,idx)"><i class="fas fa-times"></i></div>
                            <div class="subject" @click="getDataInfo(data.no)">{{data.name}}</div>
                            <div class="date" @click="getDataInfo(data.no)">{{data.viewDate}}</div>
                        </li>
                        <li class="no-data" v-if="dataList.length<1" style="width:100%;text-align:center;padding-top:60px;color:#000;font-weight: bold;">
                            진행한 시험이 없습니다
                        </li>
                    </ul>
                </div>
            </div>

        </div>

    </div>
</template>


<script>
	import {mapGetters} from "vuex";
	import {
		API_URL_BROADCAST_LIVE_EXAM_AFTER_LIST,
		API_URL_BROADCAST_LIVE_EXAM_AFTER_DELETE,
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';

	export default {
		name: 'afterExam',
		data() {
			return {
				mobileView: false,
				mobileClass: '',
			    no: '',
				dataList: [],
        	}
		},
		created() {
		    if(this.$isMobile()) {
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
				apiService.post(API_URL_BROADCAST_LIVE_EXAM_AFTER_LIST, frm, (ret) => {
					for(let data of ret.examList) {
						let rdate = data.rdate.toString();
						let item = {
							name:data.subject,
							no:data.no,
							viewDate:rdate.substring(1,10),
						}
						this.dataList.push(item);
					}

				});
			},
			getDataInfo(no) {
				let path = this.$route.path.split('/');
				this.$router.push('/'+path[1]+'/'+this.no+'/examReport/'+no);
			},
			deleteData(no,idx) {
				let message = {
					type:'confirm',
					message: '선택된 정보를 삭제하시겠습니까?',
					doAction:()=>{
			            this.itemDelete(no,idx);
                    }
				};
				this.$eventBus.$emit('modalOpen', message);
			},
			itemDelete(no,idx) {

				const frm = new FormData()
				frm.append('no',no)
				this.$eventBus.$emit('overlay', 'show');
				apiService.post(API_URL_BROADCAST_LIVE_EXAM_AFTER_DELETE, frm, (res) => {
					this.$eventBus.$emit('overlay', 'hide');
					this.dataList.splice(idx,1)
					let params = {}

					params = {
						message: '정보가 삭제되었습니다',

					};
					this.$eventBus.$emit('modalOpen', params);


				})
			},
		},

	}
</script>
<style lang="scss" scoped>
    ul {
        padding:0;
        li {

        }
    }
    .mypage-container {
        .data-list-box {
            margin-top: 30px;

            .data-list {
                width: 100%;
                display: flex;
                flex-wrap: wrap;

                li {
                    -webkit-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                    -moz-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                    box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                    width: 31%;
                    margin: 0 40px 40px 0;
                    height: 150px;
                    padding: 40px 0 0 30px;
                    border-radius: 10px;
                    position: relative;

                    &:nth-child(3n) {
                        margin-right: 0;
                    }

                    .del-box {
                        cursor: pointer;
                        position: absolute;
                        right: 10px;
                        top: 10px;
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

                .gtype {
                    width: 45px;
                    height: 20px;
                    text-align: center;
                    line-height: 20px;
                    border-radius: 10px;
                    font-size: 9pt;;
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

            .button-row {
                width: 300px;
                margin: 40px auto;

                button {
                    width: 100%;
                    border-radius: 30px;
                }
            }
        }

        &.mobile {
            .data-list-box {
                .data-list {
                    width: 100%;
                    display: flex;
                    flex-wrap: wrap;

                    li {
                        -webkit-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                        -moz-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                        box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                        width: 48%;
                        margin: 0 4% 20px 0;
                        height: 150px;
                        padding:20px 0 0 10px;
                        border-radius: 10px;
                        position: relative;

                        &:nth-child(2n) {
                            margin-right: 0;
                        }
                        &:nth-child(3n) {
                            margin-right: 4%;
                        }
                        &.no-data {
                            margin-right:0;
                        }
                        .del-box {
                            cursor: pointer;
                            position: absolute;
                            right: 10px;
                            top: 10px;
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

                    .gtype {
                        width: 45px;
                        height: 20px;
                        text-align: center;
                        line-height: 20px;
                        border-radius: 10px;
                        font-size: 9pt;;
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

                .button-row {
                    width: 100%;
                    margin: 40px auto;

                    button {
                        width: 100%;
                        border-radius: 30px;
                    }
                }
            }
        }
    }

</style>