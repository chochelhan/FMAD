<template>
    <div class="layout-page-container">
        <div class="left-container">
            <div class="myinfo-box">
                <div class="myImg-box">
                    <img v-if="photo" :src="host+photo"/>
                    <i v-if="!photo" class="fas fa-user"></i>
                </div>
                <div>
                    <div class="myname" style="color:#000">{{ memberInfo.name }}</div>
                    <div class="myUrl" @click="goMyHome()" style="color:#999">duckku.com/{{ memberInfo.uid }}</div>
                </div>
            </div>
            <div class="menu-box">
                <div v-for="(menu,index) in myMenus">
                    <div class="menu-header" @click="menuToggle(index)">
                        {{ menu.name }}
                    </div>
                    <ul class="menu-ul">
                        <li :class="'menu-li '+subMnu.gclass" v-for="(subMnu,subIndex) in menu.subMenus"
                            @click="goMypageUrl(index,subMnu.code)">
                            {{ subMnu.name }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="logout" @click="logout()" style="position: fixed;bottom:0;left:0;width:100%;height:45px;text-align: center;color:#999;border-top:solid 1px #999;line-height: 45px ">
            로그아웃
        </div>
    </div>
</template>


<script>
import {mapActions, mapGetters} from "vuex";
import AUTH from '../../../api/auth';
import {HOST, API_URL_BROADCAST_GET_MY_BROADCASTINFO} from '../../../api/urls';
import apiService from '../../../api/apiService';

export default {
    name: 'myMobileMenu',
    computed: {
        ...mapGetters('member', ["getBrocastChange"])
    },
    watch: {
        getBrocastChange(val) {
            if (val) {
                this.setMemberInfo();
                this.setBrocastChange(false);
            }
        },


    },
    data() {
        return {
            host: HOST,
            mtype: '',
            memberInfo: {},
            name: '',
            myMenus: [],
            menuPanel: '',
            keyword: '',
            photo: '',
            myMenuShow: false,
            broadcastShow: false,


        }

    },
    created() {
        AUTH.setDevice(this.$isMobile());
        this.setClass('sub')
        this.setTitle('마이페이지');
        this.setBackUrl('');
        sessionStorage.setItem('bjBackUrl','/main/mypage/myMenu')
        this.setMemberInfo();
        this.setMenus();
    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
        ...mapActions('member', ["setMember", "setBrocastChange"]),
        setMenus() {
            let myMenus = [];
            if (this.mtype == 'shop') {
                myMenus.push({
                    name: '페이지 관리', view: false, subMenus: [
                        {name: '페이지 기본관리', code: 'broadcastSetting', gclass: ''},
                        {name: '타이틀 이미지 관리', code: 'broadcastImg', gclass: ''},
                        {name: '게시판 관리', code: 'userBoard', gclass: ''},
                    ]
                });
            } else {
                myMenus.push({
                    name: '페이지 관리', view: false, subMenus: [
                        {name: '페이지 기본관리', code: 'broadcastSetting', gclass: ''},
                        {name: '게시판 관리', code: 'userBoard', gclass: ''},
                    ]
                });
            }
            myMenus.push({
                name: '개인정보 설정', code: 'updateMyInfo', gclass: ''}
            );
            myMenus.push({name: '내가 쓴 글', view: false, code: 'myArticle'});
            let path = this.$route.path.split('/');
            let code = path[3];
            for (let mnu of myMenus) {
                if (mnu.subMenus) {
                    let menuView = false;
                    for (let smnu of mnu.subMenus) {
                        if (smnu.code == code) {
                            smnu.gclass = 'active';
                            menuView = true;
                        } else smnu.gclass = '';
                    }
                    if (menuView) {
                        mnu.view = true;
                    }
                }
            }

            this.myMenus = myMenus;


        },
        menuToggle(index) {
            let i = 0;
            let moveCode = '';
            for (let mnu of this.myMenus) {
                if (i == index) {
                    if (mnu.code) moveCode = mnu.code;
                }
                i++;
            }
            if (moveCode) this.$router.push({path: '/main/mypage/' + moveCode});
        },
        setMemberInfo() {
            let memberInfo = AUTH.getSession(this.$isMobile());
            if (memberInfo.AUTHTOKEN) {
                this.mtype = memberInfo.mtype;
                this.memberInfo = memberInfo;
                this.photo = this.memberInfo.photo;
                if (this.mtype == 'shop') {
                    this.getMyBroadCastInfo();
                } else {
                    this.name = this.memberInfo.unick;
                }


            } else {
                this.$router.push('/');
            }
        },
        getMyBroadCastInfo() {
            const frm = new FormData()
            apiService.post(API_URL_BROADCAST_GET_MY_BROADCASTINFO, frm, (res) => {
                if (res.info.name) {
                    this.name = res.info.name;
                } else {
                    this.name = this.memberInfo.unick;
                }
            });
        },
        goMyHome() {
            if (this.memberInfo.uid == 'admin') {
                let params = {
                    message: '관리자 페이지로 이동됩니다',
                    doAction: () => {
                        this.$router.push('/' + this.memberInfo.uid);
                    }
                }
                this.$eventBus.$emit('modalOpen', params);
            } else {
                this.$router.push('/' + this.memberInfo.uid);
            }

        },
        goMypageUrl(index, cmd) {
            for (let mnu of this.myMenus) {
                if (mnu.subMenus) {
                    for (let smnu of mnu.subMenus) {
                        if (cmd == smnu.code) smnu.gclass = 'active'
                        else smnu.gclass = '';
                    }

                }
            }

            this.$router.push({path: '/main/mypage/' + cmd});

        },
        logout() {
            this.myMenuShow = false;
            this.isLogin = false;
            AUTH.logout(this.$isMobile());
            let params = {
                name: '',
                no: '',
                uid: '',
                mtype: '',
                level: '',
            }
            this.setMember(params);
            let msgParams = {
                message: '로그아웃 되었습니다',
                doAction: () => {
                    location.href='/';
                }
            }
            this.$eventBus.$emit('modalOpen', msgParams);
        },
        mypage(code) {
            for (let mnu of this.myMenus) {
                if (mnu.subMenus) {
                    for (let smnu of mnu.subMenus) {
                        if (code == smnu.code) smnu.gclass = 'active'
                        else smnu.gclass = '';
                    }

                }
            }

            this.$router.push({path: '/main/mypage/' + code});
            this.broadcastShow = false;
            this.myMenuShow = false;

        },


    }
}
</script>

<style lang="scss" scoped="true">
.layout-page-container {
    .left-container {
        width: 100%;
        background: #fff;
        min-height: calc(100vh);
        padding: 30px 15px;

        .myinfo-box {
            color: #fff;
            text-align: left;
            margin-bottom: 30px;
            display: flex;

            .myImg-box {
                width: 60px;
                height: 60px;
                margin-right: 20px;
                border-radius: 50%;
                overflow: hidden;
                background: #5E65E3;
                border: solid 2px #fff;
                text-align: center;

                img {
                    width: 100%;
                    min-height: 60px;
                }

                i {
                    font-size: 30pt;
                    margin-top: 8px;
                }
            }

            .myname {
                color: #000;
                font-size: 17pt;
                font-weight: bold;
                margin: 0;

            }

            .myUrl {
                color: #fafafa;
                cursor: pointer;
                font-size: 10pt;
            }
        }

        .menu-box {
            padding: 0;
            margin:0;
            color: #000;
            .menu-header {
                padding: 10px 0;
                font-size: 11pt;
                color: #5E65E3;
                position: relative;
            }

            .menu-ul {
                padding: 0;
                margin:0 0 30px 0;
                li {
                    cursor: pointer;
                    font-size: 11pt;
                    color: #000;
                    padding:11px 0;

                }
            }
        }
    }


}


</style>
