<template>
    <div :class="'page-container '+mobileClass">

        <div class="contents">
            <div class="from-box">
                <div class="item-title">
                    프로필
                </div>
                <div class="input-header">
                    <div class="img-container">
                        <div class="img-box">
                            <img v-if="imgPreview" :src="imgPreview"/>
                            <i v-else class="fa fa-user"></i>
                        </div>
                        <div class="button-box">
                            <v-btn
                                @click="imgClick"
                                type="button"
                                class="img-button">
                                이미지 변경
                            </v-btn>
                            <v-btn
                                @click="imgReset"
                                type="button"
                                class="img-button gray-bg">
                                이미지 초기화
                            </v-btn>
                        </div>
                        <input type="file" ref="imgfile" @change="imgUpload" style="display:none" accept="image/*">
                    </div>
                    <div class="text-field-box">

                        <div class="field-input">
                            <div class="field-title">프로필명</div>
                            <input type="text"
                                   v-model="name"
                                   placeholder="프로필명을 입력하세요"
                                   @blur="nameTouch()"
                                   outlined
                            ></input>

                        </div>
                        <div class="field-input">
                            <div class="field-title">소개글</div>
                            <textarea
                                v-model="msg"
                                placeholder="내용을 입력하세요"
                                @blur="msgTouch()"
                                style="resize:none;"
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div class="item-title">
                    테마
                </div>
                <div class="theme-box">
                    <ul class="theme-list">
                        <li v-for="(item,index) in themeList" @click="setTheme(index)" :class="item.gclass">
                            <div :class="'img-box theme'+item.code" :style="item.style">
                                <div class="user-box">
                                    <div class="logo-box">
                                        <i class="fa fa-user"></i>
                                    </div>
                                    <div class="user-name">@persona_ai</div>
                                    <div class="user-msg">소개글이 나오는 자리입니다</div>
                                </div>
                                <div class="link-button-box">
                                    <ul class="link-button-ul">
                                        <li>
                                            <v-btn type="button"
                                                   class="link-button">
                                                BJ DUCKKU
                                            </v-btn>
                                        </li>
                                    </ul>
                                </div>

                                <div class="bottom-box">
                                    <div class="logo">
                                        <img :src="item.logo"/>
                                    </div>
                                </div>
                            </div>
                            <div class="name">{{ item.name }}</div>
                        </li>
                    </ul>
                </div>
                <div class="item-title-box">
                    <div class="item-title">
                        후원
                    </div>
                    <div class="switch-box">
                        <v-switch
                            color="#F2554C"
                            v-model="bankUse"
                            value="yes"
                            inset
                        ></v-switch>
                    </div>
                </div>
                <div class="bank-box">
                    <div class="bank-info">
                        <div class="select-box">
                            <input type="text"
                                   v-model="bank"
                                   placeholder="은행명을 입력하세요"
                                   @blur="bankTouch()"
                            />
                        </div>
                        <div class="number-box">
                            <input type="text"
                                   v-model="bankNumber"
                                   placeholder="계좌번호를 입력하세요"
                                   @blur="bankNumberTouch()"
                            />
                        </div>
                        <div class="owner-box">
                            <input type="text"
                                   v-model="bankOwner"
                                   placeholder="계좌주 이름을 입력하세요"
                                   @blur="bankOwnerTouch()"

                            />
                        </div>

                    </div>
                    <div class="bank-msg">
                        <input type="text"
                               v-model="bankMsg"
                               maxLength="30"
                               placeholder="설명을 입력하세요(최대 30자)"
                               @blur="bankMsgTouch()"
                        >
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>


<script>
import {THEMES} from '../../../../config/themes'
import UTIL from '../../../../api/util'
import {mapActions, mapGetters} from "vuex";
import {
    HOST,
    API_URL_LINK_USERACCOUNT_UPDATE
} from '../../../../api/urls';
import apiService from '../../../../api/apiService';

