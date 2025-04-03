<template>
    <div class="mypage-container">

        <div v-if="mobileView" class="top-menu-bar">
            <div class="top-menu-bar-content">
                <div class="back-button" @click="$router.go(-1)">
                    <i class="fas fa-chevron-left"></i>
                </div>
                <span class="m-title">1:1 채팅 내역</span>
            </div>
        </div>
        <div :class="'contents '+mobileClass">

            <div v-if="!mobileView" class="stitle">
                <span>1:1 채팅 내역</span>
            </div>
            <div class="title-desc">주고 받은 채팅 내역이 나타납니다.</div>
            <ul class="chat-list">

                <li>
                    <div class="arrow-box"  @click="$router.go(-1)">
                        <i class="fas fa-arrow-left"></i>
                    </div>
                    <div class="author-img">
                        <img v-if="targetInfo.photo" :src="host+targetInfo.photo">
                        <i class="fas fa-user" v-if="!targetInfo.photo"></i>
                    </div>
                    <div class="author-title">
                        <div class="author-name">
                            {{targetInfo.name}}
                        </div>
                    </div>
                </li>

            </ul>

            <ul class="data-content">
                <li v-for="(data,dataIndex) in dataList" :class="dataIndex+'item'">
                    <div class="main-3" v-if="data.divide_date">
                        <div class="date-text">{{data.divide_date}}</div>
                    </div>
                    <div v-else-if="data.userType=='other'" class="main-1">
                        <div class="box-left">
                            <img v-if="targetInfo.photo" :src="host+targetInfo.photo">
                            <i class="fas fa-user" v-if="!targetInfo.photo"></i>
                        </div>
                        <div class="box-right">
                            <div class="box-top">
                                <ul>
                                    <li>{{targetInfo.name}}</li>
                                    <li>{{data.time}}</li>
                                </ul>
                            </div>
                            <div class="box-bottom">
                                <div class="box-img">
                                    <img src="../../../../assets/img/img_cbt_f.png">
                                </div>
                                <div class="box-content" v-html="data.msg">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else-if="data.userType=='me'"  class="main-2">
                        <p class="aa">{{data.time}}</p>
                        <div class="box-big">

                            <div class="box-aa" v-html="data.msg">
                            </div>
                            <div class="box-img-cc">
                                <img src="../../../../assets/img/img_cbt_me.png">
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
            <form novalidate @submit.prevent="formSubmit">
            <div class="sendMessage-box">
                <v-text-field
                label=""
                placeholder="메세지를 입력해주세요"
                v-model="content"
                :error-messages="contentErrors"
                @input="$v.content.$touch()"
                @blur="$v.content.$touch()"

                ></v-text-field>
                <div class="button-box">
                    <button type="submit"><i class="far fa-paper-plane"></i></button>
                </div>
            </div>
            </form>
        </div>
    </div>
</template>


