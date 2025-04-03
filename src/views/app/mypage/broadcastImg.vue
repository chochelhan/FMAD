<template>
    <div :class="'mypage-container  '+mobileClass">

        <div class="contents">
            <div class="from-box">

                <div v-if="!mobileView" class="stitle">
                    <span>타이틀 이미지 관리</span>
                </div>
                <div v-if="!mobileView"  class="title-desc">PC 와 모바일 방송국 홈에 노출될 타이틀 이미지를 설정합니다</div>
                <form novalidate @submit.prevent="validate">
                    <ul class="field-box">

                        <li>
                            <div class="required-icon">PC</div>
                            <div class="field-input">
                                <div class="file-box">
                                    <div class="file-names">
                                        {{fileName}}

                                    </div>
                                    <div class="file-click">
                                        <input ref="imgContainer" @change="onChangeImg" type="file" accept="image/*"
                                               id="vfile">
                                        파일 찾기
                                    </div>
                                </div>

                            </div>
                        </li>
                        <li>
                            <div class="required-icon">MOBILE</div>
                            <div class="field-input">
                                <div class="file-box">
                                    <div class="file-names">
                                        {{mfileName}}

                                    </div>
                                    <div class="file-click">
                                        <input ref="mimgContainer" @change="onChangeMImg" type="file" accept="image/*"
                                               id="mfile">
                                        파일 찾기
                                    </div>
                                </div>

                            </div>
                        </li>
                    </ul>
                    <ul class="tip-ul">
                        <li> PC 권장 사이즈 : 1440 × 290 px </li>
                        <li> MOBILE 권장 사이즈 : 640 × 560 px </li>
                        <li> 최대 10MB 크기의 그림파일을 업로드 할 수 있습니다. (jpg, png, gif) </li>
                        <li> 모바일 이미지의 경우 디바이스 마다 다르게 보일 수 있습니다 </li>
                    </ul>
                    <p class="submit-button-box">
                        <v-btn
                            type="button"
                            class="cancle-button"
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
	import AUTH from '../../../api/auth'
	import {
		API_URL_BROADCAST_GET_MY_BROADCASTINFO,
		API_URL_BROADCAST_UPDATE,
	} from '../../../api/urls';
	import apiService from '../../../api/apiService';
    import {mapActions} from "vuex";

	export default {
		name: 'broadcastImg',
		data() {
			return {
				insertFlag: false,
				mobileView: false,
				mobileClass: '',
				pcImg: '',
                mImg:'',
				fileName:'',
				mfileName:'',
				no:'',

			}
		},
		created() {
            if (this.$isMobile()) {
                this.mobileView = true;
                this.mobileClass = 'mobile'
                this.setClass('sub')
                this.setTitle('타이틀 이미지 관리');
                this.setBackUrl('');
            }
            this.getData();
		},

		methods: {
            ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
			getData() {
				const frm = new FormData()
				apiService.post(API_URL_BROADCAST_GET_MY_BROADCASTINFO, frm, (res) => {
					if(res.info.no) {
						if(res.info.pcimg.name) {
							this.fileName = res.info.pcimg.name;
							this.mfileName = res.info.mimg.name;
						}
						this.no = res.info.no;
					}
				});
            },
			onChangeImg() {
				const imgObj = this.$refs.imgContainer.files;
				let img = imgObj.length > 0 ? imgObj[0] : null;
				this.fileName = img.name;
				this.pcImg = img;



			},
			onChangeMImg() {
				const imgObj = this.$refs.mimgContainer.files;
				let img = imgObj.length > 0 ? imgObj[0] : null;
				this.mfileName = img.name;
				this.mImg = img;



			},
			validate() {
					this.formSubmit();

			},
			formSubmit() {
				if (this.insertFlag) return;
				if(!this.fileName) {
	                let params = {
		                message: 'PC 이미지를 첨부하세요',

	                };
	                this.$eventBus.$emit('modalOpen', params);
	                return;
                }
				if(!this.mfileName) {
					let params = {
						message: 'MOBILE 이미지를 첨부하세요',

					};
					this.$eventBus.$emit('modalOpen', params);
					return;
				}

				this.insertFlag = true;

				const frm = new FormData()
                if(this.no) {
	                frm.append('no', this.no)
                }
                if(this.pcImg) {
	                frm.append('pcimg', this.pcImg)
                }
				if(this.mImg) {
					frm.append('mimg', this.mImg)
				}

				this.$eventBus.$emit('overlay', 'show');
				apiService.postFile(API_URL_BROADCAST_UPDATE, frm, (res) => {
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
.mypage-container {
    .contents {

        .space {
            height: 20px;
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

                #vfile, #mfile {
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

        .tip-ul {
            margin-top: 20px;
            list-style: disc;

            li {
                font-size: 10pt;
                color: #555;
                margin-top: 5px;
            }
        }


    }
    &.mobile {
        .contents {

            .file-box {
                margin:0;
                .file-names {
                    width: 100%;
                    border: solid 1px #9E9E9E;
                    border-right: none;
                    border-radius: 5px 0 0 5px;
                    padding:8px 0 0 10px;
                    height:40px;
                    i {
                        margin: 3px 0 0 7px;
                        cursor: pointer;
                    }

                }

                .file-click {
                    min-height:40px;
                    height:40px;
                    width:100px;
                    padding-top: 10px;
                    font-size:10pt;
                    #vfile, #dfile {
                        opacity: 0;
                        width: 100%;
                        position: absolute;
                        right: 0;
                        min-height: 40px;
                        z-index: 2;
                    }

                    i {
                        position: relative;
                        top: 2px;
                        font-size: 12pt;
                        margin-right: 10px;

                    }
                }

            }

            .tip-ul {
                margin-top: 20px;
                list-style: disc;
                li {
                    font-size: 9pt;
                    color: #555;
                    margin-top: 5px;
                }
            }


        }
    }
}



</style>