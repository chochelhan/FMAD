<template>
    <div class="customer-container">

        <div class="main-content">
            <h3>고객센터</h3>
            <div class="tip">원하시는 메뉴를 선택해주세요</div>
            <ul class="list-box">
                <li  @click="goCS('notice')" @mouseover="noticeOver=true" @mouseout="noticeOver=false">
                    <div class="icon">
                        <img v-if="!noticeOver" src="../../../assets/images/ico_cs1.png">
                        <img v-if="noticeOver" src="../../../assets/images/ico_cs1_a.png">
                    </div>
                    <div class="text">공지사항</div>
                </li>
                <li  @click="goCS('userfaq')"   @mouseover="userfaqOver=true" @mouseout="userfaqOver=false">
                    <div class="icon">
                        <img v-if="!userfaqOver" src="../../../assets/images/ico_cs2.png">
                        <img v-if="userfaqOver" src="../../../assets/images/ico_cs2_a.png">
                    </div>
                    <div class="text">FAQ</div>
                </li>
                <li  @click="goCS('userqna')"  @mouseover="userqnaOver=true" @mouseout="userqnaOver=false">
                    <div class="icon">
                        <img v-if="!userqnaOver" src="../../../assets/images/ico_cs3.png">
                        <img v-if="userqnaOver" src="../../../assets/images/ico_cs3_a.png">
                    </div>
                    <div class="text">의견보내기</div>
                </li>
            </ul>
        </div>

    </div>
</template>


<script>

	export default {
		name: 'customerMain',
		data() {
			return {
				userfaqOver:false,
				userqnaOver:false,
				noticeOver:false,
		    }
		},
		created() {

		},

		methods: {
			goCS(code) {
				if(code=='userqna') {
					this.$router.push('/board/regist/' + code)
                } else {
					this.$router.push('/board/list/' + code)
				}
            }
		},

	}
</script>
<style lang="scss" scoped>
    .customer-container {
        background:#fff;
        min-height:calc(100vh);
        .main-content {
            width: 100%;
            text-align: center;
            font-size: 11pt;
            padding-top: 100px;
            h3 {
                font-size: 19pt;
                color: #000;
                font-weight: bold;
                padding: 0;
                line-height: 150%;
            }
            .tip {
                padding: 20px 0 50px 0;
            }
            ul.list-box {
                display: flex;
                width: 800px;
                margin: auto;
                padding:0;
                li {
                    cursor: pointer;
                    width: 33.33%;
                    text-align: center;
                    position: relative;
                    .icon {
                        width: 200px;
                        height: 200px;
                        margin: auto;
                        border-radius: 50%;
                        border: solid 1px #ccc;
                        color: #999;
                        line-height: 270px;
                        img {
                            color: #999;
                            width: 100px;
                        }
                    }
                    .text {
                        width: 100%;
                        margin: 20px auto;
                    }
                }
            }
        }
    }


</style>