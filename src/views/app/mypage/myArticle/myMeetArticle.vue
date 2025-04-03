<template>
    <div :class="'data-contents '+mobileClass">

        <ul class="meet-list">
            <li v-for="(data,index) in dataList">
                <div class="meet-box" @click="showInfo(data.no)">

                    <div class="meet-name">{{ data.name }} ({{ data.totalJoin }})</div>
                    <div class="meet-info"><img src="../../../../assets/images/ico_m1.png">{{ data.gdate }}</div>
                    <div class="meet-info"><img src="../../../../assets/images/ico_m2.png">{{ data.garea }}</div>
                    <div class="meet-info"><img src="../../../../assets/images/ico_m3.png">{{ data.price }}</div>
                </div>
                <div class="button-box">
                    <v-btn v-if="uid != ownerUid"
                           class="reg-btn"
                           @click="meetJoin(data.no,data.join)"
                    >
                        {{ data.joinText }}
                    </v-btn>
                    <i class="fas fa-ellipsis-v" v-if="uid == ownerUid" @click="showEditBox(index)"></i>
                </div>
            </li>
        </ul>
        <div v-if="dataList.length<1" class="empty-data">
            데이타가 존재하지 않습니다
        </div>

        <div style="height:40px"></div>
        <v-dialog
            v-model="modalShow"
            :width="modalWidth"
            style="z-index:100"
        >
            <meetRegist :ownerUid="ownerUid" :no="selectedNo" v-if="meetRegistShow" @modalHide="modalHide"></meetRegist>
            <meetView :no="selectedNo" v-if="meetViewShow" @modalHide="modalHide"></meetView>
            <div class="content-modal-box" v-if="screenView">
                <span @click="editBoxHide()"><i class="fa fa-times"></i></span>
                <div style="clear:both;"></div>
                <ul>
                    <li @click="showAttend()">참가자 보기</li>
                    <li @click="updateMeet()">수정 하기</li>
                    <li @click="deleteMeet()">삭제 하기</li>
                </ul>
            </div>
            <div class="content-modal-box" v-if="attendView">
                <span @click="attendBoxHide()"><i class="fa fa-times"></i></span>
                <div style="clear:both;"></div>
                <ul>
                    <li class="nocursor" v-for="user in meetUserList">{{ user.name }}
                        ({{ (user.pcs) ? user.pcs : user.uid }})
                    </li>
                    <li class="nocursor" v-if="meetUserList.length<1">
                        참가신청한 회원이 없습니다
                    </li>
                </ul>
            </div>
        </v-dialog>
    </div>
</template>


<script>
import {
    API_URL_MEMBER_MY_ARTICLE_LIST,
    API_URL_MEET_JOIN_LIST,
    API_URL_MEET_JOIN_INSERT,
    API_URL_MEET_DELETE
} from '../../../../api/urls';
import apiService from '../../../../api/apiService';
import meetRegist from '../../bj/meeting/meetRegist'
import meetView from '../../bj/meeting/meetView'

