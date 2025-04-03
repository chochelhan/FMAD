<template>
    <div :class="'mypage-container '+mobileClass">

        <div class="contents">
            <div class="from-box">

                <div v-if="!mobileView" class="stitle">
                    <span>게시판 관리</span>
                </div>
                <div  v-if="!mobileView" class="title-desc">팬과 소통하는 게시판을 관리 할 수 있습니다.</div>
                <div class="board-create-box">
                    <div class="board-title-box">
                        <div class="board-title">게시판</div>
                        <div class="board-tip"  v-if="!mobileView">드래그 앤 드롭으로 그룹 및 게시판 순서를 변경할 수 있습니다</div>
                    </div>
                    <div class="board-button-box">
                        <v-btn class="reg-button" elevation="1" fab @click="showMakeBox()">
                            <i class="fas fa-plus"></i>
                        </v-btn>
                        <v-card class="board-guide-box" v-if="makeBoxShow" elevation="2"
                                width="200">
                            <ul>
                                <li v-for="(group,index) in groupList" @click="boardRegistOpen('board',index)">
                                    {{group.groupName}}
                                </li>
                                <li class="active" @click="boardRegistOpen('group','none')">그룹제목</li>

                            </ul>
                        </v-card>
                    </div>
                </div>
                <div class="board-reg-box" v-if="groupRegistShow">
                    <div class="reg-header">
                        <div class="text-box">
                            <div class="sm-title">그룹명</div>
                            <v-text-field
                                v-model="groupName"
                                placeholder="그룹명을 입력하세요"
                                outlined
                                dense
                                background-color="#fff"
                                :error-messages="groupNameErrors"
                                @input="groupNameTouch()"
                                @blur="groupNameTouch()"
                            ></v-text-field>
                        </div>
                        <div class="reg-button-box top-btn" style="margin:23px 0 0 20px">
                            <v-btn
                                class="cancle-button"
                                type="button"
                                @click="groupRegReset()">
                                취소
                            </v-btn>
                            <v-btn
                                class="submit-button"
                                type="button"
                                @click="registGroup()">
                                저장
                            </v-btn>

                        </div>
                    </div>
                </div>
                <div class="board-reg-box" v-if="registShow">
                    <div class="reg-header">
                        <div class="text-box">
                            <div class="sm-title">게시판명</div>
                            <v-text-field
                                v-model="boardName"
                                placeholder="게시판명을 입력하세요"
                                outlined
                                dense
                                background-color="#fff"
                                :error-messages="boardNameErrors"
                                @input="boardNameTouch()"
                                @blur="boardNameTouch()"
                            ></v-text-field>
                        </div>
                        <div class="select-box">
                            <div class="sm-title">공개설정</div>
                            <div>
                                <v-select
                                    v-model="boardVauth"
                                    :items="authList"
                                    outlined
                                    background-color="#fff"
                                    dense
                                ></v-select>
                            </div>
                        </div>
                        <div class="radio-box">
                            <div class="sm-title">글쓰기 권한</div>
                            <div>
                                <ul>
                                    <li v-for="(auth,index) in authList" @click="setBoardAuth(index)">
                                        <div :class="'icon-box '+auth.gclass">
                                            <i class="fas fa-check"></i>
                                        </div>
                                        <div class="text">{{auth.text}}</div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                    <div class="reg-button-box">
                        <v-btn
                            class="cancle-button"
                            type="button"
                            @click="boardRegReset()">
                            취소
                        </v-btn>
                        <v-btn
                            class="submit-button"
                            type="button"
                            @click="registBoard()">
                            저장
                        </v-btn>


                    </div>
                </div>

                <ul class="board-list">
                    <draggable v-model="groupList">
                    <li class="board-item" v-for="(group,index) in groupList">
                        <div class="group-info">
                            <div class="board-name">
                                {{group.groupName}}
                            </div>
                            <div class="board-upd-button" v-if="!mobileView">
                                <v-btn
                                    class="upd-button"
                                    type="button"
                                    depressed
                                    @click="groupUpdate(index)">
                                    수정
                                </v-btn>
                                <v-btn
                                    class="upd-button"
                                    type="button"
                                    depressed
                                    @click="groupDelete(index)">
                                    삭제
                                </v-btn>
                            </div>
                            <div class="board-upd-button" v-else>
                                <i class="fas fa-ellipsis-v"></i>
                            </div>
                        </div>
                        <ul class="sub-list" v-if="group.boardList && group.boardList.length>0">
                            <draggable v-model="group.boardList">
                            <li class="subItem" v-for="(board,subIndex) in group.boardList">
                                <div class="board-name">
                                    <span>&#12685;</span>  {{board.name}}
                                </div>
                                <div class="board-upd-button"  v-if="!mobileView">
                                    <v-btn
                                        class="upd-button"
                                        type="button"
                                        depressed
                                        @click="boardUpdate(index,subIndex)">
                                        수정
                                    </v-btn>
                                    <v-btn
                                        class="upd-button"
                                        type="button"
                                        depressed
                                        @click="boardDelete(index,subIndex)">
                                        삭제
                                    </v-btn>
                                </div>
                                <div class="board-upd-button" v-else>
                                    <i class="fas fa-ellipsis-v"></i>
                                </div>

                            </li>
                            </draggable>
                        </ul>
                    </li>
                    </draggable>

                </ul>
            </div>
            <div class="button-box">
                <v-btn
                    class="submit-button"
                    type="button"
                    @click="insertBoard()">
                    저장
                </v-btn>
            </div>


            <div class="board-create-box" style="margin-top:20px;">
                <div class="board-title-box">
                    <div class="board-title">사진첩</div>
                   <div class="board-tip" v-if="!mobileView">드래그 앤 드롭으로 분류 순서를 변경할 수 있습니다</div>
                </div>
                <div class="board-button-box">
                    <v-btn class="reg-button" elevation="1" fab @click="showPartBox()">
                        <i class="fas fa-plus"></i>
                    </v-btn>
                </div>
            </div>
            <div class="board-reg-box" v-if="photoPartRegistShow">
                <div class="reg-header">
                    <div class="text-box">
                        <div class="sm-title">분류명</div>
                        <v-text-field
                            v-model="partName"
                            placeholder="분류명을 입력하세요"
                            outlined
                            dense
                            background-color="#fff"
                            :error-messages="partNameErrors"
                            @input="partNameTouch()"
                            @blur="partNameTouch()"
                        ></v-text-field>
                    </div>
                    <div class="reg-button-box top-btn" style="margin:23px 0 0 20px">
                        <v-btn
                            class="cancle-button"
                            type="button"
                            @click="partRegReset()">
                            취소
                        </v-btn>
                        <v-btn
                            class="submit-button"
                            type="button"
                            @click="registPart()">
                            저장
                        </v-btn>

                    </div>

                </div>
            </div>

            <ul class="board-list">
                <draggable v-model="partList">
                    <li class="board-item" v-for="(part,index) in partList">
                        <div class="group-info">
                            <div class="board-name">
                                {{part.name}}
                            </div>
                            <div class="board-upd-button" v-if="!mobileView">
                                <v-btn
                                    class="upd-button"
                                    type="button"
                                    depressed
                                    @click="partUpdate(index)">
                                    수정
                                </v-btn>
                                <v-btn
                                    class="upd-button"
                                    type="button"
                                    depressed
                                    @click="partDelete(index)">
                                    삭제
                                </v-btn>
                            </div>
                            <div class="board-upd-button" v-else>
                                <i class="fas fa-ellipsis-v"></i>
                            </div>
                        </div>
                    </li>
                </draggable>

            </ul>
        </div>
        <div class="button-box" style="margin-bottom:50px;">
            <v-btn
                class="submit-button"
                type="button"
                @click="insertPhoto()">
                저장
            </v-btn>
        </div>
        </div>
    </div>
