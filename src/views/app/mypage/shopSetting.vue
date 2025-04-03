<template>
    <div :class="'mypage-container '+mobileClass">
        <div class="contents">
            <div class="from-box">

                <div v-if="!mobileView" class="stitle"><span>쇼핑몰 관리</span></div>
                <div v-if="!mobileView" class="title-desc">쇼핑몰을 운영하실 인플루언서를 위한 페이지 입니다.</div>
                <ul class="field-box">
                    <li>
                        <div class="required-icon">쇼핑몰 기능</div>
                        <div class="field-input" v-if="!mobileView">

                            <ul class="switch-ul">
                                <li :class="shopUseClass.yes" @click="shopUseToggle('yes')"> 사용</li>
                                <li :class="shopUseClass.no" @click="shopUseToggle('no')"> 미사용</li>
                            </ul>
                        </div>
                        <div class="switch-box-top" v-else>
                            <v-switch class="switch-box"
                                      v-model="shopUse"
                                      color="#F2554C"
                                      value="yes"
                                      inset
                                      dense
                            ></v-switch>
                        </div>
                    </li>
                    <li v-if="mobileView && !agreeShow" class="agree-msg">
                        - 쇼핑몰과 연동하여 입점몰 형태로 계정이 생성됩니다.<br>
                        - 쇼핑몰 관리는 쇼핑몰 관리자에서 직접 상품 등록 ~판매까지 진행<br>&nbsp;&nbsp;&nbsp; 해주시면 됩니다.<br>
                        - 페르소나에이아이는 상품 판매 시 법적 책임을 지지 않습니다.
                    </li>
                </ul>
                <div v-if="agreeShow">
                    <div class="item-title">
                        쇼핑몰 온라인 계약
                    </div>
                    <div class="agree-msg">
                        DUCKKU BJ의 쇼핑몰을 사용하기 위한 온라인 계약입니다.<br> 페르소나에이아이에서 제공하는 DUCKKU BJ서비스는 무료이나, 쇼핑몰 솔루션과 PG수수료는
                        5%로 제공합니다.
                    </div>
                    <ul class="field-box">
                        <li  v-if="!mobileView">
                            <div class="required-icon">쇼핑몰 관리자</div>
                            <div class="field-input">

                                <v-btn class="btn" @click="goShop()">열기</v-btn>
                            </div>
                        </li>
                        <li>
                            <div class="required-icon" v-if="!mobileView">약관</div>
                            <div class="field-input">
                                <div class="agree" v-html="shopAgree"></div>
                            </div>
                        </li>
                    </ul>
                    <div class="agree-button-box">

                        <v-btn class="submit-button" @click="formSubmit()">동의하기</v-btn>
                    </div>

                </div>
            </div>

        </div>
        <form id="sfrm" style="display:none" method="post"  action="https://shopduckku.com/mypage/page.php">
            <input type="hidden" name="code" value="seller_main"/>
            <input type="hidden" name="jwtToken" id="jwtToken" />
        </form>
    </div>
</template>


<script>
import AUTH from '../../../api/auth'
import {
    API_URL_SHOPUSE_UPDATE,
    API_URL_MEMBER_GET_SHOP_TOKEN,
    API_URL_MEMBER_GET_BANK,
} from '../../../api/urls';
import apiService from '../../../api/apiService';
import JQ from "jquery";
import {mapActions} from "vuex";