export default {
    name: 'meetList',
    components: {
        meetRegist,
        meetView,

    },
    watch: {
        modalShow(val) {
            if (!val) {
                this.meetRegistShow = false;
                this.meetViewShow = false;
                this.screenView = false;
                this.attendView = false;
                this.selectedNo = '';
                this.selectedIndex = '';

            }
        }
    },
    data() {
        return {
            modalShow: false,
            meetRegistShow: false,
            meetViewShow: false,
            uid: '',
            selectedNo: '',
            ownerUid: '',
            dataList: [],
            modalWidth: 600,
            screenView: false,
            selectedIndex: '',
            meetUserList: '',
            attendView: false,
            mobileView: false,
            mobileClass: '',

        }
    },
    created() {
        this.getData();
        if (this.$isMobile()) {
            this.mobileView = true;
            this.mobileClass = 'mobile'

        }
    },
    methods: {
        modalHide(cmd) {
            this.modalShow = false;
            this.meetRegistShow = false;
            this.meetViewShow = false;
            this.screenView = false;
            this.selectedNo = '';
            this.selectedIndex = '';
            if (cmd == 'reload') {
                this.getData();
            }
        },
        showRegistBox() {
            if (this.uid == this.ownerUid) {
                this.modalWidth = 600
                this.modalShow = true;
                this.meetRegistShow = true;
            }
        },
        getData() {
            this.dataList = [];
            const frm = new FormData()
            frm.append('cmd', 'meet')
            apiService.post(API_URL_MEMBER_MY_ARTICLE_LIST, frm, (res) => {
                this.dataList = [];
                for (let item of res.list) {
                    item.joinText = '참석';
                    item.join = 'no';
                    if (item.joinList && this.uid) {
                        if (item.joinList[this.uid]) {
                            item.joinText = '신청완료';
                            item.join = 'yes';
                        }
                    }
                    this.dataList.push(item);
                }
            });

        },
        showInfo(no) {
            this.modalWidth = 600
            this.selectedNo = no;
            this.modalShow = true;
            this.meetViewShow = true;
        },
        meetJoin(no, join) {
            if (join == 'yes') return;
            if (!this.uid) {
                this.setLoginBoxOpen(true);
                return;
            }
            const frm = new FormData()
            frm.append('no', no)
            this.$eventBus.$emit('overlay', 'show');
            apiService.post(API_URL_MEET_JOIN_INSERT, frm, (res) => {
                this.$eventBus.$emit('overlay', 'hide');
                if (res.msg == 'full') {
                    let params = {
                        message: '죄송합니다 최대 참가인원을 초과하였습니다',
                    };
                    this.$eventBus.$emit('modalOpen', params);
                } else {
                    this.getData();
                    let params = {
                        message: '참가 신청이 접수되었습니다',
                    };
                    this.$eventBus.$emit('modalOpen', params);
                }
            });

        },
        showEditBox(index) {
            if (this.uid == this.ownerUid) {
                this.selectedIndex = index;
                this.modalWidth = 300
                this.modalShow = true;
                this.screenView = true;
            }
        },
        editBoxHide() {
            this.selectedIndex = '';
            this.modalShow = false;
            this.screenView = false;
        },
        updateMeet() {
            this.screenView = false;
            this.selectedNo = this.dataList[this.selectedIndex].no;
            this.showRegistBox();
        },
        deleteMeet() {
            let params = {
                type: 'confirm',
                message: '모임을 삭제 하시겠습니까?',
                doAction: () => {
                    this.deleteActive();
                }
            };
            this.$eventBus.$emit('modalOpen', params);
        },
        deleteActive() {
            const frm = new FormData()
            frm.append('no', this.dataList[this.selectedIndex].no)
            this.$eventBus.$emit('overlay', 'show');
            apiService.post(API_URL_MEET_DELETE, frm, (res) => {
                this.$eventBus.$emit('overlay', 'hide');
                this.modalShow = false;
                this.getData();
                let params = {
                    message: '모임이 삭제 되었습니다',

                };
                this.$eventBus.$emit('modalOpen', params);

            });
        },
        showAttend() {
            const frm = new FormData()
            frm.append('no', this.dataList[this.selectedIndex].no)
            this.$eventBus.$emit('overlay', 'show');
            apiService.post(API_URL_MEET_JOIN_LIST, frm, (res) => {
                this.$eventBus.$emit('overlay', 'hide');
                this.meetUserList = res.list;
                this.screenView = false;
                this.attendView = true;

            });
        },
        attendBoxHide() {
            this.selectedIndex = '';
            this.modalShow = false;
            this.attendView = false;
        }


    }

}
</script>

<style lang="scss" scoped="true">
.data-contents {
    width: 100%;
    margin-top: 25px;

    .empty-data {
        height: 150px;
        text-align: center;
        line-height: 150px;
        font-size: 10pt;
        background: #fff;
        color: #999;
        border-top: solid 1px #dcdcdc;
        border-bottom: solid 1px #dcdcdc;
    }

    .meet-list {
        padding: 0;
        width: 100%;

        li {
            border: solid 1px #dcdcdc;
            margin-bottom: 20px;
            background: #fff;
            display: flex;
            color: #000;
            padding: 30px;

            .meet-box {
                width: 95%;
                cursor: pointer;

                .meet-name {
                    font-size: 14pt;
                    font-weight: bold;
                }

                .meet-info {
                    margin-top: 10px;
                    font-size: 10pt;

                    img {
                        width: 14px;
                        margin-right: 7px;
                        margin-bottom: -3px;

                    }
                }

            }

            .button-box {
                min-width: 100px;
                width: 100px;
                text-align: right;

                .reg-btn {
                    background: #686EFB;
                    color: #fff;
                    border-radius: 0;
                    width: 100%;
                    height: 50px;
                    font-size: 13pt;

                }

                i {
                    font-size: 15pt;
                    margin-top: 10px;
                    cursor: pointer;
                }
            }
        }
    }


    &.mobile {
        padding:0 15px;
        .meet-list {
            li {
                border:none;
                border-bottom: solid 1px #dcdcdc;
                margin-bottom:0;
                background: #fff;
                display: flex;
                color: #000;
                padding:15px;

                .meet-box {
                    .meet-name {
                        fon-size: 11pt;
                    }

                    .meet-info {
                        margin-top:8px;
                        font-size: 9pt;
                        img {
                            width: 12px;
                            margin-right: 7px;
                            margin-bottom: -4px;

                        }
                    }

                }

                .button-box {
                    min-width: 50px;
                    width: 50px;
                    text-align: right;

                    .reg-btn {
                        margin-top:40px;
                        background: #686EFB;
                        color: #fff;
                        border-radius:4px;
                        width: 60px;
                        height: 30px;
                        font-size: 10pt;

                    }

                    i {
                        font-size: 12pt;
                        margin-top: 10px;
                        cursor: pointer;
                    }
                }
            }
        }


    }
}
.content-modal-box {
    background: #fff;
    z-index: 10;

    span {
        float: right;
        display: inline-block;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #000;
        color: #fff;
        text-align: center;
        margin: 10px 10px 0 0;
        cursor: pointer;

    }

    ul {
        padding: 0;
        padding-bottom: 20px;

        li {
            padding: 10px;
            text-align: center;
            font-size: 11pt;
            font-weight: bold;
            cursor: pointer;

            &.nocursor {
                cursor: default;
            }
        }
    }
}
</style>