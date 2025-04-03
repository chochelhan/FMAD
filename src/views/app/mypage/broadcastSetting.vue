<template>
    <div :class="'mypage-container '+mobileClass">

        <div class="contents">
            <div class="from-box">
                <div v-if="!mobileView" class="stitle"><span>페이지 기본관리</span></div>
                <form novalidate @submit.prevent="validate">
                    <ul class="field-box">
                        <li v-if="mtype=='shop'">
                            <div class="required-icon">페이지 이름</div>
                            <div class="field-input">
                                <v-text-field
                                    v-model="name"
                                    required
                                    :error-messages="nameErrors"
                                    @input="$v.name.$touch()"
                                    @blur="$v.name.$touch()"
                                    :dense="dense"
                                    outlined
                                ></v-text-field>
                                <div v-if="nameResultClass" :class="'nameResultClass '+nameResultClass">
                                    {{ nameResultMessage }}
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="required-icon">프로필 이미지</div>
                            <div class="field-input">
                                <div class="file-box">
                                    <div class="file-names">
                                        {{ fileName }}

                                    </div>
                                    <div class="file-click">
                                        <input ref="imgContainer" @change="onChangeImg" type="file" accept="image/*"
                                               id="vfile">
                                        파일 찾기
                                    </div>
                                </div>
                                <div class="tip">
                                    <div class="tip-title">{{ imgGuideTitle }} 프로필 이미지를 설정할 수 있습니다</div>
                                    <div>
                                        크기 : 420 px X 420 px, JPG, PNG는 10MB 미만, GIF는 200KB 미만<br>형식 : jpg, png, gif
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li v-if="mtype=='shop'">
                            <div class="required-icon">프로필 메세지</div>
                            <div class="field-input">

                                <v-textarea
                                    outlined
                                    v-model="msg"
                                    rows="4"

                                ></v-textarea>
                            </div>
                        </li>

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
import {mapActions} from "vuex";
import {validationMixin} from 'vuelidate'
import {required} from 'vuelidate/lib/validators'
import {
    API_URL_BROADCAST_GET_MY_BROADCASTINFO,
    API_URL_BROADCAST_NAME_CHECK,
    API_URL_BROADCAST_UPDATE,
} from '../../../api/urls';
import apiService from '../../../api/apiService';

