<template>
    <div class="layout-page-container">
        <div class="header">
            <div class="logo">
                <img @click="$router.push('/')" src="../../../assets/images/logo.png"/>
            </div>
            <div class="search-box">
                <div class="input-box">
                    <input type="text" v-model="keyword" placeholder="Search">
                    <div class="search-button">
                        <i class="fas fa-chevron-right"></i>
                    </div>
                </div>
            </div>
            <div class="login-box">
                <div class="user-icon" v-if="!isLogin" @click="login()">
                    <i class="fas fa-user"></i>
                </div>
                <div class="user-icon" v-else @click="logout()">
                    <i class="fas fa-user"></i>
                </div>
            </div>
            <!--ul v-else class="login-box">
                <li @click="logout()">로그아웃</li>
                <li @click="mypage()">마이페이지</li>
            </ul-->
        </div>

        <div class="main-container">
            <router-view/>
        </div>
    </div>
</template>


<script>
	import {mapActions, mapGetters} from "vuex";
	import AUTH from '../../../api/auth';

	export default {
		name: 'topLayout',
		computed: {
			...mapGetters('member', ["getUid", "getMtype"])
		},
		watch: {
			getUid(val) {
				if (val) {
					this.setMemberInfo();
				}
			},
			getMtype(val) {
				if (val) {
					this.setMemberInfo();
				}
			}

		},
		data() {
			return {
				isLogin: false,
				mtype: '',
				keyword: '',
			}

		},
		created() {
			AUTH.setDevice(this.$isMobile());
			this.setMemberInfo();
			this.logout()
		},
		methods: {
			...mapActions('member', ["setMember", "setLoginBoxOpen"]),
			getData() {

			},
			setMemberInfo() {
				let memberInfo = AUTH.getSession(this.$isMobile());
				if (memberInfo.AUTHTOKEN) {
					this.isLogin = true;
					this.mtype = memberInfo.mtype;
				}
			},
			login() {
				this.setLoginBoxOpen(true);
				//this.$router.push('/login');
			},
			join() {
				this.$router.push('/join');
			},
			logout() {
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
			},
			mypage() {
				if (this.mtype == 'shop') {
					this.$router.push('/main/mypage/broadcastList');
				} else {
					this.$router.push('/main/mypage/updateMyInfo');
				}
			},



		}
	}
</script>

<style lang="scss" scoped="true">
    .layout-page-container {
        .header {
            display: flex;
            height: 80px;
            justify-content: space-between;
            background: #0F1421;
            .logo {
                width: 355px;
                padding: 30px;
                color: #fff;
                font-size: 14pt;
                img {
                    width:153px;
                    cursor:pointer;
                }
            }

            .search-box {
                padding: 15px 10px 0 30px;
                width: 60%;
                .input-box {
                    width: 400px;
                    background: #1F2940;
                    height: 50px;
                    border-radius: 25px;
                    display: flex;
                    input {
                        width: 355px;
                        height: 45px;
                        border: none;
                        background: none;
                        padding: 7px 5px 5px 30px;
                        color: #fff;
                        outline: none;
                    }
                    .search-button {
                        width: 40px;
                        height: 40px;
                        color: #fff;
                        border-radius: 50%;
                        background: #686DFC;
                        text-align: center;
                        line-height: 41px;
                        margin-top: 5px;
                        cursor: pointer;
                    }
                }
            }
            .login-box {
                padding: 18px 10px 0 0;
                width: 40%;
                display: flex;
                justify-content: flex-end;
                .user-icon {
                    cursor: pointer;
                    width: 46px;
                    height: 46px;
                    background: #5E65E3;
                    border-radius: 50%;
                    font-size: 16pt;
                    margin-right: 20px;
                    text-align: center;
                    line-height: 46px;
                    i {
                        color: #fff;
                    }

                }
            }
        }
        .main-container {
            width: calc(100vw);
            min-height: calc(100vh);
            background: #14192C;

        }

    }


</style>