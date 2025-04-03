
<template>
	<div class="page-container">
		<form  id="chatNoticeForm" action="chatProc/noticeInsert" novalidate @submit="formSubmit">
		<input type="hidden" :value="gno" name="gno" id="gno"/>
		<input type="hidden" :value="info.no" name="no" id="no"/>
			
		<md-toolbar style='background:#fff;'>
			<div class="md-toolbar-row">
				<div class="md-toolbar-section-start">
					<md-button class="md-icon-button" @click="$router.go(-1)">
						<i class="fas fa-chevron-left"></i>
					</md-button>
					 <span class="title">공지글 쓰기</span>
		
		   		</div>
				<div class="md-toolbar-section-end">
					<button class="white"  style='margin:0 15px 0 0;font-size:11pt;padding:0;color:#27108C;font-weight:bold;background:#fff;border:none;' type="submit">
						{{buttonMsg}}
					</button>
				</div>
			</div>	
		</md-toolbar> 

		<md-content>
			<div class="from-box">
					<div class='form-group'>   
						<div class="md-field" style='border:none;'> 
						  <textarea required="true" style='width:100%;height:180px;border:none;outline:none;font-size:12pt;' placeholder="내용을 입력해주세요"  name="contents" id="contents">{{info.contents}}</textarea>
						</div>
						<div class="md-error-box">내용을 입력하세요</div>
					</div>
					
			</div>
			
		</md-content>
		</form>
		
	</div>	
	
</template>

<script>

export default {
  name: 'GuildChatNoticeWrite',
  data () {
	
	return {
  	   gno:'',
	   info:{},
	   buttonMsg:'등록하기',
	   submitFlag:false,
	   socket:null,
	   	
    }
  },

  created: function() {
	  localStorage.setItem('boardMode','');
	  if(!localStorage.getItem('memberkey')) {
		  this.$router.push({path:'/member/login'});
		  return;
	  }
	  this.gno = this.$route.params.gno;
	  if(this.$route.params.no!='new') {
		this.getData(this.$route.params.no)  
	  } 
	  this.chatInit();
	  
  },
  methods: {
	  getData(no) {
		    var obj = this;
			this.buttonMsg = '수정하기';
			var url = 'chatProc/getNoticeInfo';
			var params = {no:no}
			this.$form.sendPost(params,url,function(resp) {
				if(resp.result == 'succ') {
					obj.info = resp.info;
					
				}

			});
	  },
	  formSubmit(e) {
		  if(this.submitFlag)return;
		  var $f = $('#chatNoticeForm');
		  this.submitFlag = true;
		  var obj = this;
		  this.$form.validate($f,e,function(resp) {
				//console.log(resp);
				if(!obj.info.no) {
					obj.socket.emit('message', { 
						mode:'notice',
						noticeMsg:resp.info.contents,
						notice:resp.info,
					})
				}
				obj.submitFlag = false;
				obj.$router.go(-1);
				
		 });
		 e.preventDefault();
		 return;
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
  mounted: function() {

	
  },
  updated() {
		
	
  }

}
</script>
<style>

#preview-box div {
	 	position:relative;
		margin-top:5px;
}
#preview-box div span {
	position:absolute;
	right:0;
	top:0;
	display:inline-block;
	width:30px;
	height:30px;
	background:#000;
	color:#fff;
	text-align:center;
	line-height:30px;

}
</style>
<style lang="scss" scoped>
.md-content {margin:0;padding:0;}
.page-container {width:100%;min-height:100%;background:#fff;}
.from-box {padding:15px;}

.button-box {
	position:fixed;width:100%;bottom:0;padding:0;margin:0;
	height:50px;
	background:#fff;
	z-index:1000000;
	border-top:solid 1px #dcdcdc;
	display:flex;
	.img-box {
		width:50%;
		position:relative;
		input[type="file"] {
			width:40px;
			position:absolute;
			top:0;
			margin-left:20px;
			height:35px;
			opacity:0;
			cursor:pointer;
			z-index:10000;
		}
		.md-button {
			padding:0;
			margin:5px 0 0 20px;
			width:40px;
			height:40px;
			min-width:40px;
			min-height:40px;
		}
	}
	.writeButton {
		width:50%;
		text-align:right;
	}
}
.preview-layout {
	width:100%;
	height:150px;
	position:fixed;
	bottom:85px;
	left:0;
	padding:7px;
	.no-img {
		position:absolute;
		color:#f00;
		padding-left:5px;
		top:-15px;

	}
	.swiper-container {
		margin:0;
		padding:0;
		.swiper-slide {
			width:40%;
			margin:0 7px;
			position:relative;
			div {
				padding:10px 0 0 0;
				height:150px;
				overflow:hidden;
				span {
					z-index:300;
					position:absolute;
					right:-10px;
					top:0;
					display:inline-block;
					width:24px;
					height:24px;
					border-radius:12px;
					border:solid 1px #dcdcdc;
					background:#fff;
					color:#dcdcdc;
					text-align:center;
					line-height:24px;
					i {
						font-size:8pt;
					}
				}
			}
		}
		
	}
}


</style>