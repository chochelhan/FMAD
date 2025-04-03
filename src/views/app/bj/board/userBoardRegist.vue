<template>
    <div :class="'modal-container '+mobileClass">
        <div class="header-box" v-if="!mobileView">
            <div class="sub-title"> {{ title }}</div>
            <span @click="modalHide('none')"><i class="fa fa-times"></i></span>
        </div>
        <div class="form-box">
            <form novalidate @submit.prevent="validate">
                <ul class="form-basic">
                    <li class="item-list double-select" v-if="!no">
                        <v-select id="grp"
                                  class="selectBox"
                                  v-model="grp"
                                  :items="groupList"
                                  label="그룹 선택"
                                  outlined
                                  :error-messages="grpErrors"
                                  @input="grpTouch"
                                  @blur="grpTouch"
                                  :dense="dense"
                        ></v-select>
                        <v-select id="bid"
                                  class="selectBox"
                                  v-model="bid"
                                  :items="bidList"
                                  label="게시판 선택"
                                  outlined
                                  :error-messages="bidErrors"
                                  @input="bidTouch"
                                  @blur="bidTouch"
                                  :dense="dense"
                        ></v-select>
                    </li>
                    <li class="item-list" id="subject">
                        <v-text-field
                            v-model="subject"
                            label="제목"
                            required
                            @input="$v.subject.$touch()"
                            @blur="$v.subject.$touch()"
                            :error-messages="subjectErrors"
                            outlined
                            :dense="dense"
                        ></v-text-field>
                        <ul class="radio-box" style="margin-top:-8px;" v-if="isAdmin">
                            <li @click="setNotice()">
                                <div :class="'icon-box '+noticeClass">
                                    <i class="fas fa-check"></i>
                                </div>
                                <div class="text">공지글</div>
                            </li>
                        </ul>
                    </li>
                    <li class="item-list" id="contents">
                        <quill-editor
                            ref="myQuillEditor"
                            class="editor"
                            v-model="contents"
                            :options="editorOption"
                            cols="20"
                            @change="onEditorChange($event)"
                        ></quill-editor>
                    </li>

                </ul>
                <div class="sub-title" v-if="userInfoOpen">작성자 정보</div>
                <ul class="form-basic user-box" v-if="userInfoOpen">
                    <li class="item-list" id="name">
                        <v-text-field
                            v-model="name"
                            label="이름"
                            @input="nameTouch()"
                            @blur="nameTouch()"
                            :error-messages="nameErrors"
                            outlined
                            :dense="dense"
                        ></v-text-field>
                    </li>
                    <li class="item-list" id="upass">
                        <v-text-field
                            v-model="upass"
                            type="password"
                            label="비밀번호"
                            @input="upassTouch()"
                            @blur="upassTouch()"
                            :error-messages="upassErrors"
                            outlined
                            :dense="dense"
                        ></v-text-field>
                    </li>

                </ul>
                <div class="sub-title" style="padding-bottom:10px;">이미지 및 파일 첨부</div>
                <ul class="form-basic">

                    <li class="item-list" id="atImg">
                        <div class="file-box">
                            <div class="file-names">
                                <span class="inputText"> {{ vfileName }}</span>
                            </div>
                            <div class="file-click">
                                <input ref="imgContainer" @change="onChangeImg" type="file" accept="image/*" id="vfile">
                                <i class="fas fa-images"></i>
                                이미지 찾기
                            </div>
                        </div>


                    </li>
                    <li class="item-list" id="atFile">
                        <div class="file-box">
                            <div class="file-names">
                                <span class="inputText"> {{ fileName }}</span>
                            </div>
                            <div class="file-click">
                                <input ref="fileContainer" @change="onChangeFile" type="file"
                                       id="dfile">
                                <i class="fas fa-paperclip"></i>
                                파일 찾기
                            </div>
                        </div>
                    </li>
                    <div class="sub-title" style="padding:0 0 10px 0;">댓글 권한</div>
                    <ul class="radio-box">
                        <li v-for="(auth,index) in authList" @click="setArticleAuth(index)">
                            <div :class="'icon-box '+auth.gclass">
                                <i class="fas fa-check"></i>
                            </div>
                            <div class="text">{{ auth.text }}</div>
                        </li>
                    </ul>
                </ul>
                <div class="submit-button-box">
                    <v-btn
                        class="submit-button"
                        type="submit"

                    >
                        {{ buttonText }}
                    </v-btn>
                </div>

            </form>
        </div>

    </div>
</template>


<script>

import AUTH from '../../../../api/auth'
import {validationMixin} from 'vuelidate'
import {required} from 'vuelidate/lib/validators'
import JQ from 'jquery'
import {
    API_URL_USER_BOARD_ARTICLE_REGIST_INFO,
    API_URL_USER_BOARD_ARTICLE_REGIST
} from '../../../../api/urls';
import apiService from '../../../../api/apiService';
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import {quillEditor} from 'vue-quill-editor'