<script>
	import {validationMixin} from 'vuelidate'
	import {required} from 'vuelidate/lib/validators'

	import {
		HOST,
		API_URL_PAPER_MESSAGE_MY_LIST_VIEW,
		API_URL_PAPER_MESSAGE_INSERT
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';
	import AUTH from '../../../../api/auth'

	export default {
		name: 'myMessageView',
		mixins: [validationMixin],
		validations: {
			content: {required},
		},
		computed: {
			contentErrors() {
				const errors = []
				if (!this.$v.content.$dirty) return errors
				if (!this.$v.content.required) {
					errors.push('내용을 입력하세요')
				}
				return errors
			},
		},
		data() {
			return {
				host: HOST,
				mobileView: false,
				mobileClass: '',
				dataList: [],
				uno: '',
                myUid:'',
				targetUid: '',
				targetInfo: {},
				content:'',
				weekList: {0: '일요일', 1: '월요일', 2: '화요일', 3: '수요일', 4: '목요일', 5: '금요일', 6: '토요일'},

			}
		},
		created() {
			if (this.$isMobile()) {
				this.mobileView = true;
				this.mobileClass = 'mobile'
			}
			let memberInfo = AUTH.getSession(this.$isMobile());
			if (memberInfo.AUTHTOKEN) {
				this.uno = memberInfo.no;
				this.myUid = memberInfo.uid;
			}
			this.targetUid = this.$route.params.targetUid;
			this.getData();

		},
		methods: {
			getData() {
				const frm = new FormData()
				frm.append('uno', this.uno)
				frm.append('targetUid', this.targetUid)
				apiService.post(API_URL_PAPER_MESSAGE_MY_LIST_VIEW, frm, (res) => {
					this.dataList = [];
					this.targetInfo = res.targetInfo;
					for(let date in  res.list) {
						let k = 0;
						for(let item of res.list[date]) {
							if(k<1) {
								let checkDate = date.split('-');
								let nowDate = new Date(checkDate[0],checkDate[1],checkDate[2]);
								let year = nowDate.getFullYear();
								let month = parseInt(nowDate.getMonth());
								let day = nowDate.getDate();
								let week = this.weekList[nowDate.getDay()];

								let dateView = {divide_date:year + '년 ' + month + '월 ' + day + '일 ' + week};
								this.dataList.push(dateView);
							}

							if (item.sendUid == this.myUid) {
								item.userType = 'me';
							} else item.userType = 'other';
							this.dataList.push(item);
							k++;
						}
					}
					console.log(this.dataList)
				});

			},
			formSubmit() {
				this.$v.$touch()
				if (!this.$v.$anyError) {

					const frm = new FormData()
					frm.append('targetUid', this.targetInfo.uid)
					frm.append('targetName', this.targetInfo.name)
					frm.append('sendUid', this.myUid)
					frm.append('msg', this.content)
					this.content = '';
					this.$v.$reset();
					apiService.postFile(API_URL_PAPER_MESSAGE_INSERT, frm, (res) => {
						this.getData();

					})
				}
			},

		}

	}
</script>
<style lang="scss" scoped>
    .chat-list {
        padding: 0;
        li {
            display: flex;
            width: 100%;
            border-bottom: solid 1px #dcdcdc;
            height: 110px;
            padding-top: 15px;
            padding-left: 20px;
            &:first-child {
                border-top: solid 1px #dcdcdc;
            }
            .author-img {
                width: 80px;
                min-width: 80px;
                height: 80px;
                min-height: 80px;
                border-radius: 50%;
                background: #686EFB;
                overflow: hidden;
                text-align: center;
                img {
                    min-width: 100%;
                    min-height: 80px;
                }
                i {
                    color: #fff;
                    font-size: 28pt;
                    margin-top: 20px;
                }
            }
            .author-title {
                width: 90%;
                padding-left: 20px;
                .author-name {
                    padding-top: 20px;
                    color: #000;
                    font-weight: bold;
                    font-size: 16pt;
                }

            }
            .arrow-box {
                width: 90px;
                color: #888;
                font-size: 10pt;
                margin-top: 10px;
                color: #686EFB;;
                font-size: 30pt;
                cursor: pointer;
            }
        }
    }
    .data-content {
        width: 100%;
        margin:0;
        background:#E7E8FD;
        border:solid 1px #DCDCDC;
        padding:30px;
        li {
            position: relative;
            .main-1 {
                width: 40%;
                height: auto;
                display: flex;
                padding: 13px 15px 13px 5px;
                .box-left {
                    width: 35px;
                    height: 35px;
                    line-height: 35px;
                    border-radius: 50%;
                    background: #686EFB;
                    text-align: center;
                    position: absolute;
                    bottom: 15px;
                    overflow: hidden;
                    img {
                        width: 100%;
                        min-height: 35px;
                    }
                    i {
                        font-size: 12pt;
                        color: #fff;
                    }
                }
                .box-right {
                    width: 100%;
                    margin-left: 47px;
                    .box-top {
                        width: auto;
                        position: relative;
                        ul {
                            display: flex;
                            padding:0;
                            li {
                                padding-bottom: 3px;
                                color: #777;
                                font-family: 'Nanum Gothic', sans-serif;
                                font-size: 10pt;
                                &:last-child {
                                    position: absolute;
                                    right: 0;
                                }
                            }
                        }
                    }
                    .box-bottom {
                        display: flex;
                        position: relative;
                        .box-img {
                            width: auto;
                            height: auto;
                            position: absolute;
                            bottom: -7px;
                            left: -15px;
                            img {
                                width: 20px;
                                height: 30px;
                            }

                        }
                        .box-content {
                            width: 100%;
                            height: auto;
                            background: #fff;
                            padding: 15px 20px;
                            border-radius: 5px;
                            position: relative;
                            word-break: break-all;
                            word-wrap: break-word;
                            line-height: 140%;
                            color: #777;
                            font-family: 'Nanum Gothic', sans-serif;
                            font-size: 10pt;
                        }
                    }
                }
            }
            .main-2 {
                width: 40%;
                height: auto;
                padding: 13px 5px 13px 50px;
                margin-left: 60%;
                .aa {
                    color: #999999;
                    font-family: 'Nanum Gothic', sans-serif;
                    font-size: 13px;
                    padding: 0 0 0 5px;
                    margin: 0;
                }
                .box-big {
                    display: flex;
                    position: relative;
                    .box-aa {
                        width: 100%;
                        margin: 0 11px 0 2px;
                        padding: 12px 25px;
                        background: #686EFB;
                        color: #fff;
                        font-family: 'Nanum Gothic', sans-serif;
                        font-size: 10pt;
                        border-radius: 4px;
                        word-break: break-all;
                        word-wrap: break-word;
                        line-height: 140%;
                    }
                    .box-img-cc {
                        width: auto;
                        position: absolute;
                        right: 2px;
                        bottom: -7px;
                        img {
                            width: 12px;
                            height: 20px;

                        }
                    }
                }

            }
            .main-3 {
                width: 100%;
                height: auto;
                text-align: center;
                padding-top: 22px;
                margin-bottom:22px;
                color: #000;
                border-bottom:solid 1px #D4D5DF;
                font-family: 'Nanum Gothic', sans-serif;
                font-size: 10pt;
                .date-text {
                    background:#E7E8FD;
                    margin:0 auto -10px auto;
                    width:170px;

                }
            }
        }
    }
    .sendMessage-box {
        position:relative;
        .button-box {
            position:absolute;
            right:15px;
            top:5px;
            font-size:18pt;
            color:#999;
            button[type="submit"] {

            }
        }
    }


</style>