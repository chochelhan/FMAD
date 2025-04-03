<template>
    <div class="modal-container">
        <div class="contents">
            <div class="from-box">

                    <ul :class="'field-box '+mobileClass">
                        <li>
                                {{name}}
                        </li>
                        <li class="meet-info">
                            <img src="../../../../assets/images/ico_m1.png">{{gdate}}
                        </li>
                        <li class="meet-info">
                            <img src="../../../../assets/images/ico_m2.png">{{garea}}

                        </li>
                        <li class="meet-info">
                            <img src="../../../../assets/images/ico_m3.png">{{price}}
                        </li>
                        <li class="content" v-html="content">
                        </li>
                        <li class="img">
                            <img :src="img">
                        </li>

                    </ul>
                    <p :class="'submit-button-box '+mobileClass" v-if="buttonView">
                        <v-btn
                            type="button"
                            class="submit-button"
                            @click="boxHide"
                        >
                            {{buttonText}}
                        </v-btn>
                    </p>
            </div>

        </div>

    </div>
</template>


<script>
	import AUTH from '../../../../api/auth'
	import {
		HOST,
		API_URL_MEET_INFO,
		API_URL_MEET_JOIN_INSERT
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';

	export default {
		name: 'meetView',
	    props:["no"],
		data() {
			return {
			    mobileClass:'',
				host:HOST,
				insertFlag: false,
				name: '',
				gdate:'',
				garea: '',
				price: '',
				content: '',
            	img:'',
                uid:'',
                uno:'',
				buttonText:'참석',
				joinCheck:true,
                mobileNo:'',
                buttonView:true,

			}
		},
		created() {
            this.mobileNo = this.$route.params.no;
            if(this.no || this.mobileNo) {
			    let memberInfo = AUTH.getSession(this.$isMobile());
			    if (memberInfo.AUTHTOKEN) {
				    this.uid = memberInfo.uid;
				    this.uno = memberInfo.no;
			    }
			    this.getData();
                if (this.$isMobile()) {
                    this.mobileClass = 'mobile'
                }
		    }
		},
		methods: {
			getData() {
				const frm = new FormData()
                if(this.mobileNo)frm.append('no',this.mobileNo)
                else frm.append('no',this.no)
				apiService.post(API_URL_MEET_INFO, frm, (res) => {
					if(res.info.no) {
						this.name = res.info.name;
						this.gdate = res.info.gdate;
						this.garea = res.info.garea;
						this.price = res.info.price;
						this.content = res.info.content;
                        this.img = this.host+res.info.imgs.img
                        if(this.uno == res.info.uno) {
                        	this.buttonText = '닫기';
	                        this.joinCheck = false;
                        } else {
                        	if(res.info.joinList) {
                        		if(res.info.joinList[this.uid]) {
			                        this.buttonText = '닫기';
			                        this.joinCheck = false;
                                }
                            }
                        }
                        if(this.$isMobile() && !this.joinCheck) {
                            this.buttonView = false;
                        }

					}
				});
            },
			boxHide() {
				if(this.joinCheck) {
					this.meetJoin();
                } else {
					this.$emit('modalHide', 'none')
				}
            },
			meetJoin() {
				if(!this.uid) {
					let params = {
						message: '먼저 로그인 하세요',
					};
					this.$eventBus.$emit('modalOpen', params);
					return;
				}
				const frm = new FormData()
                if(this.mobileNo)frm.append('no',this.mobileNo)
                else frm.append('no',this.no)
				this.$eventBus.$emit('overlay', 'show');
				apiService.post(API_URL_MEET_JOIN_INSERT, frm, (res) => {
					this.$eventBus.$emit('overlay', 'hide');
					if(res.msg=='full') {
                        if (this.$isMobile()) {
                            this.$router.back()
                        } else {
                            this.$emit('modalHide', 'none')
                        }
						let params = {
							message: '죄송합니다 최대 참가인원을 초과하였습니다',
						};
						this.$eventBus.$emit('modalOpen', params);
					} else if(res.msg =='is') {
						let params = {
							message: '이미 참가신청하신 모임입니다',
						};
						this.$eventBus.$emit('modalOpen', params);
                        if (this.$isMobile()) {
                            this.$router.back()
                        } else {
                            this.$emit('modalHide', 'none')
                        }

					} else if(res.msg =='noFollower') {
						let params = {
							message: '먼저 구독신청 하세요',
						};
						this.$eventBus.$emit('modalOpen', params);
                        if (this.$isMobile()) {
                            this.$router.back()
                        } else {
                            this.$emit('modalHide', 'none')
                        }
					} else {
                        if (this.$isMobile()) {
                            this.$router.back()
                        } else {
                            this.$emit('modalHide', 'reload')
                        }
                        let params = {
							message: '참가 신청이 접수되었습니다',
						};

						this.$eventBus.$emit('modalOpen', params);
					}
				});

			},
		},

	}
</script>
<style lang="scss" scoped>
    .modal-container {
        width: 100%;
        background: #fff;
        padding:0;
        height:670px;
        .contents {
            padding:0;
            .submit-button-box {
                .submit-button {
                    width: 100%;
                    border-radius:0;
                    padding: 0;
                    background: #686EFB;
                    color: #fff;
                    height: 70px;
                    font-size: 12pt;

                }
                &.mobile {
                    position:fixed;
                    bottom:-13px;
                    width:calc(100vw);
                    .submit-button {
                        height: 50px;
                        width:100%;
                        font-size: 14px;
                    }
                }
            }
            .field-box {
                padding: 40px;
                height:600px;
                overflow:auto;
                &.mobile {
                    padding-top:70px;
                }
                & > li {
                    padding:5px 0;
                    color:#000;
                    font-size:13pt;
                    font-weight:bold;
                    &.meet-info {
                        font-weight:normal;
                        margin-top:5px;
                        font-size:11pt;
                        img {
                            width:16px;
                            margin-right:7px;
                            margin-bottom:-3px;

                        }
                    }
                    &.content {
                        border-top: solid 1px #dcdcdc;
                        padding:20px 0;
                        margin-top:15px;
                    }
                    &.img {
                        img {
                            width:100%;
                        }
                    }

                }
            }
        }
    }


</style>