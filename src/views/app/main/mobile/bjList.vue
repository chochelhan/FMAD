<template>
    <div class="content-container">
        <div class="folling-box">
            <div class="folling-title">소속 & 파트너 인플루언서</div>
            <ul class="bj-list">
                <li class="padding-box" v-for="info in bjList">
                    <div class="top-box">
                        <div class="img-box" @click="goBj(info.uid)">
                            <img v-if="info.photo" :src="host+info.photo">
                            <i class="fas fa-user" v-else></i>
                        </div>
                        <div class="info-box" @click="goBj(info.uid)">
                            <div class="subject">{{info.name}}</div>
                            <div class="desc" style="font-size:9pt">구독자 {{info.readNum}}명</div>
                        </div>
                    </div>
                    <div class="folling-button-box">
                            <i :class="'folling-button '+info.myBjClass" @click="readBj(info)" class="fas fa-heart"></i>
                    </div>

                </li>
            </ul>
        </div>

    </div>
</template>

<script>
    import {mapActions, mapGetters} from "vuex";
    import {
        HOST,
        youtubeTypeList,
        API_URL_MEMBER_BJLIST,
        API_URL_MESSAGE_USER_UPDATE
    } from '../../../../api/urls';
    import apiService from '../../../../api/apiService';
    import AUTH from '../../../../api/auth';

    export default {
        computed: {
            ...mapGetters('member', ["getUid"])
        },
        watch: {
            getUid(val) {
                if (val) {
                    this.setMemberInfo();
                }
            },
        },
        data() {
            return {

                host: HOST,
                bjList: [],
                isLogin: false,
                uid: '',

            };
        },
        created() {
            this.setMemberInfo();
        },
        methods: {
            ...mapActions('member', ["setLoginBoxOpen"]),
            getData() {
                this.bjList = [];
                const frm = new FormData()
                apiService.post(API_URL_MEMBER_BJLIST, frm, (res) => {
                    this.hitFollingList = [];
                    let myBjList = res.myBjList;

                    for (let bj of res.bjList) {
                        if (myBjList && myBjList['bj_' + bj.no]) {
                            bj.myBjClass = 'myBj';
                        } else bj.myBjClass = '';
                        this.bjList.push(bj);
                    }


                });
            },
            goBj(uid) {
                this.$router.push('/' + uid)
            },
            setMemberInfo() {
                let memberInfo = AUTH.getSession(this.$isMobile());
                if (memberInfo.AUTHTOKEN) {
                    this.isLogin = true;
                    this.uid = memberInfo.uid;
                }
                this.getData();
            },
            readBj(data) {
                if (!this.isLogin) {
                    this.setLoginBoxOpen(true);
                    return;
                }
                let myBj = data.myBjClass;
                let uid = data.uid;
                if (this.uid == uid) {
                    return;
                }
                const frm = new FormData()
                frm.append('targetUid', uid)
                this.$eventBus.$emit('overlay', 'open');
                apiService.post(API_URL_MESSAGE_USER_UPDATE, frm, (res) => {
                    this.$eventBus.$emit('overlay', 'hide');
                    if (myBj != 'myBj') {
                        data.myBjClass = 'myBj';
                    } else data.myBjClass = '';
                    data.readNum = res.mypen;

                    let params = {
                        message: '구독 정보가 저장되었습니다',

                    };
                    this.$eventBus.$emit('modalOpen', params);

                });

            }
        }

    }
</script>
<style lang="scss" scoped="true">
    .content-container {
        width: 100%;
        padding: 0 0 60px 0;
        min-height: calc(100vh - 60px);
        background: #fff;
        margin: 0;
        .folling-box {
            padding: 10px;
            margin-bottom: 20px;
            .folling-title {
                color: #000;
                font-weight: 600;
                font-size: 12pt;
                margin-bottom: 10px;
            }

            .bj-list {
                padding: 0;

                .padding-box {
                    color: #fff;
                    margin-bottom: 10px;
                    background: #fafafa;
                    padding: 10px;
                    display: flex;
                    justify-content: space-between;
                    .top-box {
                        color: #999;
                        padding: 10px;
                        display: flex;
                        .img-box {
                            width: 45px;
                            min-width: 45px;
                            height: 45px;
                            min-height: 45px;
                            border-radius: 50%;
                            background: #686EFB;
                            overflow: hidden;
                            text-align: center;

                            img {
                                width: 100%;
                                min-height: 45px;
                            }

                            i {
                                color: #fff;
                                font-size: 18pt;
                                margin-top: 10px;
                            }

                        }

                        .info-box {
                            margin-left:15px;
                            .subject {
                                margin-top: 0;
                                font-weight: bold;
                                font-size: 11pt;
                                text-align: left;
                                color: #000;
                                width: 220px;
                                font-weight: bold;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;


                            }


                        }
                    }
                    .folling-button-box {
                        overflow: hidden;
                        margin-top: 25px;
                        padding-right: 5px;
                        .folling-button {
                            padding: 0;
                            color: #DCDCDC;
                            font-size:15pt;
                            &.myBj {
                                color:#686EFB;

                            }
                        }

                    }
                }
            }
        }
    }
</style>