export default {
    name: 'userBoardRegist',
    mixins: [validationMixin],
    validations: {
        subject: {required},

    },
    props: ["ownerUid", "no"],
    components: {
        quillEditor,
    },
    computed: {
        subjectErrors() {
            const errors = []
            if (!this.$v.subject.$dirty) return errors
            !this.$v.subject.required && errors.push('제목을 입력하세요')
            return errors
        },

    },
    watch: {
        grp(val) {
            this.bidList = [];
            for (let board of this.boardDatas[val]) {
                this.bidList.push({text: board.name, value: board.code});

            }
        }
    },
    data() {
        return {
            mobileView: false,
            mobileClass: '',
            grp: '',
            title: '게시글 작성',
            groupList: [],
            bid: '',
            bidList: [
                {text: '그룹을 먼저 선택하세요', value: ''}
            ],
            notice: '',
            noticeClass: '',
            subject: '',
            contents: '',
            fileName: '',
            dfile: '',
            vfile: '',
            vfileName: '',
            grpErrors: [],
            bidErrors: [],
            userInfoOpen: false,
            name: '',
            nameErrors: [],
            upass: '',
            upassErrors: [],
            dense: false,
            ownerNo: '',
            boardDatas: {},
            isLogin: false,
            memberInfo: {},
            rauth: '',
            buttonText: '글 작성하기',
            editorOption: {
                theme: 'snow',
                placeholder: '내용을 입력하세요',
                modules: {
                    toolbar: [
                        [{'header': [1, 2, 3, 4, 5, 6, false]}],
                        [{'color': []}, {'background': []}],
                        ['bold', 'italic', 'underline', 'strike'],

                    ],
                    clipboard: {
                        matchVisual: false
                    }
                }
            },
            authList: [
                {text: '전체', value: 'all', gclass: ''},
                {text: '회원', value: 'user', gclass: ''},
                {text: '구독자', value: 'follwer', gclass: ''},
            ],
            isAdmin: false,
            mobileOwnerUid:'',
            mobileNo:'',

        }
    },
    created() {
        if (this.$isMobile()) {
            this.mobileView = true;
            this.mobileClass = 'mobile'
            this.dense = true;
            this.mobileOwnerUid = this.$route.params.uid;
            this.mobileNo = this.$route.params.no;
        }
        let memberInfo = AUTH.getSession(this.$isMobile());
        if (memberInfo.AUTHTOKEN) {
            this.isLogin = true;
            this.memberInfo = memberInfo;
        }
        this.getData();
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
        setArticleAuth(index) {
            let k = 0;
            for (let auth of this.authList) {
                if (index == k) {
                    auth.gclass = 'active'
                } else auth.gclass = ''
                k++;
            }
            this.rauth = this.authList[index].value;
        },
        getData() {
            const frm = new FormData()
            if(this.mobileOwnerUid) {
                frm.append('uid', this.mobileOwnerUid)
            } else {
                frm.append('uid', this.ownerUid)
            }

            if (this.no || this.mobileNo) {
                if(this.mobileNo)frm.append('no', this.mobileNo)
                else frm.append('no', this.no)
                this.title = '게시글 수정'
                this.buttonText = '글 수정하기';

            }

            apiService.post(API_URL_USER_BOARD_ARTICLE_REGIST_INFO, frm, (res) => {
                let boardinfos = res.board.content;
                let follower = res.follower;
                this.ownerNo = res.board.ownerNo;
                for (let group of boardinfos) {
                    let access = false;
                    for (let board of group.boardList) {
                        if (this.memberInfo.no == this.ownerNo || this.memberInfo.uid == 'admin') {
                            access = true;
                            if (!this.boardDatas[group.code]) this.boardDatas[group.code] = [];
                            this.boardDatas[group.code].push(board);
                            this.isAdmin = true;
                        } else {
                            switch (board.rauth) {
                                case 'all':
                                    access = true;
                                    if (!this.boardDatas[group.code]) this.boardDatas[group.code] = [];
                                    this.boardDatas[group.code].push(board);
                                    break;
                                case 'follwer':
                                    if (follower) {
                                        access = true;
                                        if (!this.boardDatas[group.code]) this.boardDatas[group.code] = [];
                                        this.boardDatas[group.code].push(board);
                                    }
                                    break;
                                case 'user':
                                    if (this.isLogin) {
                                        access = true;
                                        if (!this.boardDatas[group.code]) this.boardDatas[group.code] = [];
                                        this.boardDatas[group.code].push(board);
                                    }
                                    break;
                            }
                        }
                    }
                    if (access) {
                        this.groupList.push({text: group.groupName, value: group.code});
                    }

                }

                if (!this.isLogin) {
                    this.userInfoOpen = true;
                }
                /*
                for (let code in this.boardDatas) {
                    let brd = this.boardDatas[code];
                    let item = {value: brd.code, text: brd.name}
                    this.bidList.push(item);
                }
                */

                if (this.no  || this.mobileNo) {
                    let articleInfo = res.info;
                    this.subject = articleInfo.subject;
                    this.contents = articleInfo.contents;
                    if (articleInfo.notice == 'yes') {
                        this.notice = 'yes'
                        this.noticeClass = 'active'
                    }
                   // this.grp
                    this.bid = articleInfo.bid;
                    if (articleInfo.rauth) {
                        for (let auth of this.authList) {
                            if (auth.value == articleInfo.rauth) {
                                auth.gclass = 'active'
                            } else auth.gclass = ''
                        }
                        this.rauth = articleInfo.rauth;
                    }

                    if (articleInfo.vfiles) {
                        this.vfileName = articleInfo.vfiles.name
                    }
                    if (articleInfo.dfiles) {
                        this.fileName = articleInfo.dfiles.name
                    }

                }


            });
        },
        grpTouch() {
            this.grpErrors = [];
            if (!this.grp) {
                this.grpErrors.push('그룹을 선택하세요')
            }

        },
        bidTouch() {
            this.bidErrors = [];
            if (!this.bid) {
                this.bidErrors.push('게시판을 선택하세요')
            }

        },
        nameTouch() {
            this.nameErrors = [];
            if (!this.name) {
                this.nameErrors.push('이름을 입력하세요')
            }

        },
        upassTouch() {
            this.upassErrors = [];
            if (!this.upass) {
                this.upassErrors.push('비밀번호를 하세요')
            } else {
                if (this.upass.length > 10) {
                    this.upassErrors.push('비밀번호는 10자 이하로 입력하세요')
                }
            }

        },
        onChangeFile() {
            const fileObj = this.$refs.fileContainer.files;
            let file = fileObj.length > 0 ? fileObj[0] : null;
            this.fileName = file.name;
            this.dfile = file;
        },
        onChangeImg() {
            const imgObj = this.$refs.imgContainer.files;
            let img = imgObj.length > 0 ? imgObj[0] : null;
            this.vfileName = img.name;
            this.vfile = img;


        },
        validate() {


            this.$v.$touch()
            if (!this.no) {
                if (!this.grp) {
                    this.grpTouch();
                }
                if (!this.bid) {
                    this.bidTouch();
                    return;
                }
            }

            if (!this.$v.$anyError) {
                let validateFlag = true;
                let moveItem = '';
                if (this.userInfoOpen) {
                    if (!this.name) {
                        this.nameErrors.push('이름을 입력하세요')
                        validateFlag = false;
                        if (moveItem) moveItem = 'name';
                    }
                    if (!this.upass) {
                        this.upassErrors = [];
                        this.upassErrors.push('비밀번호를 하세요')
                        validateFlag = false;
                        if (moveItem) moveItem = 'upass';
                    }
                    if (this.upass.length > 10) {
                        this.upassErrors = [];
                        this.upassErrors.push('비밀번호는 10자 이하로 입력하세요')
                        return;
                    }

                }
                if (!this.contents) {
                    let params = {
                        message: '내용을 입력하세요',
                    };
                    this.$eventBus.$emit('modalOpen', params);
                    return;
                }
                if (!validateFlag) return;

                this.$eventBus.$emit('overlay', 'open');

                const frm = new FormData()
                frm.append('subject', this.subject);
                frm.append('contents', this.contents);
                frm.append('notice', this.notice);
                frm.append('rauth', this.rauth);

                frm.append('ownerNo', this.ownerNo);
                if (this.userInfoOpen) {
                    frm.append('name', this.name);
                    frm.append('upass', this.upass);

                }
                if (this.dfile) {
                    frm.append('dfile', this.dfile);
                }
                if (this.vfile) {
                    frm.append('vfile', this.vfile);
                }
                if (this.no) frm.append('no', this.no)
                else if (this.mobileNo) frm.append('no', this.mobileNo)
                else frm.append('bid', this.bid)

                apiService.postFile(API_URL_USER_BOARD_ARTICLE_REGIST, frm, (res) => {

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
                        case 'dfileError':
                            params = {
                                message: '지원하지 않는 첨부파일 형식입니다',
                            };
                            this.$eventBus.$emit('modalOpen', params);
                            break;

                        case 'succ':
                            let msg = (this.no || this.mobileNo) ? '정보가 변경되었습니다' : '게시글이 등록되었습니다';
                            params = {
                                message: msg,
                                doAction: () => {
                                    if(!this.mobileView) {
                                        this.$emit('modalHide', 'reload')
                                    }


                                }
                            };
                            if(this.mobileView) {
                               this.$router.go(-1)
                            }
                            this.$eventBus.$emit('modalOpen', params);
                            break;
                    }
                });
            }
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
    height: 670px;


    .header-box {
        background: #202124;
        color: #fff;
        display: flex;
        height: 50px;
        line-height: 50px;

        .sub-title {
            width: 98%;
            font-weight: bold;
            font-size: 14pt;
            padding-left: 50px;
        }

        span {
            width: 40px;
            text-align: center;
            margin-right: 10px;
            cursor: pointer;
        }

    }

    .form-box {
        padding: 50px 30px;
        height: 620px;
        overflow: auto;

        .sub-title {
            font-weight: bold;
            font-size: 11pt;
            text-align: left;
            padding: 20px 0 20px 20px;
        }
    }

    .double-select {
        display: flex;
        justify-content: space-between;

        .selectBox {
            max-width: 49%;
        }
    }

    .submit-button-box {
        padding-top: 40px;
        text-align: center;

        .submit-button {
            width: 330px;
            font-size: 12pt;
            height: 60px;
            background: #686EFB;
            color: #fff;
            border-radius: 0;

        }
    }

    .editor {
        height: 300px;
        margin-bottom: 40px;
    }

    .file-box {
        margin: 10px 0 30px 0;
        display: flex;
        width: 100%;
        padding: 0;
        min-height: 50px;

        .file-names {
            width: 100%;
            border: solid 1px #9E9E9E;
            border-right: none;
            border-radius: 5px 0 0 5px;
            padding: 4px 0 0 0;

            i {
                margin: 3px 0 0 7px;
                cursor: pointer;
            }

            .inputText {
                display: inline-block;
                padding: 13px 0 0 10px;
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

    ul.radio-box {
        margin: 10px 0 30px 0;
        display: flex;
        width: 100%;
        padding: 0;

        li {
            margin-right: 20px;
            display: flex;
            cursor: pointer;

            .icon-box {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                text-align: center;
                color: #dcdcdc;
                border: solid 1px #ccc;
                line-height: 30px;
                margin-right: 5px;

                &.active {
                    background: #686EFB;
                    color: #fff;
                }
            }

            .text {
                font-size: 10pt;
                padding-top: 5px;
            }
        }
    }

    &.mobile {
        width: 100%;
        background: #fff;
        height:auto;
        .form-box {
            padding:80px 15px 30px 15px;
            height:calc(100vh);
            overflow:auto;
            .sub-title {
                font-weight: bold;
                font-size: 11pt;
                text-align: left;
                padding: 20px 0 20px 20px;
            }
            .form-basic {
                padding:0;
                .item-list {

                }
            }
        }

        .double-select {
            display: flex;
            justify-content: space-between;

            .selectBox {
                max-width: 49%;
            }
        }

        .submit-button-box {
            padding-top: 40px;
            text-align: center;

            .submit-button {
                width: 330px;
                font-size: 12pt;
                height: 60px;
                background: #686EFB;
                color: #fff;
                border-radius: 0;

            }
        }

        .editor {
            height: 300px;
            margin-bottom: 40px;
        }

        .file-box {
            margin: 10px 0 30px 0;
            display: flex;
            width: 100%;
            padding: 0;
            min-height: 50px;
            .file-names {
                width: 100%;
                border: solid 1px #9E9E9E;
                border-right: none;
                border-radius: 5px 0 0 5px;
                padding: 4px 0 0 0;

                i {
                    margin: 3px 0 0 7px;
                    cursor: pointer;
                }

                .inputText {
                    display: inline-block;
                    padding: 13px 0 0 10px;
                }

            }

            .file-click {
                position: relative;
                width: 140px;
                background: #fff;
                border: solid 1px #9E9E9E;
                text-align: center;
                color: #000;
                cursor: pointer;
                border-radius: 0 5px 5px 0;
                min-height: 60px;
                padding-top: 18px;
                font-size:12px;
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
                    font-size:15px;
                    margin-right:5px;

                }
            }
        }


        ul.radio-box {
            margin: 10px 0 30px 0;
            display: flex;
            width: 100%;
            padding: 0;

            li {
                margin-right: 20px;
                display: flex;
                cursor: pointer;

                .icon-box {
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    text-align: center;
                    color: #dcdcdc;
                    border: solid 1px #ccc;
                    line-height: 30px;
                    margin-right: 5px;

                    &.active {
                        background: #686EFB;
                        color: #fff;
                    }
                }

                .text {
                    font-size: 10pt;
                    padding-top: 5px;
                }
            }
        }
    }
}
</style>