export default {
    name: 'linkMainSetting',
    computed: {
        ...mapGetters('link', ["getAccountData", "getServerFlag"]),

    },
    watch: {
        getServerFlag(val) {
            if (val) {
                if (this.getAccountData) {
                    this.setData()
                }
            }
        },
        bankUse() {
            this.validate()
        }
    },
    data() {
        return {
            insertFlag: false,
            mobileView: false,
            mobileClass: '',
            name: '',
            theme: '',
            msg: '',
            imgPreview: '',
            imgFile: null,
            themeList: THEMES,
            bank: '',
            bankNumber: '',
            bankOwner: '',
            isImg: '',
            bankUse: '',
            bankMsg: '',

        }
    },
    created() {
        console.log(this.themeList)
        if (this.$isMobile()) {
            this.mobileView = true;
            this.mobileClass = 'mobile'
        }
        if (this.getServerFlag) {
            if (this.getAccountData) {
                this.setData()
            }
        }

    },
    methods: {
        ...mapActions('link', ["setAccountData"]),
        setData() {
            this.name = this.getAccountData.name
            this.theme = this.getAccountData.theme
            this.msg = (this.getAccountData.msg) ? UTIL.br2nl(this.getAccountData.msg) : '';


            if (this.getAccountData.img) this.imgPreview = HOST + this.getAccountData.img
            this.bankUse = (this.getAccountData.bankUse == 'yes') ? 'yes' : '';
            if (this.getAccountData.bank) this.bank = this.getAccountData.bank
            this.bankNumber = this.getAccountData.bankNumber
            this.bankOwner = this.getAccountData.bankOwner
            this.bankMsg = this.getAccountData.bankMsg
            this.isImg = (this.getAccountData.img) ? this.getAccountData.img : '';
            let gitem = this.themeList.find((item) => item.code == this.theme)
            if (gitem) {
                gitem.gclass = 'active'
            }
        },
        nameTouch() {
            this.validate()
        },
        msgTouch() {
            this.validate()
        },
        bankTouch() {
            this.validate()
        },
        bankNumberTouch() {
            this.validate()
        },
        bankOwnerTouch() {
            this.validate()
        },
        bankMsgTouch() {
            this.validate()
        },
        imgClick() {
            this.$refs.imgfile.click();
        },
        imgReset() {
            this.imgFile = null;
            this.imgPreview = '';
            this.isImg = '';
            this.validate()
        },
        imgUpload() {
            const imgObj = this.$refs.imgfile.files;
            let img = imgObj.length > 0 ? imgObj[0] : null;
            this.imgFile = img;
            this.imgPreview = URL.createObjectURL(img);
            this.validate()
        },
        setTheme(index) {
            let k = 0;
            for (let item of this.themeList) {
                if (index == k) {
                    this.theme = item.code;
                    item.gclass = 'active'
                } else item.gclass = ''
                k++;
            }
            this.validate()
        },
        validate() {
            this.formSubmit();
        },
        formSubmit() {
            if (this.insertFlag) return;
            this.insertFlag = true;
            let msg = '';
            if (this.msg) {
                msg = UTIL.nl2brContent(this.msg);
            }

            const frm = new FormData()
            let datas = {
                name: this.name,
                msg: msg,
                bank: this.bank,
                bankOwner: this.bankOwner,
                bankNumber: this.bankNumber,
                bankMsg: this.bankMsg,
                theme: this.theme,
                bankUse: ((this.bankUse == 'yes') ? 'yes' : ''),
            };
            frm.append('accountData', JSON.stringify(datas))
            if (this.imgFile) {
                frm.append('img', this.imgFile)
            }
            frm.append('isImg', this.isImg)
            apiService.postFile(API_URL_LINK_USERACCOUNT_UPDATE, frm, (res) => {

                datas.img = res.img;
                this.setAccountData(datas)
                this.insertFlag = false;
            })
        },
    },

}
</script>
<style lang="scss" scoped>
.page-container {
    width: 100%;
    min-height: calc(100vh);

    .contents {
        width: 100%;
        padding: 0 0 100px 0;

        .from-box {
            width: 880px;
            overflow: hidden;

            .item-title {
                margin-top: 50px;
                font-size: 18px;
                font-weight: 600;
                color: #333;
                margin-bottom: 6px;

                &:first-child {
                    margin-top: 0;
                }
            }

            .item-title-box {
                margin-top: 50px;
                display: flex;
                justify-content: space-between;

                .item-title {
                    margin-bottom: 6px;
                }

                .switch-box {
                    margin-top: -20px;
                    text-align: right;
                }
            }

            .input-header {
                width: 880px;
                height: 192px;
                border-radius: 5px;
                background: #FFFFFF;
                border-radius: 6px;
                display: flex;

                .img-container {
                    padding: 15px 36px 0 36px;

                    .img-box {
                        width: 90px;
                        min-width: 90px;
                        height: 90px;
                        border-radius: 50%;
                        background: #E4E5FF;
                        overflow: hidden;
                        text-align: center;

                        img {
                            width: 100%;
                            min-height: 90px;
                        }

                        i {
                            margin-top: 20px;
                            font-size: 38pt;
                            color: #686EFB;

                        }
                    }

                    .button-box {
                        .img-button {
                            margin: 10px 0 0 0;
                            width: 90px;
                            border-radius: 5px;
                            padding: 0;
                            background: #F2554C;
                            color: #fff;
                            height: 27px;
                            font: normal normal normal 12px/18px Noto Sans KR;

                            &.gray-bg {
                                background: #999;
                            }
                        }

                    }
                }

                .text-field-box {
                    padding: 6px 20px 0 0;

                    .field-input {
                        margin: 10px 0 5px 0;
                        width: 100%;

                        .field-title {
                            font-size: 10pt;
                            color: #999;
                        }

                        input[type="text"] {
                            width: 626px;
                            padding-left: 10px;
                            background: #686EFB0F 0% 0% no-repeat padding-box;
                            border: 1px solid #DCDCDC;
                            height: 36px;

                        }

                        textarea {
                            width: 626px;
                            padding: 10px;
                            background: #686EFB0F 0% 0% no-repeat padding-box;
                            border: 1px solid #DCDCDC;
                            height: 80px;

                        }

                    }

                    .switch-box {
                        text-align: right;
                    }
                }
            }

            .theme-box {
                background: #fff;
                padding: 25px 30px 10px 30px;
                border-radius: 5px;

                .theme-list {
                    padding: 0;
                    display: flex;
                    justify-content: space-between;

                    li {
                        cursor: pointer;
                        width: 20%;
                        margin: 0 20px 20px 0;

                        .img-box {
                            width: 100%;
                            height: 290px;
                            border-radius: 8px;
                            border: 1px solid #dcdcdc;
                            position: relative;

                            .user-box {
                                width: 100%;
                                text-align: center;

                                .logo-box {
                                    width: 41px;
                                    height: 41px;
                                    margin: 30px auto 0 auto;
                                    border-radius: 50%;
                                    background: #E4E5FF;

                                    i {
                                        margin-top: 10px;
                                        color: #686EFB;
                                        font-size: 20pt;

                                    }
                                }

                                .user-name {
                                    font-size: 10pt;
                                    color: #000;
                                    font-weight: bold;
                                }

                                .user-msg {
                                    font-size: 7pt;
                                    color: #999;
                                    margin-bottom: 1px;

                                }
                            }

                            .link-button-box {
                                padding: 20px;
                                text-align: center;

                                .link-button-ul {
                                    width: 100%;
                                    padding: 0;

                                    li {
                                        width: 100%;

                                        .link-button {
                                            width: 100%;
                                            background: #686EFB;
                                            color: #fff;
                                            height: 25px;
                                            font-size: 8pt;
                                            font-weight: normal;
                                        }
                                    }

                                }
                            }

                            .bottom-box {
                                width: 100%;
                                position: absolute;
                                bottom: 10px;
                                text-align: center;

                                .logo {
                                    img {
                                        width: 50px;
                                    }
                                }
                            }

                            &.themeb {
                                .user-box {
                                    .logo-box {
                                        background: #FFF;
                                        i {
                                            color:  #6579B1;
                                        }
                                    }

                                }

                                .link-button-box {
                                    .link-button-ul {
                                        li {
                                            .link-button {
                                                background: #fff;
                                                color: #333;
                                            }
                                        }

                                    }
                                }
                            }
                            &.themec {
                                .user-box {
                                    .user-name {
                                        color: #fff;

                                    }

                                    .user-msg {
                                        color: #ccc;

                                    }
                                }
                            }
                            &.themed {
                                .link-button-box {
                                    .link-button-ul {
                                        li {
                                            .link-button {
                                                background: #fff;
                                                color: #333;
                                            }
                                        }

                                    }
                                }
                            }
                        }

                        .name {
                            padding: 10px 0 0 0;
                            text-align: center;
                        }

                        &.active {
                            .img-box {
                                border: solid 1px #686EFB;
                            }
                        }
                    }
                }
            }

            .bank-box {
                background: #fff;
                padding: 17px 19px 10px 19px;
                border-radius: 5px;

                .bank-info {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;

                    .select-box {
                        width: 200px;

                        select {
                            width: 100%;
                            padding-left: 10px;
                            background: #686EFB0F 0% 0% no-repeat padding-box;
                            border: 1px solid #DCDCDC;
                            height: 45px;
                        }
                    }

                    .number-box {
                        width: 380px;
                    }

                    .owner-box {
                        width: 233px;
                    }

                    input[type="text"] {
                        width: 100%;
                        padding-left: 10px;
                        background: #686EFB0F 0% 0% no-repeat padding-box;
                        border: 1px solid #DCDCDC;
                        height: 45px;

                    }
                }

                .bank-msg {
                    input[type="text"] {
                        width: 843px;
                        padding-left: 10px;
                        background: #686EFB0F 0% 0% no-repeat padding-box;
                        border: 1px solid #DCDCDC;
                        height: 45px;

                    }
                }
            }
        }

    }

    &.mobile {
        .contents {
            padding: 0 0 40px 0;

            .from-box {
                width: 100%;

                .item-title {
                    margin-bottom: 10px;

                }

                .item-title-box {
                    margin-top: 50px;
                    display: flex;
                    justify-content: space-between;

                    .item-title {
                        margin-bottom: 0;
                    }

                    .switch-box {
                        margin-top: -20px;
                        text-align: right;
                    }
                }

                .input-header {
                    width: 100%;
                    height: auto;
                    display: block;
                    padding: 20px 20px 10px 20px;

                    .img-container {
                        padding: 0;
                        display: flex;

                        .button-box {
                            width: 80%;
                            margin-left: 20px;

                            .img-button {
                                margin: 8px 0;
                                width: 100%;

                            }

                        }
                    }

                    .text-field-box {
                        padding: 10px 0 0 0;

                        .field-input {
                            margin: 10px 0 5px 0;
                            width: 100%;

                            .field-title {
                                display: none;
                            }

                            input[type="text"] {
                                width: 100%;

                            }

                            textarea {
                                width: 100%;

                            }

                        }

                        .switch-box {
                            text-align: right;
                        }
                    }
                }

                .theme-box {
                    background: #fff;
                    padding: 20px 15px 15px 15px;
                    border-radius: 5px;

                    .theme-list {
                        padding: 0;
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: space-between;

                        li {
                            cursor: pointer;
                            width: 47%;
                            margin: 0 15px 20px 0;

                            &:nth-child(2n) {
                                margin: 0 0 20px 0;
                            }

                        }
                    }
                }

                .bank-box {
                    .bank-info {
                        display: block;
                        margin-bottom: 15px;

                        .select-box {
                            width: 100%;

                        }

                        .number-box {
                            padding: 15px 0;
                            width: 100%
                        }

                        .owner-box {
                            width: 100%
                        }

                    }

                    .bank-msg {
                        input[type="text"] {
                            width: 100%;

                        }
                    }
                }
            }
        }
    }

}


</style>