<template>
    <div class="layout-page-container">
        <div class="mobile-header-main" v-if="topClass=='main'">
            <div class="logo">
                <img src="../../../assets/images/logo.png" @click="goHome()"/>
            </div>
            <div class="user-box">
                <div class="search-box" @click="search()">
                    <i class="fas fa-search"></i>
                </div>
                <div class="login-box">
                    <div class="user-icon" v-if="!isLogin" @click="login()">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="user-icon" v-else @click="goMypage()">
                        <img v-if="photo" :src="host+photo">
                        <i v-if="!photo" class="fas fa-user"></i>
                    </div>
                </div>
            </div>

        </div>
        <div class="mobile-header close" v-else-if="topClass=='close'">
            <div class="close-box" @click="back()">
                <img src="../../../assets/images/close.png">
            </div>

        </div>
        <div :class="'mobile-header '+topClass" v-else-if="topClass!='none'">
            <div class="back-button" @click="back()">
                <i class="fas fa-arrow-left"></i>
            </div>
            <div class="header-title">
                {{ title }}
            </div>
        </div>
        <div class="virtual-box"></div>
        <div class="wrap-contents">
            <router-view/>
        </div>
        <div class="bottom-menu" v-if="topClass=='main' || topClass=='subBj'">
            <ul>
                <li v-for="(mnu,Index) in menus" :key="mnu.code" @click="goPageUrl(Index)" :class="mnu.active">
                    <div class="icon-box">
                        <img v-if="mnu.active=='active'" :src="mnu.overIcon">
                        <img v-else :src="mnu.icon">
                    </div>
                    <div class="text-box">{{ mnu.name }}</div>
                </li>
            </ul>
        </div>
    </div>
</template>


<script>
import {HOST} from '../../../api/urls';
import {mapActions, mapGetters} from "vuex";
import AUTH from '../../../api/auth';

export default {
    name: 'mobileLayout',
    computed: {
        ...mapGetters('mobile', ["getClass", "getTitle", "getBackUrl","getBjBack"]),
    },
    watch: {
        getClass(val) {
            this.topClass = val;
        },
        getTitle(val) {
            this.title = val;
        },
        getBackUrl(val) {
            this.backUrl = val;
        },
        getBjBack(val) {
            this.bjBackUrl = val;
        },

    },
    data() {
        return {
            host: HOST,
            isLogin: false,
            topClass: '',
            title: '',
            backUrl: '',
            bjBackUrl:'',
            menus: [
                {code: 'home', icon: require('../../../assets/menuimg/ico_menu1.png'), overIcon: require('../../../assets/menuimg/ico_menu1.png'), name: '홈', active: ''},
                {code: 'video',  icon: require('../../../assets/menuimg/ico_menu3.png'), overIcon: require('../../../assets/menuimg/ico_menu3.png'), name: 'Youtube', active: ''},
                {code: 'bjList',  icon: require('../../../assets/menuimg/ico_menu5.png'), overIcon: require('../../../assets/menuimg/ico_menu5.png'), name: '인플루언서', active: ''},
                {code: 'instar',  icon: require('../../../assets/menuimg/ico_menu5.png'), overIcon: require('../../../assets/menuimg/ico_menu5.png'), name: '인스타 셀럽', active: ''},
            ],
        }

    },
    created() {
        let toName = this.$route.name
        console.log(toName)
        switch (toName) {
            case 'mainHome':
                this.menus[0].active = 'active';
                break;
            case 'mainLive':
                this.menus[1].active = 'active';
                break;
            case 'mainVideo':
                this.menus[2].active = 'active';
                break;
            case 'mainBjList':
                this.menus[4].active = 'active';
                break;
            default:
                this.menus[3].active = 'active';
                break;

        }
        AUTH.setDevice(this.$isMobile());
        this.setMemberInfo();

    },
    methods: {
        ...mapActions('member', ["setLoginBoxOpen"]),
        ...mapActions('mobile', ["setBjBack"]),
        setMemberInfo() {
            let memberInfo = AUTH.getSession(this.$isMobile());
            if (memberInfo.AUTHTOKEN) {
                if (memberInfo.mtype != 'temp') {
                    this.isLogin = true;
                    this.mtype = memberInfo.mtype;
                    this.photo = memberInfo.photo;
                    this.myUid = memberInfo.uid;
                }
            }
        },
        goPageUrl(index) {
            let k = 0;
            for (let mnu of this.menus) {
                if (index == k) {
                    mnu.active = 'active';
                } else mnu.active = '';
                k++;
            }

            let url = this.menus[index].code;
            if (url == 'world') {
                this.$router.push('/world/main');
            } else {
                this.$router.push('/main/' + url);
            }

        },
        search() {
            this.$router.push('/main/search/mobile')


        },
        goHome() {
            this.$router.push('/main/home');
        },
        back() {
            if(this.bjBackUrl) {
                this.$router.push(this.bjBackUrl);
                this.setBjBack('');
                return;
            }
            if (this.backUrl) {
                this.$router.push(this.backUrl);
            } else {
                this.$router.go(-1);
            }
        },
        goMypage() {
            this.$router.push('/main/mypage/myMenu')
        },
        login() {
            this.setLoginBoxOpen(true);
        }
    },
    mounted() {

    },
}
</script>


<style lang="scss" scoped="true">
.layout-page-container {
    background: #fff;
    width: calc(100vw);

    .bottom-menu {
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 100;
        width: 100%;
        color: #fff;
        height: 48px;
        background: #14192C;
        padding:0;
        ul {
            display: flex;
            justify-content: space-between;
            padding: 0;

            li {
                padding-top:7px;
                width: 25%;
                text-align: center;
                height: 48px;
                .icon-box {
                    height:20px;
                    img {
                        width: 15px;

                    }

                }
                .text-box {
                    font-size: 7pt;
                }
                &.active {
                    background:#225CA2;
                }


            }
        }

    }

    .mobile-header-main {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 100;
        width: 100%;
        display: flex;
        justify-content: space-between;
        color: #fff;
        height: 44px;
        background: #14192C;
        box-shadow: 0px 3px 6px #00000029;

        .logo {
            margin: 10px 0 0 10px;

            img {
                width: 80px;
            }
        }

        .user-box {
            display: flex;
            justify-content: flex-end;
            margin: 10px 15px 0 0;

            .search-box {
                margin-right: 17px;

                i {
                    font-size: 11pt;
                }
            }

            .login-box {
                padding: 0;

                .user-icon {
                    width: 21px;
                    height: 21px;
                    background:#225CA2;
                    border-radius: 50%;
                    line-height: 23px;
                    text-align: center;
                    font-size: 9pt;
                    overflow: hidden;

                    img {
                        width: 100%;
                        min-height: 21px;
                    }
                }

            }
        }
    }


    .mobile-header {
        width: 100%;
        position: fixed;
        background: #141A2C;
        z-index: 90;
        top: 0;
        left: 0;
        height: 44px;
        display:flex;
        box-shadow: 0px 0px 9px #0000007A;
        .back-button {
            color:#fff;
            margin:10px 0 0 10px;
        }
        .header-title {
            text-align:left;
            padding:10px 0 0 15px;
            color:#fff;
            font-weight: 600;
        }
        .close-box {
            position:absolute;
            right:10px;
            top:10px;
            img {
                width:19px;
            }
        }
        &.close {
            background: #fff;
            box-shadow:none;
        }

        &.none {
            display: none;
        }
    }

    .virtual-box {
        height:44px;
    }

    .wrap-contents {
        width: 100%;

    }

}


</style>
