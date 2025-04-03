<template>
	<div class="page-container" >
		<md-toolbar style='position:fixed;background:#fff;top:0;'>
			<div class="md-toolbar-row">
				<div class="md-toolbar-section-start">
					<md-button class="md-icon-button" @click="$router.go(-1)">
						<i class="fas fa-chevron-left"></i>
					</md-button>
					 <span class="title">공지</span>
		
		   		</div>
			</div>	
		</md-toolbar> 

		<md-content>
			<div class="data-layout">
				<ul class="data-box">
					<li v-for="data,index in dataList">
						<div>
								
							<div class="name-box">
								<i style='color:#cc0000;margin-right:5px;'  v-if="data.notice=='yes'" class="fas fa-bullhorn"></i>
								{{data.name}} &nbsp; {{data.rdate}}		
							</div>
							<div class="subject" v-html="data.contents">
							</div>
							
						</div>
						<div class="modify">
							<i class="fas fa-ellipsis-v" @click="editShow(data.no,data.notice)"></i>
						</div>
					</li>
				</ul>	
				
			</div>
			<md-button class="md-icon-button bottom-write-icon-button" @click="writeNotice()">
				<i class="fas fa-pen"></i>
			</md-button>
			
		</md-content>
		<div class="screenLayout" v-if="screenView">
			<div class="content-wrapper">
				<div class="content-box">
					<span @click="screenView=false"><i class="fa fa-times"></i></span>
					<ul>
						<li v-for="item in popList" @click="setAction(item.code)">{{item.name}}</li>
					</ul>
				</div>
			</div>
		</div>
    </div>
</template>
<script>

export default {
	name: 'GuildBoard',
	
	data() {
		return {
			popList:[],
			dataList:[],
			gno:'',
			updateNo:'',
			socket:'',
			screenView:false,
			
		}
	},
	created() {
		if(!localStorage.getItem('memberkey')) {
			 this.$router.push({path:'/member/login'});
			 return;
	    }
		this.gno = this.$route.params.gno;
		this.getData()
		this.chatInit();
	},
    methods: {
		getData() {
			var obj = this;
			this.$form.sendPost({gno:this.gno},'chatProc/getNoticeList',function(resp) {
				if(resp.result == 'succ') {
					obj.dataList = resp.list;
					var noticeData = {};
					for(var k in obj.dataList) {
						if(obj.dataList[k].notice == 'yes') {
							noticeData = obj.dataList[k];
						}
					}
					obj.$store.commit("updateChatNoticeData",noticeData);	
					
				}
			},'multi');	
		},
		writeNotice() {
			this.$router.push({path:'/guild/chatNoticeWrite/'+this.gno+'/new'});
		},
		setAction(code) {
			switch(code) {
				case 'notice':
					var obj = this;
					this.$form.sendPost({gno:this.gno,no:this.updateNo},'chatProc/updateNoticeNoti',function(resp) {
						if(resp.result == 'succ') {
							obj.socket.emit('message', { 
								mode:'noticeUpdate',
								noticeMsg:resp.info.contents,
								notice:resp.info,
							})
							obj.getData();
							obj.screenView = false;	
						}
					});	
				break;
				case 'modify':
					this.$router.push({path:'/guild/chatNoticeWrite/'+this.gno+'/'+this.updateNo});
				break;
				case 'delete':
				var obj = this;
					var params = {
						content:"삭제하시겠습니까?",
						cancleView:true,
						doAction:function() {
							obj.actionRemove();					
						}
					};
					this.$eventBus.$emit('dialogOpen',params);
				break;
			}
		},
		editShow(no,notice) {
			
			this.popList = [];
			this.updateNo = no;
			var ntmsg = (notice=='yes')?'내리기':'등록하기';
			var item = {code:'notice',name:'공지 '+ntmsg}
			this.popList.push(item)
		
			var item = {code:'modify',name:'수정하기'}
			this.popList.push(item)
			var item = {code:'delete',name:'삭제하기'}
			this.popList.push(item)
			this.screenView = true
		},
		actionRemove() {
			var obj = this;
			this.$form.sendPost({no:this.updateNo},'chatProc/deleteNotice',function(resp) {
				if(resp.result == 'succ') {
					
					obj.socket.emit('message', { 
						mode:'noticeDelete',
						no:obj.updateNo
					})
						
					obj.getData();
					obj.screenView = false;	
				}
			});
		},
		chatInit() {
		  this.socket =  io.connect('https://duckku.com:8070',{secure:true});
		  var obj = this;
		  this.socket.on('connection', function(data) {
			 if(data.type == 'connected') { 
				 obj.socket.emit('connection', { 
					 type : 'noticeConnect', 
					 room : obj.gno 
				 }) 
			 }

		 })
		 
	  }
		
    },
	beforeDestroy() {
		if(this.socket) {
			this.socket.disconnect()
		}
    },
	mounted() {
	},	
	updated() {
		
	}
}
</script>

<style lang="scss" scoped>
.page-container {

	background:#fff;
	padding:0;
	margin:0;
	min-height:calc(100vh);
	.md-content {
		padding:5px 0 0 0;
		.data-layout {
			width:100%;
			padding:0 15px;
			.data-box > li {
				padding:15px 0;
				border-bottom:solid 1px #c3c3c3;
				position:relative;
				.subject {
						font-size:11pt;
						color:#999;
						padding-right:10px;
						width:100%;
						margin:8px 0 0 0;
				}
				.name-box {
					color:#000;
				}
				.modify {
					position:absolute;
					top:15px;
					right:10px;
				}
				
			}
			
		}
		
	}
}
</style>
