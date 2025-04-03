<template>
    <div :class="'mypage-container '+mobileClass">
        <div v-if="mobileView" class="mobile-tab-box">
            <div class="m-title">STEP01. 내 라이브</div>
            <ul class="tab-ul">
                <li @click="goLiveMain()">내라이브 정보</li>
                <li class="active">환경 설정</li>
            </ul>
        </div>

        <div class="contents">
            <div class="from-box">

                <div v-if="!mobileView" class="stitle"><span class="line">환경 설정</span>
                    <span class="question-box">
                                    <i class="fas fa-question">
                                        <div class="menu-title-tip">
                                             환경 설정
                                            <div class="description">
                                            라이브 참가자에 대한 설정을 진행할 수 있습니다.<br>
                                            의도에 따라 채팅 사용 여부 및 로그인 여부를 설정할 수 있습니다.
                                            다만, 라이브고 정책에 의해 시험 기능을 사용하고자 하는 경우, 참가자의 웹라이브 서비스의 로그인을 필수로 지정됩니다.
                                            <br><br>
                                             자세한 내용은 하단의 ‘자세히 알아보기’를 눌러 예시 화면을 살펴보세요
                                            </div>
                                        </div>
                                    </i>
                    </span>
                </div>
                <div v-if="!mobileView" class="title-desc">라이브 참가자에 대한 설정을 진행할 수 있습니다.</div>

                <div class="question-answer-box" v-if="!mobileView">
                    <v-expand-transition>
                        <div id="guide-description" v-if="guideShow">
                            <div class="img">
                            <img style="max-width:100%;" src="../../../assets/guideImg/02_guide.jpg">
                            </div>
                        </div>
                    </v-expand-transition>
                    <div class="quide-title-box" @click="guideToggle()">
                        <div :class="'quide-title '+guideClass">{{guideTitle}}</div>
                        <div class="guide-icon-box">
                            <div class="guide-icon">
                                <i  v-if="!guideShow" class="fas fa-angle-down"></i>
                                <i  v-else class="fas fa-angle-up"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <form novalidate @submit.prevent="validate">
                    <ul class="field-box">
                        <li>
                            <div class="required-icon">참가자 승인요청</div>
                            <div class="field-input">
                                <ul class="switch-ul">
                                    <li @click="setReqName('yes')" :class="nameClass.yes"> 사용</li>
                                    <li @click="setReqName('no')" :class="nameClass.no"> 미사용</li>
                                </ul>
                            </div>
                        </li>
                        <li style="padding-bottom:15px;">
                            <div class="required-icon">참가자 요청정보</div>
                            <div class="field-input flex-box">
                                <v-checkbox class="chk"
                                    v-model="reqdataName"
                                    label="이름"
                                    disabled
                                ></v-checkbox>
                                <v-checkbox class="chk"
                                    v-model="reqdataEmail"
                                    label="이메일"
                                    disabled
                                ></v-checkbox>

                                <v-checkbox class="chk"
                                    v-model="reqdataJob"
                                    label="소속"
                                ></v-checkbox>
                                <v-checkbox class="chk"
                                            v-model="reqdataPart"
                                            label="부서"
                                ></v-checkbox>
                                <v-checkbox class="chk"
                                            v-model="reqdataPosi"
                                            label="직급"
                                ></v-checkbox>
                                <v-checkbox class="chk"
                                            v-model="reqdataSex"
                                            label="성별"
                                ></v-checkbox>
                            </div>
                        </li>
                        <li>
                            <div class="required-icon">이메일 보안설정</div>
                            <div class="field-input">
                                <ul class="switch-ul">
                                    <li @click="setSafety('yes')" :class="safetyClass.yes"> 사용</li>
                                    <li @click="setSafety('no')" :class="safetyClass.no"> 미사용</li>
                                </ul>
                            </div>
                        </li>
                        <li v-if="safety=='yes'">
                            <div class="required-icon">이메일 주소</div>
                            <div class="field-input">

                                <v-textarea
                                    outlined
                                    placeholder="입장을 허용할 이메일을 입력해 주세요 (메일을 복수로 등록할 경우 ',' 으로 구분해서 입력하세요)"
                                    v-model="emails"
                                    :error-messages="emailErrors"
                                    @input="emailTouch()"
                                    @blur="emailTouch()"
                                    rows="4"

                                ></v-textarea>
                            </div>
                        </li>

                        <li>
                            <div class="required-icon">라이브고 채팅 참여</div>
                            <div class="field-input">
                                <ul class="switch-ul">
                                    <li :class="joinClass.all" @click="setJoinUser('all')"> 모든 사용자</li>
                                    <li :class="joinClass.user" @click="setJoinUser('user')"> 로그인한 사용자</li>
                                    <li :class="joinClass.prohi" @click="setJoinUser('prohi')"> 사용금지</li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <div class="required-icon">단순 참관자 설정</div>
                            <div class="field-input">

                                <v-textarea
                                    outlined
                                    placeholder="단순참관자로 설정할 이메일을 입력해 주세요 (메일을 복수로 등록할 경우 ',' 으로 구분해서 입력하세요)"
                                    v-model="observeEmails"
                                    rows="4"

                                ></v-textarea>
                            </div>
                        </li>

                    </ul>
                    <div class="sub-title">라이브 종료후 콘텐츠 접근 권한 설정</div>
                    <div class="sub-title-desc">라이브 종료 후 라이브 목록에서 삭제되지 않은 경우, 링크를 보유한 사용자가 해당 라이브에서 활용된 콘텐츠를 재열람 할 수 있는지에 대한 설정입니다.</div>
                    <ul class="field-box">
                        <li>
                            <div class="required-icon">시험</div>
                            <div class="field-input">
                                <ul class="switch-ul">
                                    <li @click="setOpenContent('exam','yes')" :class="contentClass.examyes"> 공개</li>
                                    <li @click="setOpenContent('exam','no')" :class="contentClass.examno"> 비공개</li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <div class="required-icon">공유자료</div>
                            <div class="field-input">
                                <ul class="switch-ul">
                                    <li @click="setOpenContent('data','yes')" :class="contentClass.datayes"> 공개</li>
                                    <li @click="setOpenContent('data','no')" :class="contentClass.datano"> 비공개</li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <div class="required-icon">설문조사</div>
                            <div class="field-input">
                                <ul class="switch-ul">
                                    <li @click="setOpenContent('poll','yes')" :class="contentClass.pollyes"> 공개</li>
                                    <li @click="setOpenContent('poll','no')" :class="contentClass.pollno"> 비공개</li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <div class="required-icon">투표</div>
                            <div class="field-input">
                                <ul class="switch-ul">
                                    <li @click="setOpenContent('vote','yes')" :class="contentClass.voteyes"> 공개</li>
                                    <li @click="setOpenContent('vote','no')" :class="contentClass.voteno"> 비공개</li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <div class="required-icon">간단퀴즈</div>
                            <div class="field-input">
                                <ul class="switch-ul">
                                    <li @click="setOpenContent('quiz','yes')" :class="contentClass.quizyes"> 공개</li>
                                    <li @click="setOpenContent('quiz','no')" :class="contentClass.quizno"> 비공개</li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <div class="required-icon">채팅내역</div>
                            <div class="field-input">
                                <ul class="switch-ul">
                                    <li @click="setOpenContent('chat','yes')" :class="contentClass.chatyes"> 공개</li>
                                    <li @click="setOpenContent('chat','no')" :class="contentClass.chatno"> 비공개</li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                    <p class="submit-button-box">
                        <v-btn
                            type="button"
                            class="cancle-button"
                            v-if="!mobileView"
                        >
                            취소
                        </v-btn>
                        <v-btn
                            type="submit"
                            class="submit-button"
                        >
                            저장
                        </v-btn>
                    </p>

                </form>
            </div>

        </div>

    </div>
