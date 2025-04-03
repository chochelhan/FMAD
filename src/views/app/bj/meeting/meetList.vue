<template>
    <div :class="'page-contents '+mobileClass">

        <div class="regist-button-box" v-if="uid == ownerUid || regAuth=='yes'">
            <v-btn
                class="reg-btn"
                @click="showRegistBox()"
            >
                <i class="fas fa-plus-circle"></i>
                모임 만들기
            </v-btn>
        </div>
        <ul class="meet-list">
            <li v-for="(data,index) in dataList">
                <div class="meet-box" @click="showInfo(data.no)">

                    <div class="meet-name">{{data.name}} ({{data.totalJoin}})</div>
                    <div class="meet-info"><img src="../../../../assets/images/ico_m1.png">{{data.gdate}}</div>
                    <div class="meet-info"><img src="../../../../assets/images/ico_m2.png">{{data.garea}}</div>
                    <div class="meet-info"><img src="../../../../assets/images/ico_m3.png">{{data.price}}</div>
                </div>
                <div class="button-box">
                    <v-btn v-if="uid != ownerUid && !data.updateUser"
                        class="reg-btn"
                        @click="meetJoin(data.no,data.join)"
                    >
                        {{data.joinText}}
                    </v-btn>
                    <i class="fas fa-ellipsis-v" v-if="uid == ownerUid || data.updateUser" @click="showEditBox(index)"></i>
                </div>
            </li>
        </ul>
        <div style="height:40px"></div>
        <v-dialog
            v-model="modalShow"
            :width="modalWidth"
            :persistent="meetModalPersistent"
            style="z-index:100"
        >
            <meetRegist :ownerUid="ownerUid" :no="selectedNo" v-if="meetRegistShow && !mobileView" @modalHide="modalHide"></meetRegist>
            <meetView :no="selectedNo" v-if="meetViewShow && !mobileView" @modalHide="modalHide"></meetView>
            <div class="content-modal-box" v-if="screenView">
                <span @click="editBoxHide()"><i class="fa fa-times"></i></span>
                <div style="clear:both;"></div>
                <ul>
                    <li @click="showAttend()">참가자 보기</li>
                    <li @click="updateMeet()">수정 하기</li>
                    <li @click="deleteMeet()">삭제 하기</li>
                </ul>
            </div>
            <div class="content-modal-box" v-if="attendView">
                <span @click="attendBoxHide()"><i class="fa fa-times"></i></span>
                <div style="clear:both;"></div>
                <ul>
                    <li class="nocursor" v-for="user in meetUserList">{{user.name}} ({{(user.pcs)?user.pcs:user.uid}})</li>
                    <li class="nocursor" v-if="meetUserList.length<1">
                        참가신청한 회원이 없습니다
                    </li>
                </ul>
            </div>
        </v-dialog>
        <div class="mobile-screen-box"   v-if="mobileModalShow && mobileView" >
            <div class="meet-mobile-header">
                <div class="back-button" @click="modalHide('none')">
                    <i class="fas fa-arrow-left"></i>
                </div>
                <div class="header-title">
                    {{ title }}
                </div>
            </div>
            <router-view></router-view>
        </div>
    </div>
</template>


