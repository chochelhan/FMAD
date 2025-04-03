
<template>
	<div class="page-container" id='chat-search-container'>
		<md-toolbar style='background:#fff;position:fixed;top:0;'>
			<form @submit="searchForm">
			<div class="md-toolbar-row">
				<div class="md-toolbar-section-start">
					<md-button class="md-icon-button" @click="$router.go(-1)">
						<i class="fas fa-chevron-left"></i>
					</md-button>
					 <span class="search-box">
						<input type="text" id="input-message" />
					 </span>
		
		   		</div>
				<div class="md-toolbar-section-end">
					<button type='submit' class="modify"><i class="fas fa-search"></i></button>
				</div>
				
			</div>
			</form>		
		</md-toolbar> 
		<div style="height:60px;"></div>
		<ul  class="data-content" id="is-data-result">
 			<li v-for="data,dataIndex in messageList" :class="dataIndex+'item'">
						<div class="main-3" v-if="data.divide_date">
						      {{data.divide_date}}  
						</div>
						<div class="main-3" v-if="data.userType=='new'">
							<div class="enter" v-html="data.msg"> 
							</div>
						</div>
						<div class="main-3" v-else-if="data.userType=='out'">
							<div class="out"  v-html="data.msg">
							</div>	
						</div>
						
						<div v-else-if="data.userType=='other'"  class="main-1" >
							 <div class="box-left">
							 	  <img :src="$VARS.url+data.photo"/>	
							 </div>
							 <div class="box-right">
							 	   <div class="box-top">
								   		<ul>
										    <li>{{data.name}}</li>
											<li>{{data.gtime}}</li>
										</ul>
								   </div>
								   <div class="iconBox" v-if="data.icon">
							  			<img :src="$VARS.url+iconList[data.icon]"/>
								   </div>
								   <div v-if="data.msg" class="box-bottom">
								   		<div class="box-img">
											 <img src="../../../assets/img/ico-img2.png">
										</div>
										<div class="box-content" v-html="data.msg">
										</div>

								   </div>
								   <div class="imgBox"  v-if="data.img">
										<img :src="$VARS.url+data.img"/>
								   </div>
								  
							 </div>
						</div>
						<div v-else-if="data.userType=='me'  || data.userType=='greet'"  class="main-2">
						      <p class="aa">{{data.gtime}}</p>
						      <div class="iconBox" v-if="data.icon">
							  	<img :src="$VARS.url+iconList[data.icon]"/>
							  </div>
							  <div class="box-big" v-if="data.msg">
							       <div class="box-aa" v-html="data.msg">
								   </div>
								   <div class="box-img-cc">
								       <img src="../../../assets/img/img-ico.png">
								   </div>
							  </div>
							  <div class="imgBox"  v-if="data.img">
									<img :src="$VARS.url+data.img"/>
							  </div>
						</div>
						<div v-else-if="data.userType=='service'" class="service">
							<div v-if="data.result=='ready'" class="progress-box">
								<md-progress-spinner class="md-primary" md-mode="indeterminate"></md-progress-spinner>
							</div>
							<div v-else>
								<div class="main-1">
									 <div class="box-left">
										  <img :src="$VARS.url+data.photo"/>	
									 </div>

									 <div class="box-right">
										   <div class="box-top">
										   		<ul>
												    <li>{{data.name}}</li>
													<li>{{data.gtime}}</li>
												</ul>
										   </div>
										   <div class="box-bottom">
										   		<div class="box-img">
													 <img src="../../../assets/img/chatbot_tail.png">
												</div>
												<div class="box-content" v-html="data.response">
												</div>
										   </div>
									 </div>	 		
								</div>
								<div class="service-box" v-if="data.serviceDataList.length>0 || data.stype=='who'">
									<div class="pushbutton-box"  v-if="data.stype=='who'">
										<md-button class="pushButton md-raised" @click="sendAllPush(data.no)">모두에게 보내기</md-button>
										<md-button class="pushButton md-raised" @click="sendUserPush(data.no,dataIndex)">선택해서 보내기</md-button>
									</div>
									<div class="searchResult-box"  v-if="data.serviceDataList.length>0">
										<div v-if="data.type=='youtube'" class="swiper-container">
											<swiper  :options="swiperOption">
												<swiper-slide v-for="item,index in data.serviceDataList">
													<div @click="fullVideo(item.id.videoId,dataIndex)" class="data-box">
														<div class="img">
															<img :src="item.snippet.thumbnails.medium.url">	
														</div>
														<div  class="title">
															{{$form.getStrCut(item.snippet.title,25)}}
														</div>
														<div  class="rdate">
															{{item.rdate}} | YOUTUBE
														</div>
													</div>
												</swiper-slide>
											</swiper>
										</div>
										<div v-else-if="data.type=='board'">
											<div class="board-box">
												<div class="list-box">
													<div class="list" v-for="item,index in data.boardList" @click="goArticle(data.type,item,dataIndex)">
														<div :class="'info-box '+((item.imgs[0])?'':'alone')">
															<div class="title">{{$form.getStrCut(item.subject,30)}}</div>
															<div class="rdate">
																{{item.rdate}} | {{item.userName}} 
															</div>
														</div>
														<div class="img-box" v-if="item.imgs[0]">
															<img :src="$VARS.url+item.imgs[0]">
														</div>
													</div>
												</div>
												<div class="more-button" v-if="data.serviceDataList.length>4 && !data.moreButtonView" @click="moreBoardData(dataIndex)">
													더보기
												</div>
											</div>
											
										</div>
										<div v-else-if="data.type=='greet'">
											<div class="greet-box" v-if="data.greetType=='init'">
												<ul class="greet-list">
													<li v-for="item,index in data.serviceDataList">{{item.name}}</li>
												</ul>
											</div>
										</div>
										<div v-else class="swiper-container">
											<swiper  :options="swiperOption">
												<swiper-slide v-for="item,index in data.serviceDataList">
													<div :class="'data-box '+data.type" @click="goArticle(data.type,item,dataIndex)">
														<div class="img">
															<img v-if="item.imgs[0]" :src="$VARS.url+item.imgs[0]">
														</div>
														<div  class="title">
															{{$form.getStrCut(item.subject,25)}}
														</div>
														<ul v-if="data.type=='meet'" class="meet-info">
															<li><img src="../../../assets/img/ico_m1.png">{{item.gtime}}</li>
															<li><img src="../../../assets/img/ico_m2.png">{{item.garea}}</li>
															<li><img src="../../../assets/img/ico_m3.png">{{item.price}}</li>
														</ul>
														<div v-else  class="rdate">
															{{item.rdate}} | {{item.userName}}
														</div>
													</div>
												</swiper-slide>
											</swiper>
										</div>
									</div>
								</div>
							</div>
						</div>
				</li>
			
		</ul>
		<ul  class="data-content" id="no-data-result">
			<li >
				<div style="text-align:center;height:300px;line-height:300px;">검색결과가 존재하지 않습니다</div>
			</li>
		</ul>
		<div class="footer" v-if="searchResult">
			<ul class="inform-box">
				<li @click="searchResultList('up')">
					<i class="fas fa-chevron-up"></i>
				</li>
				<li class="textbox">{{showIndex}}/{{totalIndex}} </li>
				<li  @click="searchResultList('dn')">
					<i class="fas fa-chevron-down"></i>
				</li>
			</ul>
		</div>
	</div>	
	