</template>


<script>
	import {mapGetters} from "vuex";
	import {
		API_URL_BROADCAST_LIVE_INFO,
		API_URL_BROADCAST_LIVE_UPDATE,
	} from '../../../api/urls';
	import apiService from '../../../api/apiService';

	export default {
		name: 'liveSetting',
		data() {
			return {
				insertFlag: false,
				mobileView: false,
				mobileClass: '',
			    no: '',
				guideTitle:' 자세히 알아보기',
				guideShow:false,
				guideClass:'',
				emails:'',
				emailErrors:[],
				nameClass: {
				    yes:'',
				    no:''
			    },
				acceptType:'',
				joinUser:'',
			    joinClass: {
				    all:'',
				    user:'',
				    prohi:''
			    },
				safety:'',
			    safetyClass: {
				    yes:'',
				    no:''
			    },
				observeEmails:'',
				reqdataJob:'',
				reqdataPart:'',
				reqdataPosi:'',
				reqdataSex:'',
				reqdataName:true,
				reqdataEmail:true,
				contentClass: {
					examyes:'active',
					examno:'',
					datayes:'active',
					datano:'',
					pollyes:'active',
					pollno:'',
					voteyes:'active',
					voteno:'',
					quizyes:'active',
					quizno:'',
					chatyes:'active',
					chatno:'',
				},
		    }
		},
		created() {
            if(this.$isMobile()) {
                this.mobileClass ='mobile'
                this.mobileView = true;

            }
			this.no = this.getGno;
			this.getData();
		},
		computed: {
			...mapGetters('etc', ["getGno"]),

		},
		methods: {
            goLiveMain() {
                this.$router.push('/live/'+this.no+'/liveInfo');
            },
			getData() {
				const frm = new FormData()
				frm.append('no', this.no)
				apiService.post(API_URL_BROADCAST_LIVE_INFO, frm, (res) => {
					let meetingInfo = res.info;
					let joinUser = (meetingInfo.joinUser) ? meetingInfo.joinUser : 'all';
					this.setJoinUser(joinUser);
					let acceptType = (meetingInfo.acceptType) ? meetingInfo.acceptType : 'yes';
					this.setReqName(acceptType);
					this.observeEmails = (meetingInfo.observeEmails && meetingInfo.observeEmails!='null')?meetingInfo.observeEmails:'';
					let safety = (meetingInfo.safety) ? meetingInfo.safety : 'yes';
					this.setSafety(safety);
					if(meetingInfo.safety=='yes' && meetingInfo.safetyEmails){
						this.emails = meetingInfo.safetyEmails;
					}
					if(meetingInfo.reqdata) {
						let reqdata = meetingInfo.reqdata;
						this.reqdataJob = (reqdata.job=='yes')?true:false;
						this.reqdataPart = (reqdata.part=='yes')?true:false;
						this.reqdataPosi = (reqdata.posi=='yes')?true:false;
						this.reqdataSex = (reqdata.sex=='yes')?true:false;
					}
					if(meetingInfo.afterOpen) {
						let afterOpen = meetingInfo.afterOpen;
						this.setOpenContent('exam',afterOpen.exam);
						this.setOpenContent('data',afterOpen.data);
						this.setOpenContent('poll',afterOpen.poll);
						this.setOpenContent('vote',afterOpen.vote);
						this.setOpenContent('quiz',afterOpen.quiz);
						this.setOpenContent('chat',afterOpen.chat);
					}
				});
			},
			guideToggle() {
				if(this.guideShow) {
					this.guideShow = false;
					this.guideTitle = '자세히 알아보기'
					this.guideClass = ''
				} else {
					this.guideShow = true;
					this.guideTitle = '접기'
					this.guideClass = 'center'
				}
            },
			emailTouch() {
				this.emailErrors = []
				if (!this.emails) {
					this.emailErrors.push('이메일 주소를 입력하세요')
				}
			},
			setJoinUser(cmd) {

				this.joinUser = cmd;
				let allActive = '';
				let userActive = '';
				let prohiActive = '';
				switch(cmd) {
					case 'all':
						allActive = 'active';
						break;
					case 'user':
						userActive = 'active';
						break;
					case 'prohi':
						prohiActive = 'active';
						break;
				}
				this.joinClass = {
					all:allActive,
					user:userActive,
					prohi:prohiActive
				}
			},
			setReqName(cmd) {
				this.acceptType = cmd;
				let yesActive = '';
				let noActive = '';
				switch(cmd) {
					case 'yes':
						yesActive = 'active';
						break;
					case 'no':
						noActive = 'active';
						break;
				}

				this.nameClass = {
					yes:yesActive,
					no:noActive
				};
			},
			setSafety(cmd) {
				this.safety = cmd;
				let yesActive = '';
				let noActive = '';
				switch(cmd) {
					case 'yes':
						yesActive = 'active';
						break;
					case 'no':
						noActive = 'active';
						break;
				}

				this.safetyClass = {
					yes:yesActive,
					no:noActive
				};
			},
			setOpenContent(content,open) {
				switch(content) {
					case 'exam':
						if(open=='yes') {
							this.contentClass.examyes = 'active';
							this.contentClass.examno = '';
						} else {
							this.contentClass.examyes = '';
							this.contentClass.examno = 'active';
						}
						break;
					case 'data':
						if(open=='yes') {
							this.contentClass.datayes = 'active';
							this.contentClass.datano = '';
						} else {
							this.contentClass.datayes = '';
							this.contentClass.datano = 'active';
						}
						break;
					case 'poll':
						if(open=='yes') {
							this.contentClass.pollyes = 'active';
							this.contentClass.pollno = '';
						} else {
							this.contentClass.pollyes = '';
							this.contentClass.pollno = 'active';
						}
						break;
					case 'vote':
						if(open=='yes') {
							this.contentClass.voteyes = 'active';
							this.contentClass.voteno = '';
						} else {
							this.contentClass.voteyes = '';
							this.contentClass.voteno = 'active';
						}
						break;
					case 'quiz':
						if(open=='yes') {
							this.contentClass.quizyes = 'active';
							this.contentClass.quizno = '';
						} else {
							this.contentClass.quizyes = '';
							this.contentClass.quizno = 'active';
						}
						break;
					case 'chat':
						if(open=='yes') {
							this.contentClass.chatyes = 'active';
							this.contentClass.chatno = '';
						} else {
							this.contentClass.chatyes = '';
							this.contentClass.chatno = 'active';
						}
						break;
				}

			},
			validate() {
				if(this.safety=='yes') {
					if(!this.emails) {
						this.emailTouch();
						return;
					}
				}
				this.formSubmit();

			},
			formSubmit() {
				if (this.insertFlag) return;
				this.insertFlag = true;

				const frm = new FormData()
				frm.append('no', this.no)
				frm.append('cmd', 'liveSetting')

				let afterOpenData = {
					exam:((this.contentClass.examyes== 'active')?'yes':'no'),
					data: ((this.contentClass.datayes == 'active')?'yes':'no'),
					poll: ((this.contentClass.pollyes == 'active')?'yes':'no'),
					vote: ((this.contentClass.voteyes == 'active')?'yes':'no'),
					quiz: ((this.contentClass.quizyes == 'active')?'yes':'no'),
					chat: ((this.contentClass.chatyes == 'active')?'yes':'no'),
				}

				let reqdata = {
					name:'yes',
					email:'yes',
					job:(this.reqdataJob)?'yes':'no',
					part:(this.reqdataPart)?'yes':'no',
					posi:(this.reqdataPosi)?'yes':'no',
					sex:(this.reqdataSex)?'yes':'no',
				};

				frm.append('safety',this.safety)
				frm.append('safetyEmails',this.emails)
				frm.append('observeEmails',this. observeEmails)
				frm.append('acceptType',this.acceptType)
				frm.append('reqdata',JSON.stringify(reqdata))
				frm.append('joinUser',this.joinUser)
				frm.append('afterOpen',JSON.stringify(afterOpenData))

				this.$eventBus.$emit('overlay', 'show');
				apiService.postFile(API_URL_BROADCAST_LIVE_UPDATE, frm, (res) => {
					this.$eventBus.$emit('overlay', 'hide');
					let params = {}
					this.insertFlag = false;
					params = {
						message: '정보가 저장되었습니다',

					};
					this.$eventBus.$emit('modalOpen', params);


				})
			},
		},

	}