</template>


<script>
	import AUTH from '../../../api/auth'
	import {
		API_URL_USER_BOARD_UPDATE,
		API_URL_USER_BOARD_REGIST_INFO,
		API_URL_USER_PHOTO_UPDATE
	} from '../../../api/urls';
	import apiService from '../../../api/apiService';
	import draggable from "vuedraggable";
    import {mapActions} from "vuex";

	export default {
		name: 'userBoard',
		components: {
			draggable,
		},
		data() {
			return {
				no: '',
                uid:'',
				makeBoxShow: false,
				registShow: false,
				groupIndex: '',
				boardIndex: '',
				boardName: '',
				boardNameErrors: [],
				boardVauth: 'all',
				boardRauth: 'all',

				groupList: [],
				mobileView: false,
				mobileClass: '',
				insertFlag: false,
				no: '',
				authList: [
					{text: '전체', value: 'all', gclass: 'active'},
					{text: '회원', value: 'user', gclass: ''},
					{text: '구독자', value: 'follwer', gclass: ''},
				],
				groupRegistShow: false,
				groupName: '',
				groupNameErrors: [],
				groupMode:'',
                boardMode:'',
				photoPartRegistShow:false,
				partName: '',
				partNameErrors: [],
				partList:[],
				partMode:'',
				partIndex:'',

			}
		},
		created() {
			let memberInfo = AUTH.getSession(this.$isMobile());
			if (!memberInfo.AUTHTOKEN) {
				this.$router.push({path: '/'});
				return;
			}
            if (this.$isMobile()) {
                this.mobileView = true;
                this.mobileClass = 'mobile'
                this.setClass('sub')
                this.setTitle('게시판 관리');
                this.setBackUrl('');
            }
			this.uid = memberInfo.uid;
			this.getData();
		},
		methods: {
            ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
			showMakeBox() {
				if (this.makeBoxShow) this.makeBoxShow = false;
				else this.makeBoxShow = true;
			},
			boardRegistOpen(cmd, index) {
				this.makeBoxShow = false;
				if (cmd == 'group') {
					this.groupMode = 'insert'
					this.groupRegistShow = true;
					this.registShow = false;
					this.groupIndex = '';
					this.groupName = '';
					this.groupNameErrors = [];
				} else {
					this.boardMode = 'insert'
					this.groupRegistShow = false;
					this.registShow = true;
					this.groupIndex = index;
					this.doBoardRegReset();
				}
			},
			setBoardAuth(index) {
				let k = 0;
				for (let auth of this.authList) {
					if (index == k) {
						auth.gclass = 'active'
					} else auth.gclass = ''
					k++;
				}
				this.boardRauth = this.authList[index].value;
			},
			boardRegReset() {
				this.registShow = false;
				this.doBoardRegReset();
			},
			doBoardRegReset() {
				this.boardName = '';
				this.boardNameErrors = [];
				this.boardVauth = 'all';
				this.boardRauth = 'all';
				let k = 0;
				for (let auth of this.authList) {
					if (0 == k) {
						auth.gclass = 'active'
					} else auth.gclass = ''
					k++;
				}
			},
			registBoard() {
				if (!this.boardName) {
					this.boardNameTouch();
					return;
				}
				if (!this.groupList[this.groupIndex].boardList) {
					this.groupList[this.groupIndex].boardList = [];
				}


				if (this.boardMode == 'update') {
					let board = this.groupList[this.groupIndex].boardList[this.boardIndex];
					board.name = this.boardName;
					board.vauth = this.boardVauth;
					board.rauth = this.boardRauth;

				} else {

					let boardList = this.groupList[this.groupIndex].boardList;
					let item = {
						code: this.getCode('board'),
						name: this.boardName,
						vauth: this.boardVauth,
						rauth: this.boardRauth
					}
					boardList.push(item);
				}
				this.boardRegReset();
			},
			groupRegReset() {
				this.groupRegistShow = false;
				this.groupName = '';
				this.groupNameErrors = [];

			},
			registGroup() {
				if (!this.groupName) {
					this.groupNameTouch();
					return;
				}
				if (this.groupMode == 'update') {
					let group = this.groupList[this.groupIndex];
					group.groupName = this.groupName

				} else {
					let item = {code: this.getCode('group'), groupName: this.groupName, boardList: []}
					this.groupList.push(item);
				}
				this.groupRegReset();

			},
			boardNameTouch() {
				this.boardNameErrors = [];
				if (!this.boardName) {
					this.boardNameErrors.push('게시판명을 입력하세요')
				}
			},
			groupNameTouch() {
				this.groupNameErrors = [];
				if (!this.groupName) {
					this.groupNameErrors.push('그룹명을 입력하세요')
				}
			},
			partNameTouch() {
				this.partNameErrors = [];
				if (!this.partName) {
					this.partNameErrors.push('분류명을 입력하세요')
				}
			},
			getData() {

				const frm = new FormData()
				apiService.post(API_URL_USER_BOARD_REGIST_INFO, frm, (res) => {
					if (res.info) {
						this.groupList = res.info.content;
						this.no = res.info.no

					}
					if(res.photo) {
						this.partList = res.photo.content;
					}

				});

			},
			getCode(type) {
				let codeText = '';
				let menuList = [];
				switch (type) {
					case 'group':
						codeText = this.uid + '_grp';
						menuList = this.groupList
						break;
					case 'board':
						codeText = this.uid + '_brd';
						menuList = this.groupList[this.groupIndex].boardList
						break;

				}
				let code = codeText + (Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000);
				for (let item of menuList) {
					if (item.code == code) {
						code = this.getCode(type);
					}
				}
				return code;
			},
			boardDelete(index, subIndex) {
				let params = {
					type: 'confirm',
					message: '게시판을 삭제하시겠습니까?',
					doAction: () => {
						this.makeBoxShow = false;
						this.groupRegistShow = false;
						this.registShow = false;
						this.groupList[index].boardList.splice(subIndex, 1)
					}
				};
				this.$eventBus.$emit('modalOpen', params);
			},
			groupUpdate(index) {
				this.makeBoxShow = false;
				this.groupRegistShow = true;
				this.registShow = false;

				this.groupIndex = index;
				let group = this.groupList[index];
				this.groupName = group.groupName;
				this.groupNameErrors = [];
				this.groupMode = 'update'
			},
			groupDelete(index) {

				let params = {
					type: 'confirm',
					message: '그룹을 삭제하시겠습니까?',
					doAction: () => {
						this.makeBoxShow = false;
						this.groupRegistShow = false;
						this.registShow = false;
						this.groupList.splice(index, 1)
					}
				};
				this.$eventBus.$emit('modalOpen', params);
			},
			boardUpdate(index, subIndex) {
				this.makeBoxShow = false;
				this.groupRegistShow = false;
				this.registShow = true;

				this.groupIndex = index;
				this.boardIndex = subIndex;
				let board = this.groupList[index].boardList[subIndex];
				this.boardName = board.name;
				this.boardNameErrors = [];
				this.boardVauth = board.vauth;
				this.boardRauth = board.rauth
				for (let auth of this.authList) {
					if (auth.value == this.boardRauth) {
						auth.gclass = 'active'
					} else auth.gclass = ''
				}
				this.boardMode = 'update'

			},

			insertBoard() {
				if (this.insertFlag) return;
				if (this.groupList.length < 1) {
					let params = {
						message: '그룹을 1개이상 등록하세요',
					};
					this.$eventBus.$emit('modalOpen', params);
					return;
				}
				let insertAction = false;
				for (let item of this.groupList) {
					if (item.boardList.length > 0) {
						insertAction = true;
					}
				}
				if (!insertAction) {
					let params = {
						message: '게시판을 1개이상 등록하세요',
					};
					this.$eventBus.$emit('modalOpen', params);
					return;
				}
				const frm = new FormData()
				frm.append('content', JSON.stringify(this.groupList))
				if (this.no) {
					frm.append('no', this.no)
				}
				this.$eventBus.$emit('overlay', 'open');
				this.insertFlag = true;
				apiService.post(API_URL_USER_BOARD_UPDATE, frm, (res) => {
					this.$eventBus.$emit('overlay', 'hide');
					this.insertFlag = false;
					let params = {
						message: '게시판이 등록되었습니다',
					};
					this.$eventBus.$emit('modalOpen', params);
					return;
				});
			},
			showPartBox() {
				this.partIndex = '';
				this.partMode = 'insert';
				this.photoPartRegistShow = true;
				this.doPartRegReset()
		    },
			partRegReset() {
				this.photoPartRegistShow = false;
				this.doPartRegReset()
            },
			doPartRegReset() {
				this.partName = '';
				this.partNameErrors = [];
				this.partIndex = '';
				this.partMode = '';
			},
			registPart() {
				if(!this.partName) {
					this.partNameTouch();
					return;
                }
                if(this.partMode=='update') {
	                let item = this.partList[this.partIndex];
	                item.name = this.partName;
                } else {
	                let item = {name: this.partName, code: this.getPartCode()}
	                this.partList.push(item)
                }
                this.partRegReset();
            },
			getPartCode() {
				let codeText = '';
				codeText = this.uid + '_prt';
				let code = codeText + (Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000);
				for (let item of this.partList) {
					if (item.code == code) {
						code = this.getPartCode();
					}
				}
				return code;
			},
			partUpdate(index) {
				this.photoPartRegistShow = true;
				let part = this.partList[index];
				this.partName = part.name;
				this.partIndex = index;
				this.partNameErrors = [];
				this.partMode = 'update'
			},
			partDelete(index) {

				let params = {
					type: 'confirm',
					message: '분류을 삭제하시겠습니까?',
					doAction: () => {
						this.photoPartRegistShow = false;
						this.partList.splice(index, 1)
					}
				};
				this.$eventBus.$emit('modalOpen', params);
			},
			insertPhoto() {
				if (this.partList.length < 1) {
					let params = {
						message: '분류를 1개이상 등록하세요',
					};
					this.$eventBus.$emit('modalOpen', params);
					return;
				}
				const frm = new FormData()
				frm.append('content', JSON.stringify(this.partList))
				this.$eventBus.$emit('overlay', 'open');
				apiService.post(API_URL_USER_PHOTO_UPDATE, frm, (res) => {
					this.$eventBus.$emit('overlay', 'hide');
					this.insertFlag = false;
					let params = {
						message: '사진첩 분류가 등록되었습니다',
					};
					this.$eventBus.$emit('modalOpen', params);
					return;
				});
			},
		}

	}