<script>
	import AUTH from '../../../../api/auth'
	import {
		API_URL_MEET_LIST,
		API_URL_MEET_JOIN_LIST,
		API_URL_MEET_JOIN_INSERT,
		API_URL_MEET_DELETE
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';
	import {mapActions,mapGetters} from "vuex";

	import meetRegist from './meetRegist'
    import meetView from './meetView'
	export default {
		name: 'meetList',
		components: {
			meetRegist,
			meetView,

		},
		computed: {
			...mapGetters('etc', ["getUid"]),
		},
        watch: {
            '$route'(to, from) {
                //console.log(to.name)
                //console.log(from.name)
                if(this.$isMobile()) {
                    this.checkPath(to.name);
                    this.getData();

                }

            },
	        modalShow(val) {
	        	if(!val) {
	        	    if(!this.mobileView) {
                        this.meetRegistShow = false;
                        this.meetViewShow = false;
                        this.screenView = false;
                        this.attendView = false;
                        this.selectedNo = '';
                        this.selectedIndex = '';
                    }

		        } else {
	        		if(this.meetViewShow) {
				        this.meetModalPersistent = false;
                    } else this.meetModalPersistent = true;

                }
            },
            mobileModalShow(val) {
                if(!val) {
                    this.meetRegistShow = false;
                    this.meetViewShow = false;
                    this.screenView = false;
                    this.attendView = false;
                    this.selectedNo = '';
                    this.selectedIndex = '';


                }
            }
        },
		data() {
			return {
                mobileView: false,
                mobileClass: '',
				modalShow: false,
				meetRegistShow: false,
				meetViewShow: false,
				uid: '',
				selectedNo:'',
				ownerUid: '',
                dataList: [],
				modalWidth:600,
				screenView:false,
				selectedIndex:'',
				meetUserList:'',
				attendView:false,
				meetModalPersistent:true,
				regAuth:'no',
                mobileModalShow:false,
                title:'',

			}
		},
		created() {
            if (this.$isMobile()) {
                this.mobileView = true;
                this.mobileClass = 'mobile'
                let pathName = this.$route.name;
                this.checkPath(pathName);
            }
			this.ownerUid = this.getUid;
			let memberInfo = AUTH.getSession(this.$isMobile());
			if (memberInfo.AUTHTOKEN) {
				this.uid = memberInfo.uid;
			}
            this.getData();

		},
		methods: {
			...mapActions('member', ["setLoginBoxOpen"]),
			modalHide(cmd) {
                if(this.mobileView) {
                    this.mobileModalShow = false;
                    this.$router.back()
                } else {
                    this.modalShow = false;
                }
				this.meetRegistShow = false;
				this.meetViewShow = false;
				this.screenView = false;
				this.selectedNo = '';
				this.selectedIndex = '';
				if (cmd == 'reload') {
					this.getData();
				}
			},
            checkPath(name) {
                switch (name) {
                    case 'userMeetingRegist':
                    case 'userMeetingModify':
                    case 'userMeetingView':
                        if(name=='userMeetingRegist') {
                            this.title = '모임 만들기';
                        } else if(name=='userMeetingModify') {
                            this.title = '모임 수정하기';
                        } else this.title = '모임 보기';

                        this.mobileModalShow = true;
                        break;
                    default:
                        this.mobileModalShow = false;
                        break;
                }
            },
			showRegistBox() {

				if (this.uid == this.ownerUid || this.regAuth=='yes') {
                    if(this.mobileView) {
                        this.mobileModalShow = true;
                        this.meetRegistShow = true;
                        this.modalShow = false;
                        let url = '/'+this.ownerUid+'/main/meeting/';
                        if(this.selectedNo) {
                            this.title = '모임 수정하기'
                            url+='modify/'+this.selectedNo
                        } else {
                            this.title = '모임 만들기'
                            url+='regist'
                        }
                        this.$router.push(url)
                    } else {
                        this.modalWidth = 600
                        this.modalShow = true;
                        this.meetRegistShow = true;
                    }


				}
			},
			getData() {
				this.dataList = [];
				const frm = new FormData()
				frm.append('ownerUid', this.ownerUid)
				apiService.post(API_URL_MEET_LIST, frm, (res) => {
					this.dataList = [];
					this.regAuth = res.regAuth;
					for(let item of res.list ) {
						if(this.uid && this.uid == item.regUid) {
							item.updateUser = true;
                        }  else item.updateUser = false;
						item.joinText = '참석';
						item.join = 'no';
						if(item.joinList && this.uid) {
							if(item.joinList[this.uid]) {
								item.joinText = '신청완료';
								item.join = 'yes';
                            }
                        }
						this.dataList.push(item);
					}
				});

			},
            showInfo(no) {
                if(this.mobileView) {
                    this.mobileModalShow = true;
                    this.meetViewShow = true;
                    this.title = '모임 보기'
                    this.selectedNo = no;
                    this.$router.push('/'+this.ownerUid+'/main/meeting/view/'+this.selectedNo);

                } else {
                    this.modalWidth = 600
                    this.modalShow = true;
                    this.selectedNo = no;
                }



            },
			meetJoin(no,join) {
				if(join=='yes')return;
				if(!this.uid) {
					this.setLoginBoxOpen(true);
					return;
                }
				const frm = new FormData()
				frm.append('no',no)
				this.$eventBus.$emit('overlay', 'show');
				apiService.post(API_URL_MEET_JOIN_INSERT, frm, (res) => {
					this.$eventBus.$emit('overlay', 'hide');
					if(res.msg=='full') {
						let params = {
							message: '죄송합니다 최대 참가인원을 초과하였습니다',
						};
						this.$eventBus.$emit('modalOpen', params);
					} else if(res.msg =='noFollower') {
						let params = {
							message: '먼저 구독신청 하세요',
						};
						this.$eventBus.$emit('modalOpen', params);
                    } else {
						this.getData();
						let params = {
							message: '참가 신청이 접수되었습니다',
						};
						this.$eventBus.$emit('modalOpen', params);
					}
				});

            },
			showEditBox(index) {
				//if (this.uid == this.ownerUid) {
					this.selectedIndex = index;
					this.modalWidth = 300
					this.modalShow = true;
					this.screenView = true;
				//}
            },
			editBoxHide() {
				this.selectedIndex = '';
				this.modalShow = false;
				this.screenView = false;
            },
			updateMeet() {

				this.screenView = false;
				this.selectedNo = this.dataList[this.selectedIndex].no;
				this.showRegistBox();
			},
			deleteMeet() {
				let params = {
					type:'confirm',
					message: '모임을 삭제 하시겠습니까?',
                    doAction:()=> {
						this.deleteActive();
                    }
				};
				this.$eventBus.$emit('modalOpen', params);
            },
			deleteActive() {
				const frm = new FormData()
                frm.append('no',this.dataList[this.selectedIndex].no)
				this.$eventBus.$emit('overlay', 'show');
				apiService.post(API_URL_MEET_DELETE, frm, (res) => {
					this.$eventBus.$emit('overlay', 'hide');
					this.modalShow = false;
					this.getData();
					let params = {
						message: '모임이 삭제 되었습니다',

					};
					this.$eventBus.$emit('modalOpen', params);

				});
            },
			showAttend() {
				const frm = new FormData()
				frm.append('no',this.dataList[this.selectedIndex].no)
				this.$eventBus.$emit('overlay', 'show');
				apiService.post(API_URL_MEET_JOIN_LIST, frm, (res) => {
					this.$eventBus.$emit('overlay', 'hide');
					this.meetUserList = res.list;
					this.screenView = false;
					this.attendView = true;

				});
            },
			attendBoxHide() {
				this.selectedIndex = '';
				this.modalShow = false;
				this.attendView = false;
            }


		}

	}
</script>

<style lang="scss" scoped="true">
    .page-contents {

        .regist-button-box {
            width: 100%;
            margin-bottom:40px;
            .reg-btn {
                background: #686EFB;
                color: #fff;
                border-radius: 0;
                width: 100%;
                height: 50px;
                font-size: 13pt;
                i {
                    margin-right: 10px;
                }
            }
        }
        .meet-list {
            padding:0;
            width:100%;
            li {
                margin-bottom:20px;
                background:#0F1421;
                display:flex;
                color:#fff;
                padding:30px;
                .meet-box {
                    width:95%;
                    cursor:pointer;
                    .meet-name {
                        font-size:14pt;
                        font-weight:bold;
                    }
                    .meet-info {
                        margin-top:10px;
                        font-size:10pt;
                        img {
                            width:14px;
                            margin-right:7px;
                            margin-bottom:-3px;

                        }
                    }

                }
                .button-box {
                    min-width:100px;
                    width:100px;
                    text-align:right;
                    .reg-btn {
                        background: #686EFB;
                        color: #fff;
                        border-radius: 0;
                        width: 100%;
                        height: 50px;
                        font-size: 13pt;

                    }
                    i {
                        font-size: 15pt;
                        margin-top:10px;
                        cursor:pointer;
                    }
                }
            }
        }
        &.mobile {
            .regist-button-box {
                width: 100%;
                margin-bottom:40px;
                .reg-btn {
                    background: #686EFB;
                    color: #fff;
                    border-radius: 0;
                    width: 100%;
                    height: 40px;
                    font-size: 14px;
                    i {
                        margin-right: 10px;
                    }
                }
            }
            .meet-list {
                padding:0;
                width:100%;
                li {
                    margin-bottom:20px;
                    background:#0F1421;
                    display:flex;
                    color:#fff;
                    padding:15px;
                    .meet-box {
                        width:95%;
                        cursor:pointer;
                        .meet-name {
                            font-size:14px;
                            font-weight:bold;
                        }
                        .meet-info {
                            margin-top:10px;
                            font-size:10pt;
                            img {
                                width:14px;
                                margin-right:7px;
                                margin-bottom:-3px;

                            }
                        }

                    }
                    .button-box {
                        min-width:100px;
                        width:100px;
                        text-align:right;
                        .reg-btn {
                            background: #686EFB;
                            color: #fff;
                            border-radius: 0;
                            width: 100%;
                            height: 50px;
                            font-size: 13pt;

                        }
                        i {
                            font-size: 15pt;
                            margin-top:10px;
                            cursor:pointer;
                        }
                    }
                }
            }
        }
        .mobile-screen-box {
            width:calc(100vw);
            position:fixed;
            top:0;
            left:0;
            z-index:150;
        }
        .meet-mobile-header {
            width: 100%;
            position: fixed;
            background: #141A2C;
            z-index: 90;
            top: 0;
            left: 0;
            height: 44px;
            display:flex;
            box-shadow: 0px 0px 9px #0000007A;
            .back-button {
                color:#fff;
                margin:10px 0 0 10px;
            }
            .header-title {
                text-align:left;
                padding:10px 0 0 15px;
                color:#fff;
                font-weight: 600;
            }
        }
    }
    .content-modal-box {
        background:#fff;
        z-index:10;
        span {
            float:right;
            display:inline-block;
            width:24px;
            height:24px;
            border-radius:50%;
            background:#000;
            color:#fff;
            text-align:center;
            margin:10px 10px 0 0;
            cursor:pointer;

        }
        ul {
            padding:0;
            padding-bottom:20px;
            li {
                padding:10px;
                text-align:center;
                font-size:11pt;
                font-weight:bold;
                cursor:pointer;
                &.nocursor {
                    cursor:default;
                }
            }
        }
    }
</style>