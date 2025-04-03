<template>
    <div class="mypage-container">

        <div v-if="mobileView" class="top-menu-bar">
            <div class="top-menu-bar-content">
                <div class="back-button" @click="$router.go(-1)">
                    <i class="fas fa-chevron-left"></i>
                </div>
                <span class="m-title">{{subject}}  - 관리하기</span>
            </div>
        </div>
        <div :class="'contents '+mobileClass">
            <div class="from-box">

                <div v-if="!mobileView" class="stitle">
                    <span class="line">{{subject}}  - 관리하기</span>
                    <span class="rdate">{{rdate}}</span>

                </div>
                <iframe  id="viewFrame" class="data-list-container" frameborder="0">This is an embedded <a target='_blank' href='http://office.com'>Microsoft Office</a> document, powered by <a target='_blank' href='http://office.com/webapps'>Office Online</a>.</iframe>

                <div class="button-row">
                    <v-btn
                        type="button"
                        @click="deleteData()">삭제
                    </v-btn>
                    <v-btn
                        type="button"
                        class="submit-button"
                        @click="goList()">목록으로
                    </v-btn>
                </div>
            </div>

        </div>

    </div>
</template>



<script>
	import {
		API_URL_BROADCAST_LIVE_DATA_INFO,
		API_URL_BROADCAST_LIVE_DATA_DELETE
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';

	export default {
		name: 'liveFileView',
		data() {
			return {
				mobileView: false,
				mobileClass: '',
				subject:'',
				rdate: '',
				no: '',
				filname:'',
			}
		},
		created() {
			if(this.$isMobile()) {
				this.mobileView = true;
				this.mobileClass = 'mobile'
			}
			this.no = this.$route.params.no;
			this.getData();
		},

		methods: {
			getData() {
				const frm = new FormData()
				frm.append('no',this.no)
				apiService.post(API_URL_BROADCAST_LIVE_DATA_INFO, frm, (res) => {
					this.subject = res.info.name;
					this.rdate = res.info.rdate;
					let hostName = location.hostname;
					let protocol = location.protocol;
					this.filename = protocol+'//'+hostName+res.info.url;

					let frame = document.getElementById('viewFrame');
					frame.setAttribute('src','https://view.officeapps.live.com/op/embed.aspx?src='+this.filname);
				});
			},
			deleteData() {
				let message = {
					type: 'confirm',
					message: '파일을 삭제하시겠습니까?',
					doAction: () => {
						const frm = new FormData()
						frm.append('no',this.no)
						apiService.post(API_URL_BROADCAST_LIVE_DATA_DELETE, frm, (res) => {
							this.$router.go(-1);
						});
					}
				};
				this.$eventBus.$emit('modalOpen', message);
			},
			goList() {
				this.$router.go(-1);
			}
		}

	}
</script>
<style lang="scss" scoped>
    ul {
        padding:0;
    }
    .stitle {
        position:relative;
        .rdate {
            position: absolute;
            right: 5px;
            font-size: 10pt;
            color: #999;
            top: 10px;
        }
    }
    .button-row {
        display: flex;
        width: 630px;
        margin: 70px auto;
        button {
            width: 300px;
            min-height:60px;
            border-radius: 30px;
            color:#fff;

            &:first-child {
                margin-right: 30px;
                background:#999;
            }
            &.submit-button {
                background: #686EFB;
            }
        }
    }
    .data-list-container {
        border: solid 1px #DCDCDC;
        background: #F4F4F4;
        width: 100%;
        height: 600px;
        overflow-y: auto;
        overflow-x: hidden;
        margin: 30px 0;
        padding: 35px 50px;
    }


</style>