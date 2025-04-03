<template>
    <div :class="'layout-page-container '+mobileClass">
        <div v-if="!selectedVid && !mobileView" class="header fixed">
            <div class="logo" @click="$router.push('/')"><img src="../../../assets/images/logo_live.png"></div>

        </div>
        <div :class="'main-container '+mainClass">
            <div class="content-box">
                <div class="video-box">
                    <div id="player" :style="playerStyle"></div>
                </div>
                <div class="info-box" v-if="no">
                    <div class="subject">
                       {{info.title}}
                    </div>
                    <div class="desc">
                        {{info.description}}
                    </div>
                </div>
                <div class="comment-box" v-if="no">
                        <comment :parent="'video'" :parentNo="no" :rwauth="rwauth"></comment>

                </div>

            </div>
            <div class="banner-box"  v-if="no">
                <ul class="banner-box-ul">
                    <li v-for="banner in bannerList"  @click="goBannerUrl(banner.glink)">
                        <img :src="host+banner.img">
                    </li>
                </ul>
            </div>

        </div>
    </div>
</template>


<script>
	import {mapActions, mapGetters} from "vuex";
	import {
		HOST,
		API_URL_YOUTUBE_GET_VIDEO_INFO
	} from '../../../api/urls';
	import apiService from '../../../api/apiService';
	import AUTH from '../../../api/auth'
	import Comment from '../../../components/comment/comment';
  	export default {
		name: 'videoView',
        props:["selectedVid"],
	    components: {
		    Comment,
	    },
    	data() {
			return {
                mobileView: false,
                mobileClass: '',
	            host:HOST,
				no:'',
                info:{},
				player:null,
				rwauth:true,
                mainClass:'',
                bannerList:[],
                playerStyle:{'width':'100%','height':'615px'},
			}
		},
		created() {

            if (this.$isMobile()) {
                this.setClass('sub')
                this.setTitle('동영상 보기');
                this.setBackUrl('');
                this.mobileView = true;
                this.mobileClass = 'mobile'
                this.playerStyle = {'width':'100%','height':'215px'};

            }
            if (!window['YT']) {
				var tag = document.createElement('script');
				tag.src = 'https://www.youtube.com/iframe_api';
				var firstScriptTag = document.getElementsByTagName('script')[0];
				firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
			}
			if(!this.selectedVid) {
            	this.no = this.$route.params.no;
				this.getInfo();
			} else {
            	this.mainClass = 'single-box';
            }

			this.setMemberInfo()

		},
	    methods: {
            ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
		    ...mapActions('etc', ["setGno"]),
		    getInfo() {
			    const frm = new FormData()
			    frm.append('no', this.no)
			    apiService.post(API_URL_YOUTUBE_GET_VIDEO_INFO, frm, (ret) => {
                    this.info = ret.info;
				    this.bannerList = ret.bannerList

			    });
		    },
            setVideo(vid) {
		    	this.player = new window['YT'].Player('player', {
		            videoId: vid,
		            playerVars: {
			            autoplay: 1,
			            modestbranding: 1,
			            controls: 1,
			            disablekb: 0,
			            rel: 0,
			            showinfo: 0,
			            fs: 0,
			            playsinline: 0
		            },

	            });

	        },
		    goBannerUrl(url) {
			    window.open(url);
		    },
            setMemberInfo() {
	            let memberInfo = AUTH.getSession(this.$isMobile());
	            if (memberInfo.AUTHTOKEN) {
		            //this.rwauth = true;

	            }
            }
	    },
        mounted() {
	        if(this.selectedVid) {
		        if (window['YT']) {
			        this.setVideo(this.selectedVid);
		        } else {
			        setTimeout(()=> {
				        this.setVideo(this.selectedVid);
			        },1000);

		        }
	        } else {
		        if (window['YT'] && this.info.videoId) {
			        this.setVideo(this.info.videoId);
		        } else {
			        setTimeout(()=> {
				        this.setVideo(this.info.videoId);
			        },1000);

		        }
            }

        }


	}
</script>

<style lang="scss" scoped="true">
    .layout-page-container {
        width: calc(100vw);
        height: 100%;
        position: relative;
        overflow-y: auto;
        overflow-x: hidden;
        background:#fff;
        .clear {
            clear: both;
        }
        .header {
            width: 100%;
            padding: 0;
            maing: 0;
            border-bottom: solid 1px #C2C2C2;
            height: 70px;
            z-index: 100000;
            background: #fff;
            position: fixed;
            top: 0;
            left: 0;
            .logo {
                cursor: pointer;
                margin:15px 0 0 20px;
                img {
                    width:153px;

                }
            }
        }
        .main-container {
            width:1320px;
            margin:80px auto 50px auto;
            display:flex;
            &.single-box {
                width:900px;
                margin:0;
                display:block;
                padding:0;
            }
            .content-box {
                width:900px;
                .info-box {
                    .subject {
                        font-weight:bold;
                        color:#fff;
                        font-size:18pt;
                        margin:20px 0;
                    }
                    .desc {
                        color:#fff;
                        font-size:10pt;

                    }
                }
            }

            .banner-box {
                width:400px;
                margin-left:20px;
                .banner-box-ul {
                    margin:0;
                    padding:0;
                    li {
                        width: 400px;
                        height: 180px;
                        overflow: hidden;
                        padding:0;
                        margin:0;
                        cursor:pointer;
                        img {
                            width: 100%;
                            height: auto;
                            min-height:180px;
                        }
                    }
                }
            }
        }
        &.mobile {
            background:#fff;
            min-height:calc(100vh);
            .main-container {
                background:#fff;
                width:100%;
                margin:0;
                display:block;
                &.single-box {
                    width:100%;
                    margin:0;
                    display:block;
                    padding:0;
                }
                .content-box {
                    width:100%;
                    .info-box {
                        padding:0 15px;
                        .subject {
                            font-size:12pt;
                            margin:10px 0;
                        }
                        .desc {
                            color:#fff;
                            font-size:10pt;

                        }

                    }
                    .comment-box {
                        padding:0 15px 40px 15px;
                    }
                }

                .banner-box {
                    width:100%;
                    margin-left:0;
                    .banner-box-ul {
                        margin:0;
                        padding:0;
                        li {
                            width:100%;
                            height: 180px;
                            overflow: hidden;
                            padding:0;
                            margin:0;
                            cursor:pointer;
                            img {
                                width: 100%;
                                height: auto;
                                min-height:180px;
                            }
                        }
                    }
                }
            }
        }

    }


</style>
