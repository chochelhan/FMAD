<template>
    <div :class="'modal-container '+mobileClass">
        <div class="header-box" v-if="!mobileView">
            <div class="sub-title"> {{ title }}</div>
            <span @click="modalHide('none')"><i class="fa fa-times"></i></span>
        </div>
        <div class="header-button-box" @click="validate()" v-if="mobileView">
                {{ buttonText }}
        </div>
        <form novalidate @submit.prevent="validate">
            <div class="form-box">
                <ul class="form-basic" style="margin-top:40px;">
                    <li>
                        <textarea v-model="contents" style="width:100%;height:150px"
                                  placeholder="내용을 입력해주세요"></textarea>
                    </li>

                </ul>
                <ul class="file-names">
                    <li v-for="(fitem,index) in imgList" :key="index">
                        <div class="del-box" @click="deleteImg(index)"><i class="fas fa-times"></i></div>
                        <img :src="fitem.url">
                    </li>
                </ul>
            </div>
            <div class="submit-button-box">
                <div class="file-box">
                    <div class="file-click" v-if="!mobileView">
                        <i class="far fa-image"></i>
                        <input ref="imgContainer" @change="onChangeImg" type="file" accept="image/*" id="vfile">
                        <span>이미지</span>
                    </div>
                    <div class="file-click" v-else>
                        <i class="fas fa-camera"></i>
                        <input ref="imgContainer" @change="onChangeImg" type="file" accept="image/*" id="vfile">
                    </div>
                </div>
                <div class="button-box" v-if="!mobileView">
                    <v-btn
                           class="submit-button"
                           type="submit"

                    >
                        {{ buttonText }}
                    </v-btn>
                </div>
            </div>
        </form>

    </div>
</template>


<script>

import AUTH from '../../../../api/auth'
import {
    HOST,
    API_URL_USER_TIMELINE_REGIST_INFO,
    API_URL_USER_TIMELINE_REGIST
} from '../../../../api/urls';
import apiService from '../../../../api/apiService';
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import {quillEditor} from 'vue-quill-editor'

export default {
    name: 'timelineRegist',
    props: ["ownerUid", "no"],
    components: {
        quillEditor,
    },
    data() {
        return {
            mobileView: false,
            mobileClass: '',
            host: HOST,
            title: '타임라인 작성',
            notice: '',
            noticeClass: '',
            contents: '',
            imgList: [],
            buttonText: '글쓰기',
            isAdmin: false,
            mobileOwnerUid:'',
            mobileNo:'',
        }
    },
    created() {
        if (this.$isMobile()) {
            this.mobileView = true;
            this.mobileClass = 'mobile'
            this.mobileOwnerUid = this.$route.params.uid;
            this.mobileNo = this.$route.params.no;
        }
        let memberInfo = AUTH.getSession(this.$isMobile());
        if (memberInfo.AUTHTOKEN) {
            this.isLogin = true;
            this.memberInfo = memberInfo;
            if (this.memberInfo.uid == this.ownerUid || this.memberInfo.uid == 'admin') {
                this.isAdmin = true;
            }
            if ((this.no && this.no != 'new') || this.mobileNo) {
                this.title = '타임라인 수정'
                this.buttonText = '수정하기';
                this.getData();
            }

        } else {
            this.$emit('modalHide', 'none');
            return;
        }


    },
    methods: {
        onEditorChange({quill, html, text}) {
            this.contents = html

        },
        modalHide(cmd) {
            this.$emit('modalHide', cmd)
        },
        setNotice() {
            if (!this.notice) {
                this.notice = 'yes'
                this.noticeClass = 'active'
            } else {
                this.notice = ''
                this.noticeClass = ''
            }
        },
        getData() {
            const frm = new FormData()
            if(this.mobileView) {
                frm.append('uid',  this.mobileOwnerUid)
                frm.append('no', this.mobileNo)

            } else {
                frm.append('uid', this.ownerUid)
                frm.append('no', this.no)

            }

            apiService.post(API_URL_USER_TIMELINE_REGIST_INFO, frm, (res) => {
                if (this.no || this.mobileNo) {
                    let articleInfo = res.info;
                    this.contents = articleInfo.contents;
                    if (articleInfo.vfiles) {
                        for (let img of articleInfo.vfiles) {
                            img.url = this.host + img.url;
                            this.imgList.push(img)
                        }

                    }


                }


            });
        },
        deleteImg(index) {
            this.imgList.splice(index, 1);
        },
        onChangeImg() {
            const imgObj = this.$refs.imgContainer.files;
            let img = imgObj.length > 0 ? imgObj[0] : null;
            img.url = URL.createObjectURL(img)
            this.imgList.push(img);


        },
        validate() {

            if (!this.contents) {
                let params = {
                    message: '내용을 입력하세요',
                };
                this.$eventBus.$emit('modalOpen', params);
                return;
            }

            const frm = new FormData()
            frm.append('contents', this.contents);
            frm.append('notice', this.notice);
            if(this.mobileView) {
                frm.append('ownerUid',  this.mobileOwnerUid)

            } else {
                frm.append('ownerUid', this.ownerUid);
            }
            if ((this.no && this.no != 'new') || this.mobileNo) {
                if(this.mobileNo) {
                    frm.append('no', this.mobileNo)
                } else {
                    frm.append('no', this.no)
                }


                let isImgs = [];
                if (this.imgList.length > 0) {
                    for (let file of this.imgList) {
                        if (!file.type) {
                            isImgs.push(file);
                        }
                    }
                }
                frm.append('isImgs', JSON.stringify(isImgs))


            }
            if (this.imgList.length > 0) {
                let k = 1;
                for (let file of this.imgList) {
                    if (file.type) {
                        frm.append('img' + k, file);
                        k++;
                    }
                }
                frm.append('imgLength', k - 1);
            } else {
                let params = {
                    message: '이미지를 1개이상 첨부하세요',
                };
                this.$eventBus.$emit('modalOpen', params);
                return;
            }
            this.$eventBus.$emit('overlay', 'open');
            apiService.postFile(API_URL_USER_TIMELINE_REGIST, frm, (res) => {

                this.$eventBus.$emit('overlay', 'hide');
                let result = res.msg;
                let params = {}
                switch (result) {
                    case 'imgError':
                        params = {
                            message: '지원하지 않는 이미지 파일형식입니다',
                        };
                        this.$eventBus.$emit('modalOpen', params);
                        break;
                    case 'succ':
                        let msg = (this.no || this.mobileNo) ? '정보가 변경되었습니다' : '타임라인이 등록되었습니다';
                        params = {
                            message: msg,
                            doAction: () => {
                                if(!this.mobileView) {
                                    this.$emit('modalHide', 'reload')
                                }

                            }
                        };
                        if(this.mobileView) {
                            this.$router.back()
                        }
                        this.$eventBus.$emit('modalOpen', params);
                        break;
                }
            });

        }
    },
    mounted() {

    }

}
</script>