</script>
<style lang="scss" scoped>

.mobile-tab-box {
    width:100%;
    margin:0;
    .m-title {
        font-weight:bold;
        font-size:12pt;
        text-align:center;

    }
    .tab-ul {
        width:100%;
        padding:0;
        margin:20px 0 0 0;
        display: flex;
        border-top:solid 1px #dcdcdc;
        border-bottom:solid 1px #dcdcdc;
        li {
            width:50%;
            line-height:45px;
            height:45px;
            font-size:11pt;
            text-align:center;
            &.active {
                border-right:solid 1px #dcdcdc;
                background:#EC2625;
                color:#fff;
            }
        }
    }
}
.mypage-container {
    .contents {
        .share {
            padding-right: 15px;
            cursor: pointer;

            img {
                margin-top: 8px;
                width: 40px;
            }
        }

        .flex-box {
            display: flex;

            .chk {
                margin-right: 20px;
            }
        }

        .file-box {
            margin: 0 0 25px 0;
            display: flex;
            width: 100%;
            padding: 0;
            min-height: 50px;

            .file-names {
                width: 100%;
                border: solid 1px #9E9E9E;
                border-right: none;
                border-radius: 5px 0 0 5px;
                padding: 15px 0 0 10px;

                i {
                    margin: 3px 0 0 7px;
                    cursor: pointer;
                }

            }

            .file-click {
                position: relative;
                width: 200px;
                background: #fff;
                border: solid 1px #9E9E9E;
                text-align: center;
                color: #000;
                cursor: pointer;
                border-radius: 0 5px 5px 0;
                min-height: 60px;
                padding-top: 18px;

                #vfile, #dfile {
                    opacity: 0;
                    width: 100%;
                    position: absolute;
                    right: 0;
                    min-height: 60px;

                    z-index: 2;
                }

                i {
                    position: relative;
                    top: 2px;
                    font-size: 15pt;
                    margin-right: 10px;

                }
            }
        }
    }
    &.mobile {
        .contents {

            .flex-box {
                display: flex;
                flex-wrap: wrap;
                .chk {
                    margin-right:20px;
                    margin-top:-5px;
                    margin-bottom:-5px;
                }
            }


        }
    }
}

</style>