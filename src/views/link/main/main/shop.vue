<template>
    <div class="page-container">

        <div :class="'contents '+mobileClass">
            <div class="from-box">

                <div class="input-header">
                    <div class="title-box">
                        쇼핑몰 사용
                    </div>
                    <div class="switch-box">
                        <v-switch
                                color="#F2554C"
                                v-model="shopUse"
                                value="yes"
                                inset
                        ></v-switch>
                    </div>
                </div>
                <div class="guide-box">
                &middot; 쇼핑몰과 연동하여 분양몰 형태로 계정이 생성됩니다.<br> &middot;  쇼핑몰 관리는 쇼핑몰 관리자에서 직접 상품 등록 ~ 판매까지 진행해주시면 됩니다. <br> &middot;  페르소나에이아이는 상품 판매 시 법적 책임을 지지 않습니다.
                </div>
                <div v-if="agreeShow">
                    <div class="input-header">
                        <div class="title-box">
                            쇼핑몰 바로가기
                        </div>
                        <div class="switch-box">
                            <v-btn class="btn" @click="goShop('user')">열기</v-btn>
                        </div>
                    </div>
                    <div class="input-header">
                        <div class="title-box">
                            쇼핑몰 관리자
                        </div>
                        <div class="switch-box">
                            <v-btn class="btn" @click="goShop('admin')">열기</v-btn>
                        </div>
                    </div>
                    <div class="item-title up-margin">
                        쇼핑몰 온라인 계약
                    </div>
                    <div class="agree-box">
                        <div class="agree-msg">
                            DUCKKU BJ의 쇼핑몰을 사용하기 위한 온라인 계약입니다.<br> 페르소나에이아이에서 제공하는 DUCKKU BJ서비스는 무료이나, 쇼핑몰 솔루션과 PG수수료는
                            5%로 제공합니다.
                        </div>
                        <div class="agree-title">약관</div>
                        <div class="agree" v-html="shopAgree"></div>
                        <v-btn class="btn" @click="formSubmit()">동의하기</v-btn>
                    </div>

                </div>
            </div>
        </div>
        <form id="sfrm" style="display:none" target="linkShopWin" method="post"  action="http://linkduckku.com/mypage/page.php">
            <input type="hidden" name="code" value="seller_main"/>
            <input type="hidden" name="jwtToken" id="jwtToken" />
        </form>
    </div>

</template>


<script>
    import AUTH from '../../../../api/auth'
    import {mapActions, mapGetters} from "vuex";
    import {
        HOST,
        API_URL_LINK_SHOPUSE_UPDATE,
        API_URL_MEMBER_GET_SHOP_TOKEN
    } from '../../../../api/urls';
    import apiService from '../../../../api/apiService';
    import JQ from 'jquery'

    export default {
        name: 'linkMainShop',
        computed: {
            ...mapGetters('link', ["getShopUse", "getServerFlag"]),
        },
        watch: {
            getServerFlag(val) {
                if (val) {
                    if (this.getShopUse) {
                        this.shopUse = (this.getShopUse == 'yes') ? 'yes' : '';
                    }
                }
            },
            shopUse(val) {
                if (val == 'yes') {

                    this.agreeShow = true;
                } else {
                    this.agreeShow = false;
                    this.formSubmit()
                }
            }
        },
        data() {
            return {
                insertFlag: false,
                shopUse: '',
                shopAgree: '약관 내용이 나옵니다',
                mobileView: false,
                mobileClass: '',
                agreeShow: false,
            }
        },
        created() {
            if (this.$isMobile()) {
                this.mobileView = true;
                this.mobileClass = 'mobile'
            }
            if (this.getServerFlag) {
                if (this.getShopUse) {
                    this.shopUse = (this.getShopUse == 'yes') ? 'yes' : '';
                }
            }

        },
        methods: {
            ...mapActions('link', ["setShopUse"]),
            goShop(cmd) {
               if (this.getShopUse=='yes') {
                   const frm = new FormData()
                   apiService.post(API_URL_MEMBER_GET_SHOP_TOKEN, frm, (res) => {
                       if(res.result=='succ') {
                           window.open('','linkShopWin');
                           if(cmd=='admin') {

                               JQ('#sfrm').attr('action',location.protocol+'//linkduckku.com/mypage/page.php');
                           } else {
                               let memberInfo = AUTH.getSession(this.$isMobile());
                               if(this.mobileView) {
                                   JQ('#sfrm').attr('action',location.protocol+'//'+memberInfo.uid+'.linkduckku.com/m/');
                               } else {
                                   JQ('#sfrm').attr('action',location.protocol+'//'+memberInfo.uid+'.linkduckku.com');
                               }

                           }
                           JQ('#jwtToken').val(res.token);
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

                apiService.post(API_URL_LINK_SHOPUSE_UPDATE, frm, (res) => {
                    this.insertFlag = false
                    if(this.shopUse=='yes') {
                        this.$eventBus.$emit('overlay', 'hide');
                    } else {
                        this.setShopUse(this.shopUse)
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
                                this.setShopUse(this.shopUse)
                                params = {
                                    message: '쇼핑몰사용정보를 저장하였습니다',
                                };
                                this.$eventBus.$emit('modalOpen', params);
                                break;
                        }
                    }
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
            width: 880px;
            padding: 0;
            display: flex;
            justify-content: flex-end;
            .from-box {
                width: 880px;
                overflow: hidden;
                .item-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 15px;
                }
                .input-header {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    height: 56px;
                    border-radius: 5px;
                    background: #fff;
                    padding: 16px 18px;
                    margin-bottom: 20px;
                    .field-input {
                        padding: 0;
                        width: 100%;
                        input[type="text"] {
                            margin-top: -6px;
                            width: 100%;
                            background: #fff;
                            border: none;
                            height: 40px;
                            &:focus {
                                outline: none;
                            }

                        }
                    }
                    .title-box {
                        color: #333;
                        font-size: 16px;
                        font-weight: 600;
                    }
                    .switch-box {
                        margin-top: -20px;
                        text-align: right;
                    }
                    .btn {
                        margin-top: 14px;
                        background: #F2554C;
                        border-radius: 6px;
                        color: #fff;
                        height: 36px;

                    }
                }
                .guide-box {
                    margin:20px 0;
                    font-size:10pt;
                }
                .up-margin {
                    margin-top:50px;
                }
                .agree-box {
                    width: 100%;
                    border-radius: 5px;
                    background: #fff;
                    padding: 20px;
                    font-size: 10pt;
                    text-align: left;
                    .agree-msg {
                        text-align: left;
                    }
                    .agree-title {
                        text-align: left;
                        font-size: 12pt;
                        font-weight: 600;
                        padding: 20px 0 10px 0;
                    }
                    .agree {
                        text-align: left;
                        width: 100%;
                        height: 208px;
                        background: #686EFB0F 0% 0% no-repeat padding-box;
                        border: 1px solid #DCDCDC;
                        padding: 15px;
                        overflow-y: auto;
                    }
                    text-align: center;
                    .btn {
                        margin: 30px auto 0 auto;
                        color: #fff;
                        width: 270px;
                        height: 48px;
                        background: #F2554C;
                        border-radius: 6px;

                    }
                }
            }

            &.mobile {
                width:100%;
                display:block;
                .from-box {
                    width:100%;
                    .agree-box {
                        .btn {
                            width:100%;

                        }
                    }
                }

            }
        }

    }


</style>