export default {
    name: 'shopSetting',
    watch: {
      shopUse(val) {
          if(this.$isMobile()) {
              if (val == 'yes') {
                  this.agreeShow = true
                 // this.formSubmit();
              } else if(val=='no') {

                  this.agreeShow = false
                  this.formSubmit();
              } else {
                  this.shopUse='no'
              }
          }
      }
    },
    data() {
        return {
            insertFlag: false,
            mobileView: false,
            mobileClass: '',
            shopUse: 'no',
            shopUseClass: {
                yes: '',
                no: 'active',
            },
            shopAgree: '약관 내용이 나옵니다',
            agreeShow: false,
            getServerShopUse:'',


        }
    },
    created() {
       this.getData();
        if (this.$isMobile()) {
            this.mobileView = true;
            this.mobileClass = 'mobile'
            this.setClass('sub')
            this.setTitle('쇼핑몰 관리');
            this.setBackUrl('');
        }
    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
        getData() {
            const frm = new FormData()
            apiService.post(API_URL_MEMBER_GET_BANK, frm, (res) => {
                let shopUse = (res.info.shopUse) ? res.info.shopUse : 'no';
                this.getServerShopUse = shopUse;
                this.shopUseToggle(shopUse)
            })
        },
        shopUseToggle(code) {
            let yesClass = '';
            let noClass = '';
            this.shopUse = code;
            if (code == 'yes') {
                this.agreeShow = true
                yesClass = 'active';
            } else {
                this.agreeShow = false
                noClass = 'active';
                this.formSubmit();
            }

            this.shopUseClass.yes = yesClass;
            this.shopUseClass.no = noClass;
        },
        goShop() {
            if (this.getServerShopUse=='yes') {
                const frm = new FormData()
                apiService.post(API_URL_MEMBER_GET_SHOP_TOKEN, frm, (res) => {
                    if(res.result=='succ' && res.token) {

                        window.open('','shopWin');
                        JQ('#jwtToken').val(res.token);
                        JQ('#sfrm').attr('target','shopWin');
                        JQ('#sfrm').submit()
                    }

                });
            } else {
                let params = {
                    message: '먼저 쇼핑몰사용정보를 저장해 주세요',
                };
                this.$eventBus.$emit('modalOpen', params);
            }
        },
        formSubmit() {
            if (this.insertFlag) return;
            this.insertFlag = true;


            const frm = new FormData()
            frm.append('shopUse', this.shopUse)
            if(this.shopUse=='yes')this.$eventBus.$emit('overlay', 'show');

            apiService.post(API_URL_SHOPUSE_UPDATE, frm, (res) => {
                this.insertFlag = false

                if(this.shopUse=='yes') {
                    this.$eventBus.$emit('overlay', 'hide');
                }
                let result = res.result;

                if(this.shopUse=='yes') {
                    let params = {}
                    switch (result) {
                        case 'fail':
                            params = {
                                message: '시스템 에러',
                            };
                            this.$eventBus.$emit('modalOpen', params);
                            break;
                        case 'succ':
                            this.getServerShopUse = 'yes';
                            params = {
                                message: '쇼핑몰사용정보를 저장하였습니다',
                            };
                            this.$eventBus.$emit('modalOpen', params);
                            break;
                    }
                } else {
                    this.getServerShopUse = 'no';
                }
            })
        },
    },

}
</script>

<style lang="scss" scoped>
.mypage-container {
    .space {
        height: 20px;
    }
    .item-title {
        margin-top:50px;
        font-size:13pt;
        font-weight:bold;
        color:#000;
    }
    .agree-msg {
        font-size:11pt;
        color:#666;
        margin:10px 0 25px 0;

    }
    .field-input {
        .btn {
            margin:0 0 25px 0;
            width:240px;
            background: #686EFB;
            border-radius: 6px;
            color: #fff;
            height:50px;

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
    .agree {
        margin-bottom:25px;
        border:solid 1px #dcdcdc;
        padding:20px;
        width:700px;
        height:300px;
        font-size:10pt;
        overflow-y:auto;
        background:#fafafa;
    }
    .agree-button-box {
        width:100%;
        padding:40px 0 50px 500px;

        .submit-button {
            border-radius: 0;
            padding: 0;
            background: #686EFB;
            color: #fff;
            min-height: 70px;
            width: 350px;
            font-size: 14pt;
        }
    }
    &.mobile {
        width: 100%;
        margin:0;
        overflow-x:hidden;
        padding:30px 15px;
        .contents {
            padding:0;
        }
        .item-title {
            padding-left:20px;
            margin-top:20px;
            font-size:11pt;
            font-weight:bold;
            color:#000;
        }
        .agree-msg {
            font-size:11pt;
            color:#666;
            margin:10px 0 25px 0;

        }
        .field-box {
            li {
                border:none;
                border-bottom:solid 1px #dcdcdc;
                padding:0;
                display:flex;
                .required-icon {
                    width:90%;
                    padding-left:20px;
                    font-size:11pt;
                }
                .switch-box-top {
                    width:40px;
                }
                &.agree-msg {
                    padding-left:0;
                    padding-top:10px;
                    border-bottom:none;
                }
                .field-input {
                    margin-top:-10px;
                    width:100%;
                }
            }
        }
        .agree-msg {
            font-size:8pt;
            color:#999;
            padding-left:10px;
            margin:10px 10px 25px 10px;

        }
        .agree {
            margin-bottom:25px;
            border:solid 1px #dcdcdc;
            padding:20px;
            width:100%;
            height:200px;
            font-size:10pt;
            overflow-y:auto;
            background:#fafafa;
        }
        .agree-button-box {
            padding:0;
            .submit-button {
                border-radius: 0;
                padding: 0;
                background: #686EFB;
                color: #fff;
                min-height: 50px;
                width:100%;
                font-size: 11pt;
            }
        }

    }

}


</style>