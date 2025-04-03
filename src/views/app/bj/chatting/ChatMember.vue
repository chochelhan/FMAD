<template>
    <div class="member-container">
        <div class="md-toolbar-row">
            <div class="md-icon-button" @click="goBack()">
                <i class="fas fa-chevron-left"></i>
            </div>
            <span class="gtitle">대화 멤버 {{totalMember}}</span>

        </div>
        <div class="data-layout">
            <ul class="data-box">
                <li v-if="myData.uno">
                    <div class="user-box">
                        <div class="photo">
                            <img :src="host+myData.photo" v-if="myData.photo"/>
                            <i v-else class="fa fa-user"></i>
                        </div>
                        <div class="name-box">
                            <div class="name">
                                {{myData.name}}
                                <span></span>
                            </div>
                            <div class="add">
                                {{myData.levalName}}
                            </div>
                        </div>
                    </div>
                    <!--div class="perm-box" @click="goBcard(myData.uid)">
                        <i class="fa fa-cog"></i>
                    </div-->

                </li>
                <li v-for="member,index in memberList">

                    <div class="user-box">
                        <div class="photo">
                            <img :src="host+member.photo" v-if="member.photo"/>
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
                        <i v-if="chatUid!=member.no" @click="showEditBox(index)" class="fas fa-paper-plane"></i>
                    </div>

                </li>


            </ul>

        </div>

    </div>
</template>
<script>
	import {
		HOST,
		API_URL_MESSAGE_GET_MEMBER_LIST,
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';

	export default {
		name: 'ChatMember',
		props: ["ownerUid"],
		data() {
			return {
				host: HOST,
				memberList: [],
				myData: {},
				totalMember: '',
				choiceUserInfo: {},
				chatUid: '',
			}
		},
		created() {
			this.init();
		},
		methods: {
			init() {
				this.memberList = [];
				this.myData = {};
				this.choiceUserInfo = {};
				this.chatUid = '';
				this.getData()
			},
			goBack() {
				this.$emit('hideMember',{type:'hide'})
            },
			getData() {
				const frm = new FormData()
				frm.append('ownerUid', this.ownerUid)
				apiService.post(API_URL_MESSAGE_GET_MEMBER_LIST, frm, (resp) => {


					for(let member of resp.memberList) {
						member.editView = false;
						this.memberList.push(member)
                    }
					this.totalMember = parseInt(this.memberList.length) + 1;
					this.myData = resp.myData;
					this.chatUid = resp.chatUid;


				});
			},
			showEditBox(index) {
				this.$emit('hideMember',{type:'message',member:this.memberList[index]})
			},


		},

	}
</script>

<style lang="scss" scoped>
    .member-container {
        padding: 0;
        margin: 0;
        width: 100%;
        background: #fff;
        .md-toolbar-row {
            display:flex;
            padding:15px 20px 15px 20px;
            border-bottom: solid 1px #dfdfdf;
            .md-icon-button {
                width:40px;
                cursor:pointer;
                font-weight:bold;
                color:#5A3FD2;
                font-size:18pt;

            }
            .gtitle {
                font-weight:bold;
                color:#000;
                font-size:12pt;
                padding-top:5px;

            }
        }
        .data-layout {
            background: #fff;
            width: 100%;
            padding:18px 0 20px 0;
            min-height:400px;
            max-height:500px;
            overflow-y: auto;
            .data-box {
                padding:0;
                li {
                    width: auto;
                    border-bottom: solid 1px #dfdfdf;
                    position: relative;
                    padding: 18px 0;
                    margin: 0 25px;
                    h3 {
                        text-align: center;
                        font-size: 10pt;
                        color: #999;
                    }
                    .user-box {
                        display: flex;
                        .photo {
                            background: #27108C;
                            color: #fff;
                            width: 30px;
                            height: 30px;
                            overflow: hidden;
                            border-radius: 15px;
                            text-align: center;
                            img {
                                width: 30px;
                                min-height: 30px;
                            }
                            i {
                                line-height: 30px;
                                color: #fff;
                            }
                        }
                        .name-box {
                            margin: -3px 0 0 8px;
                            .name {
                                font-weight: bold;
                                font-size: 11pt;
                                color: #000;
                                span {
                                    width: 8px;
                                    height: 8px;
                                    background: #27108C;
                                    display: inline-block;
                                    margin: 0 0 1px 3px;
                                    border-radius: 4px;
                                }
                            }
                            .add {
                                line-height: 150%;
                                font-size: 8pt;
                                color: #c4c4c4;
                            }
                        }
                    }
                    .perm-box {
                        position: absolute;
                        right: 0;
                        top: 20px;
                        z-index:10;
                        cursor:pointer;
                        button {
                            width: 40px;
                            height: 25px;
                            color: #fff;
                            line-height: 25px;
                            border-radius: 5px;
                            border: none;
                            padding: 0;
                            margin: 0;
                            font-size: 9pt;
                        }
                        .deny-button {
                            margin-right: 10px;
                            background: #999999;
                        }
                        .acc-button {
                            background: #0078FE;
                        }
                        i {
                            margin:5px 5px 0 0;
                            color: #c4c4c4;
                            font-size: 13pt;
                        }
                    }
                }
            }
            li:last-child {
                border-bottom: none;
            }
        }

    }
    .board-guide-box {
        position: absolute;
        z-index: 10;
        top: 20px;
        right: 10px;
        span {
            display:inline-block;
            float:right;
            margin:10px 10px 0 0;
            cursor:pointer;
        }
        ul {
            width: 100%;
            padding: 0;
            margin: 0;
            li {
                text-align: left;
                padding: 10px 10px 10px 20px;
                color: #000;
                font-size:10pt;
                cursor: pointer;
                &.active {
                    background: #686EFB;
                    color: #fff;
                }
            }
        }

    }
</style>
