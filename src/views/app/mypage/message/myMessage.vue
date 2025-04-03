<template>
    <div class="mypage-container">


        <div :class="'contents '+mobileClass">

            <div v-if="!mobileView" class="stitle">
                <span>1:1 채팅 내역</span>
            </div>
            <div  v-if="!mobileView"  class="title-desc">주고 받은 채팅 내역이 나타납니다.</div>
            <ul class="chat-list">

                <li
                    v-for="item in dataList"
                    :key="item.no"
                    @click="messageDetail(item.uid)"
                >
                    <div class="author-img">
                        <img v-if="item.photo" :src="host+item.photo">
                        <i class="fas fa-user" v-else></i>
                    </div>
                    <div class="author-title">
                        <div class="author-name">
                            {{item.name}}
                        </div>
                        <div class="author-rdate">
                            {{item.msg}}
                        </div>
                    </div>
                    <div class="rdate">{{item.rdate}}</div>
                </li>

            </ul>

            <div v-if="dataList.length<1" class="empty-data">
                데이타가 존재하지 않습니다
            </div>

        </div>
    </div>
</template>


<script>
	import {
		HOST,
		API_URL_PAPER_MESSAGE_MY_LIST
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';
	import AUTH from '../../../../api/auth'
    import {mapActions} from "vuex";

	export default {
		name: 'myMessage',
		data() {
			return {
				host: HOST,
				mobileView: false,
				mobileClass: '',
				dataList: [],
				uno: '',

			}
		},
		created() {
			if (this.$isMobile()) {
				this.mobileView = true;
				this.mobileClass = 'mobile'
                this.setClass('sub')
                this.setTitle('1:1 채팅내역');
                this.setBackUrl('');
			}
			let memberInfo = AUTH.getSession(this.$isMobile());
			if (memberInfo.AUTHTOKEN) {
				this.uno = memberInfo.no;
			}
			this.getData();

		},
		methods: {
            ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
			getData() {
				const frm = new FormData()
				frm.append('uno', this.uno)
				apiService.post(API_URL_PAPER_MESSAGE_MY_LIST, frm, (res) => {
					this.dataList = res.list
				});

			},
			messageDetail(uid) {
			    this.$router.push({path:'/main/mypage/myMessage/view/'+uid})
			}
		}

	}
</script>
<style lang="scss" scoped>
.contents {
    .chat-list {
        padding: 0;

        li {
            display: flex;
            width: 100%;
            border-bottom: solid 1px #dcdcdc;
            height: 130px;
            padding-top: 25px;
            cursor: pointer;
            padding-left: 30px;

            &:hover {
                background: #fafafa;
                border-left: solid 1px #dcdcdc;
                border-right: solid 1px #dcdcdc;
            }

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
                    color: #000;
                    font-weight: bold;
                    font-size: 14pt;
                }

                .author-rdate {
                    margin-top: 8px;
                    color: #888;
                    font-size: 11pt;
                }
            }

            .rdate {
                width: 110px;
                color: #888;
                font-size: 10pt;
                margin-top: 30px;
            }
        }
    }

    .empty-data {
        height: 150px;
        text-align: center;
        line-height: 150px;
        font-size: 10pt;
        color: #000;
        border-bottom: solid 1px #dcdcdc;
    }
    &.mobile {
        width:100%;
        padding:20px 15px;
        .chat-list {
            padding: 0;

            li {
                display: flex;
                width: 100%;
                border-bottom: solid 1px #dcdcdc;
                height: 130px;
                padding-top: 25px;
                cursor: pointer;
                padding-left: 30px;

                &:hover {
                    background: #fafafa;
                    border-left: solid 1px #dcdcdc;
                    border-right: solid 1px #dcdcdc;
                }

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
                        color: #000;
                        font-weight: bold;
                        font-size: 14pt;
                    }

                    .author-rdate {
                        margin-top: 8px;
                        color: #888;
                        font-size: 11pt;
                    }
                }

                .rdate {
                    width: 110px;
                    color: #888;
                    font-size: 10pt;
                    margin-top: 30px;
                }
            }
        }

        .empty-data {
            height: 150px;
            width:100%;
            text-align: center;
            line-height: 150px;
            font-size: 10pt;
            color: #000;
            border-bottom: solid 1px #dcdcdc;
        }
    }
}
</style>