<style lang="scss" scoped="true">
.modal-container {
    width: 100%;
    background: #fff;

    ul {
        padding: 0;

        li {

        }
    }

    .header-box {
        background: #fff;
        color: #000;
        display: flex;
        height: 70px;
        line-height: 70px;
        border-bottom: solid 1px #ccc;

        .sub-title {
            width: 98%;
            font-weight: bold;
            font-size: 14pt;
            padding-left: 30px;
        }

        span {
            width: 40px;
            text-align: center;
            margin-right: 10px;
            cursor: pointer;
            font-size: 17pt;
        }

    }

    .form-box {
        padding: 0 30px;
        height: 350px;
        overflow: auto;

        .file-names {
            display: flex;
            padding: 0;
            margin-top: 20px;

            li {
                position: relative;
                width: 18%;
                margin-right: 10px;
                background: #fff;

                img {
                    max-width: 100%;
                }

                .del-box {
                    width: 30px;
                    height: 30px;
                    background: #fff;
                    line-height: 34px;
                    border-radius: 50%;
                    border: solid 1px #ccc;
                    text-align: center;
                    position: absolute;
                    right: -9px;
                    top: -9px;
                    cursor: pointer;
                    z-index: 100;

                    i {
                        font-size: 15pt;
                        color: #000;
                    }
                }

            }
        }
    }


    .submit-button-box {
        border-top: solid 1px #ccc;
        padding: 14px 20px;
        text-align: center;
        display: flex;
        justify-content: space-between;

        .file-box {
            width: 180px;
            text-align: left;
            padding-left: 8px;
            position: relative;

            .file-click {
                #vfile, #dfile {
                    opacity: 0;
                    width: 180px;
                    position: absolute;
                    left: 0;
                    min-height: 60px;
                    z-index: 2;
                }

                i {
                    position: relative;
                    top: 4px;
                    font-size: 32pt;
                    margin-right: 10px;
                    color: #686EFB;

                }

                span {
                    display: inline-block;
                    position: relative;
                    top: -5px;
                    color: #000;

                }
            }
        }

        .submit-button {
            width: 100px;
            font-size: 12pt;
            height: 50px;
            background: #686EFB;
            color: #fff;

        }
    }

    &.mobile {
        .header-button-box {
            position:fixed;
            top:13px;
            right:15px;
            font-size:14px;
            color:#fff;
            z-index:150;
        }
        .form-box {
            padding: 60px 20px 20px 20px;
            height: 550px;
            overflow: auto;

            .file-names {
                display: flex;
                flex-wrap: wrap;
                padding: 0;
                margin-top: 150px;
                li {
                    position: relative;
                    width: 25%;
                    margin-right:20px;
                    background: #fff;
                    img {
                        max-width: 100%;
                    }

                    .del-box {
                        width: 20px;
                        height: 20px;
                        background: #fff;
                        line-height: 20px;
                        border-radius: 50%;
                        border: solid 1px #ccc;
                        text-align: center;
                        position: absolute;
                        right: -9px;
                        top: -9px;
                        background:#999;
                        cursor: pointer;
                        z-index: 100;

                        i {
                            font-size: 10pt;
                            color: #fff;
                        }
                    }

                }
            }
        }


        .submit-button-box {
            position:fixed;
            bottom:0;
            width:100%;
            border-top: solid 1px #ccc;
            padding:10px 15px;
            text-align: center;
            display: flex;
            justify-content: space-between;

            .file-box {
                width: 180px;
                text-align: left;
                padding-left:0;
                position: relative;
                .file-click {
                    #vfile, #dfile {
                        opacity: 0;
                        width: 180px;
                        position: absolute;
                        left: 0;
                        min-height: 60px;
                        z-index: 2;
                    }
                    width:30px;
                    height:30px;
                    border-radius: 50%;
                    background: #686EFB;
                    text-align:center;
                    i {

                        position: relative;
                        top: 2px;
                        font-size:15px;
                        margin-right:0;
                        color: #fff;

                    }

                    span {
                        display: inline-block;
                        position: relative;
                        top: -5px;
                        color: #000;

                    }
                }
            }


        }
    }

}
</style>