</template>

<script>

import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  name: 'GuildChatSearch',
   components: {
	swiper,
    swiperSlide,
  },
  data () {
	return {
		gno:'',
		messageList:[],
		message:'',
		iconList:{},
		totalIndex:0,
		currentIndex:'',
		showIndex:0,
		searchResult:false,
		indexKeyList:[],
		initFlag:true,
		currentTop:0,
		createFlag:true,
		swiperOption: {
			slidesPerView:'auto',
			freeMode:true,
			
		}
     }
  },
  created: function() {
	this.init();
  },
  methods: {
	 init() {
		 this.initFlag=true;
		 this.gno = this.$route.params.gno;
		 this.messageList = [];
		 this.message ='';
		 this.iconList = {};
		 this.totalIndex = 0;
		 this.currentIndex ='';
		 this.showIndex = 0;
		 this.searchResult = false;
		 this.indexKeyList = [];
		 this.currentTop = 0;
		 this.getData();
		
		 
	 },
	 getData() {
		 var chatDatas = this.$store.getters.getChatDatas;
		 
		 if(chatDatas.messageList.length<1 && chatDatas.allList.length<1) {
			 var messageList = localStorage.getObject('messageList');
			 this.iconList = localStorage.getObject('iconList');
		 } else {
			 this.iconList = chatDatas.iconList;
			 var msgList = chatDatas.messageList;
			 var allList = chatDatas.allList;
			 var messageList =  allList.concat(msgList);
			 localStorage.setObject('messageList',messageList);
			 localStorage.setObject('iconList',this.iconList);
		 }
		 if(messageList.length>0) {
			for(var key in messageList) {
				this.messageList.push(messageList[key]);
			}
		}
	  },
      searchForm(e) {
		this.message = $('#input-message').val();
		if(!this.message) {
			var params = {content:'검색어를 입력하세요'}
			this.$eventBus.$emit('dialogOpen',params);
			e.preventDefault();
			return false;
		}
		$('#is-data-result').show();
		$('#no-data-result').hide();

		 var messageList = localStorage.getObject('messageList');
		 if(messageList.length>0) {
			 var msgFlag = false;
			var lastIndex = '';
			var indexTotal = 0;
			this.indexKeyList = [];
			for(var key in messageList) {
				var item = messageList[key];
				msgFlag = false;
				var result = {};
				switch(item.userType) {
					case 'other':
					case 'me':
					case 'new':
					case 'out':
						if(item.msg) { 
							msgFlag = true;		
							result = this.searchMessage(item.msg,key);
							item.msg = result.msg;
						}
					break;
					case 'service':
						if(item.response) {
							msgFlag = true;		
							result = this.searchMessage(item.response,key);
							item.response = result.msg;	
						}
					break;
				} 
				if(msgFlag && result.index!='none') {
					lastIndex = result.index;
					indexTotal++;
					this.indexKeyList.push(result.index)
				}
				this.$set(this.messageList,key,item);
			}
			if(lastIndex) {
				this.searchResult = true;
				this.currentIndex = lastIndex;
				this.totalIndex = indexTotal;
				this.showIndex = indexTotal;
				this.resultAppear()
			} else {
				this.searchResult = false;
				$('#is-data-result').hide();
				$('#no-data-result').show();
					
			}
		 }
		e.preventDefault();
		return false;
		
	  },
	  searchResultList(cmd) {
		if(this.totalIndex<2)return;
		switch(cmd) {
			case 'up':
				if(this.showIndex <=1) {
					return;	
				}
				this.showIndex--;
				
			break;
			case 'dn':
				if(this.showIndex >= this.totalIndex) {
					return;	
				}
				this.showIndex++;
			break;
		}
		this.currentIndex = this.indexKeyList[this.showIndex-1];
		this.resultAppear()
	  },
	  resultAppear() {
			var $el = $('#chat-search-container .'+this.currentIndex+'item');
			//var top1 = parseInt($el.offset().top);
			//console.log(top1);

			var top = $('#chat-search-container').scrollTop() + parseInt($el.offset().top) - 200;
			//console.log(top);
			$('#chat-search-container').animate({
				scrollTop:top,
			},500,function() {
				$el.animate({
					opacity:0.3		
				},300, function() {
					$(this).animate({
						opacity:1		
					},300);
				});
			});
	  },
	  searchMessage(message,index) {
		    var resultMsg = {};
		    if(message.match(this.message)!==null) {
				//this.message
				var regexp = new RegExp(this.message,"gi");

				resultMsg.msg = message.replace(regexp,"<span class='searchResult-box'>"+this.message+"</span>"); 
				resultMsg.index = index;
			} else {
				resultMsg.msg = message;
				resultMsg.index = 'none';
			}	
			return resultMsg;
	  },
	  goArticle(gtype,item,dataIndex) {
		  	$('#input-message').blur();
			this.goArticlePage(gtype,item,dataIndex)
		
	  },
	  goArticlePage(gtype,item,dataIndex) {
			  var $el = $('#chat-search-container .'+dataIndex+'item');
			  var top = $('#chat-search-container').scrollTop() + parseInt($el.offset().top);
			  this.currentTop = top;	
			  
			  var type = '';
			  switch(gtype) {
				case 'board':
					if(item.parent=='board') {
						type = 'board';
					} else type = 'home';
				break;
				default:
					type = gtype;
				break;

			  }
			  var url = '/guild/chatArticleDetail/'+type+'/'+this.gno+'/'+item.no
			  this.$router.push({path:url});
	  },
	  nl2br(str){  
			return str.replace(/\n/g, "<br />");  
	  }, 
	  fullVideo(vid,dataIndex) {
		$('#input-message').blur();
		
		var $el = $('#chat-search-container .'+dataIndex+'item');
		var top = $('#chat-search-container').scrollTop() + parseInt($el.offset().top);
		this.currentTop = top;	
		
		this.$router.push({path:'/guild/chatVideo/'+this.gno+'/'+vid});
	  },
	   sendUserPush(no,dataIndex) {
			var $el = $('#chat-search-container .'+dataIndex+'item');
			var top = $('#chat-search-container').scrollTop() + parseInt($el.offset().top);
			this.currentTop = top;	
		
			var url = '/guild/chatPushMembers/'+this.gno+'/'+no
			this.$router.push({path:url});
	  },
	  sendAllPush(no) {

			var obj = this;
			var params = {
				content:"푸쉬메세지를 보내시겠습니까?",
				cancleView:true,
				doAction:function() {
					obj.pushProc(no);
				}
			};
			this.$eventBus.$emit('dialogOpen',params);
			
	  },
	  pushProc(no) {
			var obj = this;
			var params = {gno:this.gno,no:no,type:'all'}
			this.$form.sendPost(params,'chatProc/sendPush',function(response){
				//console.log(response);
				if(response.result=='succ') {
					var gparams = {
						content:"푸쉬메세지를 발송하였습니다",
					};
				} else {
					var gparams = {
						content:"메세지발송에 실패하였습니다",
					};
				}
				obj.$eventBus.$emit('dialogOpen',gparams);
			
			});
	  },
	   moreBoardData(index) {
		var serviceItem = this.messageList[index];
		serviceItem.boardList = serviceItem.serviceDataList;
		serviceItem.moreButtonView = true;
		this.$set(this.messageList,index,serviceItem);
		//this.settingViewAfter = true;

	  }
	  
  },
  beforeDestroy() {
  
  },
  mounted() {
		this.initFlag=false;
		var obj = this;
		 $('#input-message').val('').focus();
		 
		$('#chat-search-container').scrollTop($('.data-content').height()-120);
		 
	
  },
  updated() {
	if(this.initFlag) {
		$('#is-data-result').show();
		$('#no-data-result').hide();
		this.initFlag=false;
		$('#input-message').val('').focus();
		$('#chat-search-container').scrollTop($('.data-content').height()-120);
		
		
	}
	
  },
  deactivated() {
		
  },
  activated() {
		if(!localStorage.getItem('historyBack')) {
			if(this.createFlag) {
				this.createFlag = false;
			} else {
				this.init()
			}
		} else {
			if(this.currentTop>0) {
				$('#chat-search-container').scrollTop(this.currentTop);
			}
		}

    }

}
</script>
<style>
span.searchResult-box {
	background:#007ACC;
	color:#fff;
}
</style>
<style lang="scss" scoped>
.page-container {
	width:100%;
	height:calc(100vh);
	overflow-y:auto;
	overflow-x:hidden;
	background:#fff;
	position:fixed;
	top:0;
	.md-toolbar {
		z-index:10;
		.search-box {
			width:calc(74vw);
			input {
				width:100%;
				height:25px;
				border:none;
				outline:none;
			}
		}
	}
	#no-data-result {
		display:none;
	}
	.data-content    {
		min-height:calc(100vh-120px);	 
		width:100%;
		height:auto;
		margin:0 0 85px 0;
		padding:20px 0 0 0;
		li {
			position:relative;
			 .main-1    {
			        width:100%;
					height:auto;
					display:flex;
					padding:13px 15px 13px 5px;
					.box-left   {
					      width:35px;
						  height:35px;
						  border-radius:50%;
						  background:#826BA2;
						  text-align:center;
						  position:absolute;
						  bottom:15px;
						  overflow:hidden;
						  img    {
						      width:100%;
							  min-height:35px;
						  
						  }
					}
					.box-right  {
					      width:100%;
					      margin-left:47px;
					      .box-top  {
						        width:auto;
						        position:relative;
						        ul    {
								   display:flex;
							       li   {
								       padding-bottom:3px;
								       color:#999999;
					                   font-family: 'Nanum Gothic', sans-serif;
					                   font-size:13px;
								       &:last-child   {
									     position:absolute;
										 right:0;
									   }
								   }
							    }
						  }
						  .box-bottom  {
						        display:flex;
								position:relative;
						  		.box-img   {
								      width:auto;
									  height:auto;
									  position:absolute;
									  bottom:0px;
									  left:-15px; 
									  img   {
									      width:20px;
										  height:30px;
									  }

								}
								.box-content  {
								      width:100%;
									  height:auto;
									  background:#F2F2F2;
									  padding:15px 20px;
									  border-radius:5px;
									  position:relative;
									   word-break:break-all;
									  word-wrap:break-word; 
									  line-height:140%;	
									  color:#999999;
					                  font-family: 'Nanum Gothic', sans-serif;
					                  font-size:11px;
								}
						  }
						  .imgBox  {
							 width:auto;
							 overflow-x:hidden;
							 img {
								max-width:100%;
							 }
						  }
						  .iconBox  {
							 width:auto;
							 overflow-x:hidden;
							 padding:7px 0 0 0;
							 margin-bottom:10px;
							 img {
								width:90px;
							 }
						  }
					}
			 }
			 .service {
				.progress-box {
					text-align:center;
				}
				.main-1    {
			        position:relative;
					padding-bottom:0;
					.box-left   {
					     bottom:1px;
					}
					.box-bottom  {
						.box-content  {
						   background:#5A3FD2;
						   color:#fff;
					    }
					}
					
				}
				.service-box  {
					width:100%;
					margin:10px 0 13px 0;
					.pushbutton-box {
						margin-left:50px;
						.pushButton {
							border:solid 1px #ccc;
							margin:0;
							width:calc((100vw - 77px)/2);
							height:43px;
							color:#402E97;
							z-index:1;
						}
						.pushButton:first-child {
							margin-right:10px;
							
						}

					}
					.searchResult-box {
						margin-left:45px;
						padding:15px 0;
						.greet-box {
								margin-top:-14px;
								.greet-list {
									display:flex;
									flex-wrap:wrap;
									li {
										width:30%;
										margin-left:7px;
										border-radius:10px;
										height:35px;
										line-height:35px;
										text-align:center;
										background:#ffff00;
										color:#000;
										font-weight:bold;
										font-size:11px;
										margin-bottom:7px;
										overflow:hidden;
									}
								}
						}
						.board-box {
							margin:0 15px 0 5px;
							border-radius:12px;
							border:solid 1px #ccc;
							width:auto;
							height:auto;
							box-shadow:1px 1px 2px 1px rgba(0,0,0,0.1);
							.list-box {
								padding:20px 20px 0 20px;		
								.list {
									display:flex;
									border-bottom:solid 1px #c3c3c3;
									height:80px;
									padding:10px 0;
									.info-box {
										width:calc(100vw - 170px);
										.title {
											line-height:120%;
											font-size:10pt;
											font-weight:bold;
											color:#000;
											padding:3px 0 0 0;
											height:37px;
										}
										.rdate {
											font-size:7pt;
											color:#999;
											padding:0;
										}
										
									}
									.info-box.alone {
										width:100%;
							
									}
									.img-box {
										width:60px;
										height:60px;
										overflow:hidden;
										background:#eee;
										text-align:Center;
										img {
											width:100%;
											min-height:60px;
										}
										
									}
								}
								.list:last-child {
									border-bottom:none;
								}
							}
							.more-button {
								border-top:solid 1px #c3c3c3;
								text-align:center;
								height:45px;
								line-height:45px;
								color:#8572DD;
							}
						}
						.swiper-container {
							margin:0;
							padding:0;
							position:relative;
							.swiper-slide {
								width:180px;
								height:auto;
								margin:0 5px;
								padding-bottom:5px;
								.data-box {
									border-radius:12px;
									border:solid 1px #ccc;
									overflow:hidden;
									width:100%;
									height:173px;
									box-shadow:1px 1px 2px 1px rgba(0,0,0,0.1);
									.img {
										height:100px;
										width:100%;
										overflow:hidden;
										img {
											width:100%;
											min-height:100px;
										}
									}
									.title {
										line-height:120%;
										font-size:10pt;
										font-weight:bold;
										color:#000;
										padding:8px;
										height:30px;
									}
									.rdate {
										font-size:7pt;
										color:#999;
										padding:0 8px;
									}
								}
								.data-box.meet {
									height:207px;
									.meet-info {
										padding:0 8px;
										margin:0;
										li {
											padding:0;
											margin:0;
											font-size:8pt;
											color:#999;
											line-height:160%;
											img {
												width:10px;
												margin-right:7px;
											}
										}
									}

									
								}
							}
							
						}
					}
				}
			 }
			 .main-2   {
			 	    width:100%;
					height:auto;
					padding:13px 5px 13px 50px;
					.aa    {
					      color:#999999;
					      font-family: 'Nanum Gothic', sans-serif;
					      font-size:13px;
						  padding:0 0 0 5px;
						  margin:0;
					}
					.box-big   {
						  display:flex;
						  position:relative;
						  .box-aa   {
							    width:100%;
								margin:0 11px 0 2px;
								padding:12px 25px;
								background:#AB7BC0;
								color:#fff;
					            font-family: 'Nanum Gothic', sans-serif;
					            font-size:12px;
								border-radius:4px;
								word-break:break-all;
								word-wrap:break-word; 
								line-height:140%;
						  }
						  .box-img-cc   {
						       width:auto;
							   position:absolute;
							   right:2px;
							   bottom:0;
							   img   {
							       width:12px;
								   height:20px;

							   }
						  }
					}
					 .imgBox  {
						 margin:0 11px 0 3px;
						 width:auto;
						 overflow-x:hidden;
						 img {
							max-width:100%;
						 }
					}
					.iconBox  {
						width:auto;
						overflow-x:hidden;
						padding:7px 10px 0 0;
						text-align:right;
						margin-bottom:10px;
						img {
							width:90px;
						}
					}
			 }
			.main-3   {
			       width:100%;
				   height:auto;
				   text-align:center;
				   padding-top:22px;
				   color:#000;
				   font-family: 'Nanum Gothic', sans-serif;
				   font-size:12px;
					.enter   {
							width:auto;
							display:inline-block;
							padding:0 10px;
							border-radius:13px;
							height:26px;
							margin:auto;
							line-height:26px;
							text-align:center;
							background:#FD237A;
							color:#fff;
							  
					}
					.out   {
						    width:auto;
							display:inline-block;
							padding:0 10px;
							border-radius:13px;
							height:26px;
							margin:auto;
							line-height:26px;
							text-align:center;
							background:#c1c1c1;
							color:#fff;
							  
					}
			}
		}
   }
   .footer    {
          width:100%;
		  height:auto;
		  position:fixed;
		  z-index:1;
		  bottom:0;
		  -webkit-box-shadow: 0px 0px 8px -1px rgba(0,0,0,0.6);
          -moz-box-shadow: 0px 0px 8px -1px rgba(0,0,0,0.6);
          box-shadow: 0px 0px 8px -1px rgba(0,0,0,0.6);
		  ul.inform-box   {
		      background:#fff;
		  	  padding:15px 15px;
		 	  display:flex;
			  li  {
				 font-size:14pt;
				 width:20%;
			     color:#000;
				 &:first-child   {
				      text-align:left;
					  padding-left:12px;
				 }
				 &:last-child  {
				      text-align:right;
					  padding:2px 12px 0 0;
				 }

				 
			  }
			  li.textbox {
				 width:60%;
				 padding-top:2px;
				 text-align:center;
				 color:#000;
				 font-size:12pt;
				
			  }
		  }
		 
	}
		
}
.modify {
	margin:3px 0 0 0;
	border:none;
	background:#fff;
	width:20px;
	i {
		font-size:12pt;
	}
}
</style>