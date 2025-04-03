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
                            <div class="desc">구독자 {{info.readNum}}명</div>
                        </div>
                    </div>
                    <div class="folling-button-box">
                        <v-btn :class="'folling-button '+info.myBjClass" @click="readBj(info)">
                            <i class="fas fa-heart"></i> 구독
                        </v-btn>
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
    .empty-div {
        text-align: left;
        color: #000;
        line-height: 130px;
        font-size: 15pt;
    }

    .folling-box {
        height: 230px;
        padding: 40px;
        margin-bottom: 30px;
        position: relative;

        .folling-title {
            color: #000;
            font-weight: bold;
            font-size: 13pt;
            margin-bottom: 15px;
        }


        .bj-list {
            color: #000;
            margin-bottom: 60px;
            cursor: pointer;
            padding: 0;
            display: flex;
            flex-wrap: wrap;

            .padding-box {
                background: #F4F4F4;
                padding: 20px 15px 15px 15px;
                margin: 0 20px 20px 0;
                .top-box {
                    width: 289px;
                    max-width: 289px;
                    display: flex;
                    .img-box {
                        width: 70px;
                        min-width: 70px;
                        height: 70px;
                        min-height: 70px;
                        border-radius: 50%;
                        background: #225CA2;
                        overflow: hidden;
                        text-align: center;

                        img {
                            width: 100%;
                            min-height: 70px;
                        }

                        i {
                            color: #fff;
                            font-size: 28pt;
                            margin-top: 15px;
                        }

                    }

                    .info-box {
                        margin-left: 10px;

                        .subject {
                            margin-top: 10px;
                            font-weight: bold;
                            font-size: 13pt;
                            text-align: left;
                            color: #000;
                            font-weight: bold;

                        }

                        .desc {
                            font-size: 10pt;
                            color: #999;
                            margin-top: 10px;
                        }
                    }
                }

                .folling-button-box {
                    overflow: hidden;
                    margin-top: 15px;
                    .folling-button {
                        width: 100%;
                        padding: 0;
                        height: 40px;
                        background: #999999;
                        color: #fff;
                        text-align: center;
                        border-radius: 3px;

                        i {
                            margin-right: 5px;
                        }

                        &.myBj {
                            background:#225CA2;
                            color: #fff;

                        }
                    }
                }
            }
        }
    }
</style>