export default {
    name: 'broadcastSetting',
    mixins: [validationMixin],
    validations: {
        name: {required},

    },
    data() {
        return {
            insertFlag: false,
            name: '',
            succName: false,
            mobileView: false,
            mobileClass: '',
            nameResultClass: '',
            nameResultMessage: '',
            serverInit: false,
            msg: '',
            profileImg: '',
            chatUse: 'no',
            chatUseClass: {
                yes: 'active',
                no: '',
            },
            meetUse: 'no',
            meetUseClass: {
                yes: 'active',
                no: '',
            },
            timelineUse: 'no',
            timelineUseClass: {
                yes: 'active',
                no: '',
            },
            isName: '',
            no: '',
            fileName: '',
            mtype: '',
            imgGuideTitle: '',
            dense: false,

        }
    },
    created() {
        let memberInfo = AUTH.getSession(this.$isMobile());
        if (!memberInfo.AUTHTOKEN) {
            this.$router.push({path: '/'});
            return;
        }
        if (this.$isMobile()) {
            this.mobileView = true;
            this.mobileClass = 'mobile'
            this.setClass('sub')
            this.setTitle('페이지 기본관리');
            this.setBackUrl('');
            this.dense = true;
        }
        this.mtype = memberInfo.mtype;
        if (this.mtype == 'shop') {
            this.imgGuideTitle = '나를 대표하는 ';
        }
        this.getData();
    },
    computed: {
        nameErrors() {
            const errors = []
            if (!this.$v.name.$dirty) return errors
            if (this.$v.name.required) {
                if (this.no && this.isName) {
                    if (this.isName == this.name) {
                        this.succName = true;
                        this.nameResultClass = ''
                        this.nameResultMessage = '';
                        return errors
                    }
                }
                const frm = new FormData()
                frm.append('name', this.name)
                apiService.post(API_URL_BROADCAST_NAME_CHECK, frm, (res) => {
                    let result = res.msg;
                    let params = {}
                    if (!this.name) {
                        this.succName = false;
                        this.nameResultClass = '';
                        return;
                    }
                    if (result == "not") {
                        this.succName = true;
                        this.nameResultClass = 'succ'
                        this.nameResultMessage = '사용가능한 페이지 이름 입니다';
                    } else if (result == 'is') {
                        this.succName = false;
                        this.nameResultClass = 'double'
                        this.nameResultMessage = '중복된 페이지 이름 입니다';
                    } else {
                        this.$router.push('/');
                    }
                });

            } else {
                this.succName = false;
                this.nameResultClass = '';
                errors.push('페이지이름을 입력하세요')
            }

            return errors
        },


    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
        ...mapActions('member', ["setBrocastChange"]),
        getData() {
            const frm = new FormData()
            apiService.post(API_URL_BROADCAST_GET_MY_BROADCASTINFO, frm, (res) => {
                if (res.info.no) {
                    if (res.info.name && this.mtype == 'shop') {
                        this.isName = res.info.name;
                        this.name = res.info.name;
                        this.msg = res.info.msg;
                        this.fileName = res.info.profileimg.name;

                        if (res.info.chatUse == 'no') {
                            this.chatUse = 'no';
                            this.chatUseToggle(this.chatUse)
                        }
                        if (res.info.meetUse == 'no') {
                            this.meetUse = 'no';
                            this.meetUseToggle(this.meetUse)
                        }
                        if (res.info.timelineUse == 'no') {
                            this.timelineUse = 'no';
                            this.timelineUseToggle(this.timelineUse)
                        }
                        this.succName = true;
                    } else if (this.mtype != 'shop' && res.info.profileimg) {
                        this.fileName = res.info.profileimg.name;
                        if (res.info.meetUse == 'no') {
                            this.meetUse = 'no';
                            this.meetUseToggle(this.meetUse)
                        }
                        if (res.info.timelineUse == 'no') {
                            this.timelineUse = 'no';
                            this.timelineUseToggle(this.timelineUse)
                        }
                        this.succName = true;

                    }
                    this.no = res.info.no;
                }
            });
        },
        onChangeImg() {
            const imgObj = this.$refs.imgContainer.files;
            let img = imgObj.length > 0 ? imgObj[0] : null;
            this.fileName = img.name;
            this.profileImg = img;


        },
        meetUseToggle(code) {
            let yesClass = '';
            let noClass = '';
            if (code == 'yes') {
                yesClass = 'active';
            } else {
                noClass = 'active';
            }
            this.meetUse = code;
            this.meetUseClass.yes = yesClass;
            this.meetUseClass.no = noClass;
        },
        chatUseToggle(code) {
            let yesClass = '';
            let noClass = '';
            if (code == 'yes') {
                yesClass = 'active';
            } else {
                noClass = 'active';
            }
            this.chatUse = code;
            this.chatUseClass.yes = yesClass;
            this.chatUseClass.no = noClass;
        },
        timelineUseToggle(code) {
            let yesClass = '';
            let noClass = '';
            if (code == 'yes') {
                yesClass = 'active';
            } else {
                noClass = 'active';
            }
            this.timelineUse = code;
            this.timelineUseClass.yes = yesClass;
            this.timelineUseClass.no = noClass;
        },
        validate() {
            if (this.mtype == 'shop') {
                this.$v.$touch()
                if (!this.$v.$anyError) {
                    this.formSubmit();
                }
            } else {
                this.succName = true;
                this.formSubmit();
            }


        },
        formSubmit() {
            if (this.insertFlag) return;
            if (!this.succName) return;
            if (!this.fileName) {
                let params = {
                    message: '프로필 이미지를 첨부하세요',

                };
                this.$eventBus.$emit('modalOpen', params);
                return;
            }
            this.insertFlag = true;

            const frm = new FormData()
            frm.append('name', this.name)
            frm.append('no', this.no)

            if (this.profileImg) {
                frm.append('profileimg', this.profileImg)
            }
            frm.append('msg', this.msg)
            if(this.chatUse!='yes')this.chatUse='no';
            frm.append('chatUse', this.chatUse)
            if(this.meetUse!='yes')this.meetUse = 'no'
            frm.append('meetUse', this.meetUse)
            if(this.timelineUse!='yes')this.timelineUse='no'
            frm.append('timelineUse', this.timelineUse)
            this.$eventBus.$emit('overlay', 'show');
            apiService.postFile(API_URL_BROADCAST_UPDATE, frm, (res) => {
                this.$eventBus.$emit('overlay', 'hide');
                let params = {}
                this.insertFlag = false;
                this.setBrocastChange(true);
                if (res.photo) {
                    AUTH.setPhoto(this.$isMobile(), res.photo);
                }
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

        .nameResultClass {
            margin: -25px 0 10px 0;
            font-size: 9pt;

            &.succ {
                color: #303E9F;
            }

            &.double {
                color: #f00;
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

        .tip {
            margin: -10px 0 10px 0;
            font-size: 10pt;

            .tip-title {
                font-weight: bold;
                padding-bottom: 8px;
            }
        }

    }
    &.mobile {
        .contents {

            .space {
                height: 20px;
            }

            .file-box {
                margin:0 0 25px 0;
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

            .tip {
                margin: -10px 0 10px 0;
                font-size:9pt;
                .tip-title {
                    font-weight: bold;
                    padding-bottom: 8px;
                }
            }



        }
    }

}

</style>
