<template>
	<div class="page-container" >
		<md-toolbar style='position:fixed;background:#fff;top:0;'>
			<div class="md-toolbar-row">
				<div class="md-toolbar-section-start">
					<md-button class="md-icon-button" @click="$router.go(-1)">
						<i class="fas fa-chevron-left"></i>
					</md-button>
					 <span class="title">멤버 {{totalMember}}</span>
		
				</div>
			</div>	
		</md-toolbar>
		<div class="data-layout">
			<ul class="data-box">
				<li v-for="member,index in memberList">
					
					<div class="user-box">
						<div class="photo">
							<img :src="$VARS.url+member.photo" v-if="member.photo"/>
							<i v-else class="fa fa-user"></i>
						</div>
						<div class="name-box">
							<div class="name">
								{{member.name}}
							</div>
							<div class="add">
								{{member.levalName}}
							</div>
						</div>
					</div>
					<div class="perm-box">
						<md-button :class="'md-raised '+member.gclass" @click="setUser(member.no,index)">선택</md-button>
					</div>
				</li>
				
			</ul>	
		</div>
		<div class="button-box">
			<md-button class="md-raised" style="width:30%;background:#999999;color:#fff;" @click="selectAll()">전체 선택</md-button>
			<md-button class="md-raised" style="width:70%;background:#27108C;color:#fff;" @click="sendPush()">푸쉬 보내기</md-button>
		</div>
		
    </div>
</template>
<script>
export default {
	name: 'GuildChatPushMembers',
	data() {
		return {
			totalMember:'',
			memberList:[],
			choiceMemberList:[],
			no:'',
			gno:'',
		}
	},
	created() {
		this.no = this.$route.params.no;
		this.gno = this.$route.params.gno;
		this.getData()
		
	},
    methods: {
		getData() {
			var obj = this;
			this.$form.sendPost({gno:this.gno,no:this.no},'chatProc/getGuildMembers',function(resp) {
				//console.log(resp);
				if(resp.result == 'succ') {
					obj.memberList = resp.list;
					obj.totalMember = obj.memberList.length;
				} else {
					var fparams = {
						content:"잘못된 접근입니다",
						doAction:function() {
							obj.$router.go(-1);
						}
					};
					obj.$eventBus.$emit('dialogOpen',fparams);
				}
			});	
		},
		setUser(uno,index) {
			var item = this.memberList[index];
			if(item.gclass == 'active') {
				item.gclass = 'normal'

				for(var i in this.choiceMemberList) {
					if(this.choiceMemberList[i] == uno) {
						this.choiceMemberList.splice(i,1)
						break;
					}
				}

			} else {
				item.gclass = 'active'
				this.choiceMemberList.push(uno);
			}
			
		},
		selectAll() {
			this.choiceMemberList = [];
			for(var key in this.memberList) {
				var item = this.memberList[key];
				item.gclass = 'active'
				this.choiceMemberList.push(item.no);
			}

		},
		sendPush() {
			if(this.choiceMemberList.length<1) {
				var params = {
					content:"멤버를 하나이상 선택하세요",
				};
				this.$eventBus.$emit('dialogOpen',params);	
				return;
			}
			var obj = this;
			var params = {
				content:"푸쉬메세지를 보내시겠습니까?",
				cancleView:true,
				doAction:function() {
					obj.pushProc();
				}
			};
			this.$eventBus.$emit('dialogOpen',params);
			
	   },
	   pushProc() {
			var obj = this;
			var params = {gno:this.gno,no:this.no,nos:this.choiceMemberList}
			this.$form.sendPost(params,'chatProc/sendPush',function(response){
				if(response.result=='succ') {
					var params = {
						content:"푸쉬메세지를 발송하였습니다",
						doAction:function() {
							obj.$router.go(-1);
						}
					};
					obj.$eventBus.$emit('dialogOpen',params);
			
					
				} else {
					var params = {
						content:"메세지발송에 실패하였습니다",
					};
					obj.$eventBus.$emit('dialogOpen',params);
			
				}
			});
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
	padding:0;
	margin:0;
	min-height:calc(100vh);
	overflow-y:auto;
	height:calc(100vh);
	.data-layout {
		background:#fff;
		width:100%;
		margin:60px 0 60px 0;
		.data-box {
			li {
				width:auto;
				border-bottom:solid 1px #dfdfdf;
				position:relative;
				padding:18px 0;
				margin:0 15px;
				h3 {
					text-align:center;
					font-size:10pt;
					color:#999;
				}
				.user-box {
					display:flex;
					.photo {
						background:#27108C;
						color:#fff;
						width:30px;
						height:30px;
						overflow:hidden;
						border-radius:15px;
						text-align:center;
						img {
							width:30px;
							min-height:30px;
						}
						i {
							line-height:30px;
							color:#fff;
						}
					}
					.name-box {
						margin:-3px 0 0 8px;
						.name {
							font-weight:bold;
							font-size:11pt;
							color:#000;
							span {
								width:8px;
								height:8px;
								background:#27108C;
								display:inline-block;
								margin:0 0 1px 3px;
								border-radius:4px;
							}
						}
						.add {
							line-height:150%;
							font-size:8pt;
							color:#c4c4c4;
						}
					}
				}
				.perm-box {
					position:absolute;
					right:0;
					top:20px;
					.md-button {
						width:45px;
						min-width:45px;
						height:25px;
						color:#fff;
						line-height:25px;
						border:none;
						padding:0;
						margin:0 5px 0 0;
						font-size:9pt;
						border-radius:5px;
					}
					.normal {
						background:#999999;
					}
					.active {
						background:#0078FE;
					}
				}
			}
		}
		li:last-child {
			border-bottom:none;
		}
	}
	.button-box {
		width:100%;
		height:50px;
		bottom:0;
		position:fixed;
		z-index:5;
		.md-button {
			height:50px;
			color:#fff;
			line-height:50px;
			border:none;
			padding:0;
			margin:0;
			font-size:11pt;
			border-radius:0;
			
		}
		
	}
	
}
</style>