</script>

<style lang="scss" scoped="true">
    .mypage-container {
        min-height: calc(100vh);
        background: #fff;
        border: solid 1px #fff;

        .form-box {
            padding: 0;
            width: 100%;
            margin: 0;

            .sub-title {
                font-weight: bold;
                font-size: 11pt;
                text-align: left;
                padding: 20px 0 20px 0;
                position: relative;

                .reg-button {
                    position: absolute;
                    right: 0;
                    bottom: 12px;
                }
            }
        }

        .button-box {
            width: 320px;
            margin: 70px auto;

            .submit-button {
                width: 100%;
                height: 60px;
                border-radius: 0;
                background: #686EFB;
                color: #fff;
            }
        }

        .board-create-box {
            border: solid 2px #686EFB;
            display: flex;
            padding: 20px;

            .board-title-box {
                width: 90%;

                .board-title {
                    font-size: 17pt;
                    font-weight: bold;
                    color: #000;
                }

                .board-tip {
                    color: #999;
                    font-size: 10pt;
                }
            }

            .board-button-box {
                min-width: 140px;
                position: relative;
                text-align: right;

                .reg-button {
                    background: #686EFB;
                    font-size: 20pt;
                    color: #fff;
                }

                .board-guide-box {
                    position: absolute;
                    z-index: 10;
                    top: 0;
                    right: 67px;

                    ul {
                        width: 100%;
                        padding: 0;
                        margin: 0;

                        li {
                            text-align: left;
                            padding: 10px 10px 10px 20px;
                            color: #000;
                            cursor: pointer;

                            &.active {
                                background: #686EFB;
                                color: #fff;
                            }
                        }
                    }

                }
            }
        }

        .board-reg-box {
            background: #F2F2F2;
            padding: 20px;

            .reg-header {
                display: flex;
                justify-content: space-between;

                .sm-title {
                    font-size: 10pt;
                    margin-bottom: 5px;
                }

                .input-box {
                    input {
                        background: #fff;
                    }
                }

                .text-box {
                    width: 70%;

                }

                .select-box {
                    margin: 0 20px;
                    width: 200px;
                }

                .radio-box {
                    width: 500px;

                    ul {
                        padding: 0;
                        display: flex;
                        margin-top: 10px;

                        li {
                            margin-right: 20px;
                            display: flex;
                            cursor: pointer;

                            .icon-box {
                                width: 30px;
                                height: 30px;
                                border-radius: 50%;
                                text-align: center;
                                color: #dcdcdc;
                                border: solid 1px #ccc;
                                line-height: 30px;
                                margin-right: 5px;

                                &.active {
                                    background: #686EFB;
                                    color: #fff;
                                }
                            }

                            .text {
                                font-size: 10pt;
                                padding-top: 5px;
                            }
                        }
                    }

                }
            }

            .reg-button-box {
                width: 320px;
                margin: auto;
                display: flex;

                .cancle-button {
                    width: 150px;
                    background: #999;
                    color: #fff;
                    border-radius: 0;
                    height: 40px;
                    margin-right: 20px;
                }

                .submit-button {
                    width: 150px;
                    height: 40px;
                    border-radius: 0;
                    background: #686EFB;
                    color: #fff;
                }
            }
        }

        .board-list {
            padding: 0;

            .board-item {
                border-bottom: solid 1px #dcdcdc;

                .group-info {
                    display: flex;
                    padding: 10px 0 10px 20px;

                    .board-name {
                        color: #000;
                        width: 90%;
                        margin-top: 10px;
                        font-weight: bold;
                        cursor: move;

                    }

                    .board-upd-button {
                        min-width: 150px;
                        text-align: right;

                        .upd-button {
                            width: 60px;
                            margin: 0 10px 0 0;
                            color: #000;
                            border: solid 1px #DCDCDC;
                            border-radius: 0;
                        }
                    }
                }

                .sub-list {
                    padding: 0;

                    .subItem {
                        border-top: solid 1px #dcdcdc;
                        display: flex;
                        padding: 10px 0 10px 50px;

                        .board-name {
                            cursor: move;
                            color: #000;
                            width: 90%;
                            margin-top: 10px;
                            font-weight: bold;

                            span {
                                font-size: 14pt;
                            }
                        }

                        .board-upd-button {
                            min-width: 150px;
                            text-align: right;

                            .upd-button {
                                width: 60px;
                                margin: 0 10px 0 0;
                                color: #000;
                                border: solid 1px #DCDCDC;
                                border-radius: 0;
                            }
                        }
                    }
                }
            }
        }
        &.mobile {
            width: 100%;
            margin: 0;
            overflow-x: hidden;
            padding: 30px 15px;
            .contents {
                padding: 0;
            }
            .form-box {
                padding: 0;
                width: 100%;
                margin: 0;

                .sub-title {
                    font-weight: bold;
                    font-size: 11pt;
                    text-align: left;
                    padding: 20px 0 20px 0;
                    position: relative;

                    .reg-button {
                        position: absolute;
                        right: 0;
                        bottom: 12px;
                    }
                }
            }

            .button-box {
                width:100%;
                margin:20px auto 60px auto;

                .submit-button {
                    width: 100%;
                    height: 50px;
                    border-radius: 0;
                    background: #686EFB;
                    color: #fff;
                }
            }

            .board-create-box {
                padding:12px 15px;
                .board-title-box {
                    .board-title {
                        font-size: 13pt;
                    }

                }
                .board-button-box {
                    min-width: 40px;
                    position: relative;
                    text-align: right;
                    .reg-button {
                        background: #686EFB;
                        font-size:10pt;
                        color: #fff;
                        width:24px;
                        height:24px;
                    }

                    .board-guide-box {
                        position: absolute;
                        z-index: 10;
                        top: 0;
                        right: 30px;
                        min-width:150px;
                        ul {
                            width: 100%;
                            padding: 0;
                            margin: 0;

                            li {
                                text-align: left;
                                padding: 10px 10px 10px 20px;
                                color: #000;
                                cursor: pointer;
                                font-size:10pt;
                                &.active {
                                    background: #686EFB;
                                    color: #fff;
                                }
                            }
                        }

                    }
                }
            }

            .board-reg-box {
                background: #F2F2F2;
                padding:15px;

                .reg-header {
                    display:block;
                    .sm-title {
                        font-size: 10pt;
                        margin-bottom: 5px;
                    }
                    .input-box {
                        input {
                            width:100%;
                            background: #fff;
                        }
                    }

                    .text-box {
                        width: 100%;

                    }
                    .select-box {
                        margin: 0;
                        width:100%;
                    }

                    .radio-box {
                        width:100%;

                        ul {
                            padding: 0;
                            display: flex;
                            margin-top: 10px;

                            li {
                                margin-right: 20px;
                                display: flex;
                                cursor: pointer;

                                .icon-box {
                                    width: 30px;
                                    height: 30px;
                                    border-radius: 50%;
                                    text-align: center;
                                    color: #dcdcdc;
                                    border: solid 1px #ccc;
                                    line-height: 30px;
                                    margin-right: 5px;

                                    &.active {
                                        background: #686EFB;
                                        color: #fff;
                                    }
                                }

                                .text {
                                    font-size: 10pt;
                                    padding-top: 5px;
                                }
                            }
                        }

                    }
                }

                .reg-button-box {
                    width:100%;
                    display: flex;
                    margin:30px 0 10px 0;
                    padding:0;
                    &.top-btn {
                        position:relative;
                        left:-20px;
                    }
                    .cancle-button {
                        width:48%;
                        background: #999;
                        color: #fff;
                        border-radius: 0;
                        height: 40px;
                        margin-right: 4%;
                    }

                    .submit-button {
                        width: 48%;
                        height: 40px;
                        border-radius: 0;
                        background: #686EFB;
                        color: #fff;
                    }
                }
            }

            .board-list {
                padding: 0;

                .board-item {
                    border-bottom: solid 1px #dcdcdc;

                    .group-info {
                        display: flex;
                        padding: 10px 0 10px 20px;

                        .board-name {
                            color: #000;
                            width: 90%;
                            margin-top: 10px;
                            font-weight: bold;
                            cursor: move;

                        }

                        .board-upd-button {
                            min-width: 30px;
                            text-align:center;
                            color:#ccc;
                            font-size:11pt;
                            padding-top:12px;
                        }
                    }

                    .sub-list {
                        padding: 0;

                        .subItem {
                            border-top: solid 1px #dcdcdc;
                            display: flex;
                            padding: 10px 0 10px 20px;

                            .board-name {
                                cursor: move;
                                color: #000;
                                width: 90%;
                                margin-top: 10px;
                                font-weight: bold;

                                span {
                                    font-size: 14pt;
                                }
                            }

                            .board-upd-button {
                                min-width: 30px;
                                text-align:center;
                                color:#ccc;
                                font-size:11pt;
                                padding-top:12px;
                            }
                        }
                    }
                }
            }
        }
    }

</style>