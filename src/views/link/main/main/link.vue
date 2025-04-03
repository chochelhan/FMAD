<template>
    <div :class="'page-container '+mobileClass">

        <div class="contents">
            <div class="from-box">

                <ul class="add-button-box">
                    <li>
                        <v-btn
                                type="button"
                                class="submit-button" rounded @click="addLink('default')">
                            링크추가
                        </v-btn>
                    </li>
                    <li>
                        <v-btn
                            type="button"
                            class="submit-button blue" rounded @click="addLink('shop')">
                            쇼핑몰 추가
                        </v-btn>
                    </li>

                </ul>
                <ul class="field-box">
                    <draggable v-model="linkList" style="width:100%;" @change="sortUpdate"  handle=".icon-move">

                        <li v-for="(item,index) in linkList" :key="index+'nt'">
                            <div class="link-header">
                                <div class="field-input">
                                    <v-text-field
                                           v-model="item.name"
                                           placeholder="버튼명 입력하세요"
                                           @blur="nameTouch(index)"
                                           label="버튼명"
                                           dense
                                    ></v-text-field>
                                </div>
                                <div class="icon-move">
                                    <i class="fas fa-arrows-alt"></i>
                                </div>
                            </div>
                            <div class="field-input">
                                <v-text-field
                                       v-model="item.link"
                                       placeholder="링크를 입력하세요"
                                       @blur="linkTouch(index)"
                                       dense
                                       :readonly="((item.readonly=='yes')?true:false)"
                                       label="링크명"
                                />
                            </div>
                            <div class="switch-box">
                                <i :class="'far fa-eye '+item.use" @click="setUse(index)"></i>
                                <i class="fas fa-trash-alt" @click="deleteItem(index)"></i>

                            </div>
                        </li>
                    </draggable>
                </ul>

            </div>
        </div>

    </div>
</template>


<script>
    import AUTH from '../../../../api/auth'
    import {mapActions, mapGetters} from "vuex";
    import {
        API_URL_LINK_LINK_UPDATE,
    } from '../../../../api/urls';
    import apiService from '../../../../api/apiService';
    import draggable from "vuedraggable";

    export default {
        name: 'linkMainLink',
        components: {
            draggable,
        },
        computed: {
            ...mapGetters('link', ["getLinkData", "getServerFlag"]),
        },
        watch: {
            getServerFlag(val) {
                if (val) {
                    this.setData();
                }
            }
        },
        data() {
            return {
                insertFlag: false,
                linkList: [],
                mobileView: false,
                mobileClass: '',
            }
        },
        created() {
            if (this.$isMobile()) {
                this.mobileView = true;
                this.mobileClass = 'mobile'
            }
            if (this.getServerFlag) {
                this.setData();
            }

        },
        methods: {
            ...mapActions('link', ["setLinkData"]),
            setData() {
                for(let item of this.getLinkData) {
                    this.linkList.push(item)
                }

            },
            addLink(cmd) {
                let item = {}
                if(cmd=='shop') {
                    let memberInfo = AUTH.getSession(this.$isMobile());
                    let link = location.protocol+'//'+memberInfo.uid+'.linkduckku.com'
                    let selItem = this.linkList.find((item)=>item.readonly=='yes')
                    if(!selItem) {
                        item = {name: '', link: link, use: 'yes', readonly: 'yes'}
                    } else return;
                } else {
                    item = {name: '', link: '', use: 'yes',readonly:'no'}
                }
                this.linkList.unshift(item)
            },
            linkTouch(index) {
                this.validate()
            },
            nameTouch(index) {
                this.validate()
            },
            deleteItem(index) {
                if (this.linkList[index].name && this.linkList[index].link) {
                    let params = {
                        type: 'confirm',
                        message: '삭제하시겠습니까?',
                        doAction: () => {
                            this.linkList.splice(index, 1);
                            this.validate()
                        }
                    }
                    this.$eventBus.$emit('modalOpen', params)
                } else {
                    this.linkList.splice(index, 1);
                }


            },
            setUse(index) {
                if (this.linkList[index].use == 'yes') this.linkList[index].use = ''
                else this.linkList[index].use = 'yes'
                this.validate()
            },
            validate() {
                let senDatas = [];
                for (let item of this.linkList) {
                    if (item.name && item.link) {
                        senDatas.push(item);
                    }

                }
                this.formSubmit(senDatas);

            },
            sortUpdate() {
                this.validate()
            },
            formSubmit(senDatas) {
                if (this.insertFlag) return;
                this.insertFlag = true;


                const frm = new FormData()
                frm.append('links', JSON.stringify(senDatas))

                apiService.post(API_URL_LINK_LINK_UPDATE, frm, (res) => {
                    this.setLinkData(senDatas)
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
            width:100%;
            padding:0;
            display: flex;
            justify-content: flex-end;
            .from-box {
                width:100%;
                overflow: hidden;
                .add-button-box {
                    width: 100%;
                    padding: 0;
                    margin-bottom: 48px;
                    li {
                        width: 100%;
                        .submit-button {
                            margin: 0;
                            width:100%;
                            height: 56px;
                            background:#F2554C;
                            color: #fff;
                            &.blue {
                                margin-top:15px;
                            }
                        }
                    }
                }

                .space {
                    height: 20px;
                }
                .field-box {
                    padding: 0;
                    margin: 0;
                    li {
                        width: 100%;
                        margin: 0 0 24px 0;
                        box-shadow: 0px 3px 3px #0000000F;
                        background: #fff;
                        border-radius: 24px;
                        padding:30px 30px 10px 30px;

                        .link-header {
                            position:relative;
                            .icon-move {
                                cursor:move;
                                position:absolute;
                                top:-20px;
                                right:0;
                                font-size: 14pt;
                                color:#9AA4C7;
                            }

                        }
                        .switch-box {
                            text-align: right;
                            padding:0;
                            margin-top:-10px;
                            i {
                                color:#9AA4C7;
                                font-size: 14pt;
                                margin-left: 15px;
                                cursor: pointer;
                                &.yes {
                                    color:#F2554C;
                                }
                            }
                        }

                    }
                }
            }
        }
        &.mobile {
            width: 100%;
            padding:0;
            .submit-button {
            }
            .tab {
                width: calc(100vw);
                margin-left: -20px;

                li {
                    font-size: 12pt;
                }
            }

        }

    }


</style>