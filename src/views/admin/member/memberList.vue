<template>
    <div class="page-contents">

        <div class="search-box">
            <div class="date-box">
                <v-menu
                    ref="stDatePicker"
                    v-model="stDatePicker"
                    :close-on-content-click="false"
                    :return-value.sync="stdate"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                            v-model="stdate"
                            label="등록일(시작)"
                            readonly
                            height="30"
                            v-bind="attrs"
                            outlined
                            dense
                            v-on="on"
                        ></v-text-field>
                    </template>
                    <v-date-picker
                        v-model="stdate"
                        scrollable
                    >
                        <v-spacer></v-spacer>
                        <v-btn
                            text
                            color="primary"
                            @click="stDatePicker = false"
                        >
                            취소
                        </v-btn>
                        <v-btn
                            text
                            color="primary"
                            @click="$refs.stDatePicker.save(stdate)"
                        >
                            확인
                        </v-btn>
                    </v-date-picker>
                </v-menu>
                <i class="far fa-calendar-alt"></i>
            </div>
            <div class="date-box">
                <v-menu
                    ref="enDatePicker"
                    v-model="enDatePicker"
                    :close-on-content-click="false"
                    :return-value.sync="endate"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                            v-model="endate"
                            label="등록일(종료)"
                            readonly
                            outlined
                            dense
                            v-bind="attrs"
                            v-on="on"
                        ></v-text-field>
                    </template>
                    <v-date-picker
                        v-model="endate"
                        scrollable
                    >
                        <v-spacer></v-spacer>
                        <v-btn
                            text
                            color="primary"
                            @click="enDatePicker = false"
                        >
                            취소
                        </v-btn>
                        <v-btn
                            text
                            color="primary"
                            @click="$refs.enDatePicker.save(endate)"
                        >
                            확인
                        </v-btn>
                    </v-date-picker>
                </v-menu>
                <i class="far fa-calendar-alt"></i>
            </div>
            <div class="select-box" style="width:170px;">
                <v-select
                    v-model="mtype"
                    :items="mtypeItems"
                    label="회원분류"
                    outlined
                    dense
                ></v-select>

            </div>
            <div class="select-box">
                <v-select
                    v-model="cmd"
                    :items="searchItems"
                    label="검색어타입"
                    outlined
                    dense
                ></v-select>

            </div>
            <div class="text-box">
                <v-text-field
                    v-model="keyword"
                    label="검색어"
                    outlined
                    dense
                ></v-text-field>
                <i class="fas fa-search"></i>
            </div>
            <div class="data-remove-box">
                <div class="checkbox-box" style="border: solid 2px #0088CC">
                    <v-checkbox style="margin-top:0;"
                                v-model="checkboxAll"
                                color="#0088CC"
                                label=""
                    ></v-checkbox>
                </div>
                <v-btn
                    @click="showEditBox()"
                    class="remove-button"
                    type="button"
                    depressed
                    style="color:#FFF;background:#0088CC;font-size:10pt"
                >
                    정보변경
                </v-btn>

            </div>
        </div>
        <div>
            <div class="data-info-box">
                <div class="total">전체 : {{itemTotal}} </div>
                <div class="select-box">
                    <span>페이지당 목록수 </span>
                    <v-select
                        v-model="itemLimit"
                        :items="itemLimitList"
                        label=""
                        style="font-size:10pt;width:70px;"
                        dense
                    ></v-select>

                </div>
            </div>
            <table class="list-table">
                <thead>
                <tr>
                    <th style="width:50px">

                    </th>
                    <th  style="width:50px">
                        번호
                    </th>
                    <th>
                        회원분류
                    </th>
                    <th class="sortBy" @click="sortByData('name')">
                        이름(아이디)
                        <span :class="((sorts.name=='desc')?'active':'')"><i
                            class="fas fa-long-arrow-alt-up"></i></span>
                        <span :class="((sorts.name=='asc')?'active':'')"><i
                            class="fas fa-long-arrow-alt-down"></i></span>
                        <br>닉네임
                    </th>
                    <th>
                        마일리지
                    </th>

                    <th>
                        이메일
                    </th>
                    <th>
                        연락처
                    </th>
                    <th>
                        생년월일
                    </th>
                    <th>
                        계좌정보
                    </th>

                    <th class="sortBy" @click="sortByData('rdate')">
                        등록일
                        <span :class="((sorts.rdate=='desc')?'active':'')"><i
                            class="fas fa-long-arrow-alt-up"></i></span>
                        <span :class="((sorts.rdate=='asc')?'active':'')"><i
                            class="fas fa-long-arrow-alt-down"></i></span>
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="item in dataList"
                    :key="item.no"
                >
                    <td style="text-align:center;">
                        <v-checkbox style="margin:-3px auto 0 auto;width:20px;height:20px;padding:0;"
                                    v-model="nos[item.no]"
                        ></v-checkbox>
                    </td>
                    <td>{{ item.num }}</td>
                    <td><div :class="item.mtype">{{ item.mtypeName }}</div></td>
                    <td>{{ item.name }}({{ item.uid }})<br>{{item.unick}}</td>
                    <td>{{ item.point }}</td>
                    <td>{{ item.email }}</td>
                    <td>{{ item.pcs }}</td>
                    <td>{{ item.birth }}</td>
                    <td>{{ item.bankName }}<br>{{ item.bankAccount }} {{ item.bankOwner }}</td>
                    <td>{{ item.rdate }}</td>
                </tr>
                </tbody>
            </table>

            <div v-if="!progress && dataList.length<1" class="empty-data">
                데이타가 존재하지 않습니다
            </div>
            <div v-if="progress" class="empty-data">
                <v-progress-circular
                    :size="50"
                    color="purple"
                    indeterminate
                ></v-progress-circular>
            </div>

            <div class="text-center pt-2">
                <paganation v-if="dataList.length>0"
                            :page="page"
                            :pageCount="pageCount"
                            :total="itemTotal"
                            :limit="itemLimit"
                            :pageInit="pageInit"
                            @getDataListByPaging="getData"
                ></paganation>
            </div>
        </div>
        <div style="height:40px"></div>
        <v-dialog
            v-model="modalShow"
            width="200"
            style="z-index:100"
        >
            <div v-if="editShow">
            <ul class="pop-box">
                <li v-if="editButtonShow" class="point-box">

                    <v-text-field
                        v-model="point"
                        label="포인트"
                        outlined
                        dense
                    ></v-text-field>
                </li>
                <li  v-if="!editButtonShow" @click="setPoint()">포인트 충전</li>
                <li  v-if="!editButtonShow"  @click="deleteMember()">삭제 하기</li>
            </ul>
            <ul class="button-box" v-if="editButtonShow">
                <li><v-btn class="cncle" @click="modalShow=false">취소</v-btn> </li>
                <li><v-btn class="sumt" @click="submitPoint()">확인</v-btn> </li>
            </ul>
            </div>
        </v-dialog>
    </div>
</template>


<script>
	import paganation from '../../../components/paganation'
	import {
		API_URL_MEMBER_ADMIN_GETMEMBERLIST,
		API_URL_MEMBER_ADMIN_DELETE,
		API_URL_MEMBER_ADMIN_POINT_UPDATE,
		CONFIG_HEADER_POST
	} from '../../../api/urls';
	import apiService from '../../../api/apiService';

	import UTIL from '../../../api/util';

	export default {
		name: 'memberList',
		components: {
			paganation
		},
		watch: {
			checkboxAll(val) {
				for(let key in this.nos) {
					if(val) {
						this.nos[key] = true;
					} else {
						this.nos[key] = false;
                    }
				}
            },
			stdate(val) {
				this.search()
			},
			endate(val) {
				this.search()
			},
			cmd() {
				this.keyword = '';
				this.search()
			},
			keyword() {

				this.search()
			},
            itemLimit() {
				this.getData(1);
            },
            mtype() {
	            this.search()
            },
            modalShow(val) {
				if(!val) {
					this.editShow = false;
					this.editButtonShow = false;
                }
            }


		},
		data() {
			return {
				page: 1,
                nos:{},
				pageCount: 5,
				keyword: '',
				cmd: 'name',
				checkboxAll: false,
				itemLimit: 15,
				pageInit: false,
				progress:true,
				itemLimitList: [
					5,10,15,20,50,100
                ],
				sorts: {
					no:'',
					uid:'',
					name: '',
                    rdate:'',
				},
				modalShow:false,
				editShow:false,
				editButtonShow:false,
                mtype:'',
				mtypeItems: [
					{value: '', text: '회원분류 선택'},
					{value: 'indi', text: '일반회원'},
					{value: 'shop', text: '인플루언서'},
                ],
				itemTotal: 1,
				dataList: [],
				orgDataList: [],
				stdate: '',//new Date().toISOString().substr(0, 10),
				stDatePicker: false,
				endate: '',//new Date().toISOString().substr(0, 10),
				enDatePicker: false,
				searchItems: [
					{value: 'name', text: '이름'},
					{value: 'uid', text: '아이디'}
				],
				serverDataList:[],
                point:'',
				selectedNos:[],
			}
		},
		created() {
			this.getServerData();
		},
		methods: {
			deleteMember() {
				let params = {
					type: 'confirm',
					message: '선택된 회원을 삭제하시겠습니까?',
					doAction: () => {
						const frm = new FormData()
						frm.append('nos', JSON.stringify(this.selectedNos));
						this.$eventBus.$emit('overlay', 'open');
						apiService.post(API_URL_MEMBER_ADMIN_DELETE, frm, (res) => {
							this.$eventBus.$emit('overlay', 'hide');
                            this.getDataInit();
							let params = {
								message: '회원이 삭제되었습니다',
							};
							this.$eventBus.$emit('modalOpen', params);
						});
					}
				};
				this.$eventBus.$emit('modalOpen', params);
            },
            getDataInit() {
	            this.checkboxAll = false;
	            this.stdate = '';
	            this.endate = '';
	            this.cmd = 'name';
	            this.keyword = '';
	            this.itemLimit = 15;
	            this.mtype = '';
	            this.modalShow = false;
	            this.dataList = [];
	            this.orgDataList = [];
	            this.serverDataList = [];
	            this.getServerData();

            },
			showEditBox() {
				this.selectedNos = []
				for (let key in this.nos) {
					if (this.nos[key]) {
						this.selectedNos.push(key);
					}
				}
				if (this.selectedNos.length < 1) {
					let params = {
						message: '아이템을 선택하세요',
					};
					this.$eventBus.$emit('modalOpen', params);
					return;
				}
				this.modalShow = true;
				this.editShow = true;
            },
			setPoint() {
			    this.editButtonShow = true;
            },
			submitPoint() {
				if(!this.point) {
					let params = {
						message: '포인트를 입력하세요',
					};
					this.$eventBus.$emit('modalOpen', params);
                }
                if(isNaN(this.point)) {
	                let params = {
		                message: '포인트는 반드시 숫자로 입력하세요',
	                };
	                this.$eventBus.$emit('modalOpen', params);
                }
				const frm = new FormData()
				frm.append('nos', JSON.stringify(this.selectedNos));
				frm.append('point',this.point);
				this.$eventBus.$emit('overlay', 'open');
				apiService.post(API_URL_MEMBER_ADMIN_POINT_UPDATE, frm, (res) => {
					this.$eventBus.$emit('overlay', 'hide');
					this.getDataInit();
					let params = {
						message: '포인트가 충전되었습니다',
					};
					this.$eventBus.$emit('modalOpen', params);
				});
            },
			goPage(url) {
				this.$router.push(url);
			},
			sortByData(field) {

				if (this.sorts[field] == 'asc') {
					this.sorts[field] = 'desc'
				} else this.sorts[field] = 'asc'
                for(let key in this.sorts) {
					if(key !=field) {
						this.sorts[key] = '';
                    }
                }
				this.orgDataList = _.orderBy(this.orgDataList, field, this.sorts[field]);
				this.pageInit = true;
				this.getData(1);
			},
			getServerData() {


				const frm = new FormData()
             	this.$http.post(API_URL_MEMBER_ADMIN_GETMEMBERLIST, frm, {headers: CONFIG_HEADER_POST}).then(res => {
					console.log(res)
                    this.progress = false;
                    if(res.data.list.length>0) {
	                    this.serverDataList = res.data.list;
	                    for (let item of this.serverDataList) {
	                    	item.mtypeName = (item.mtype=='shop')?'인플루언서':'일반회원';
	                    	item.point = (item.point)?UTIL.numberFormat(item.point):0;
		                    this.orgDataList.push(item);
	                    }
	                    this.getData(1);
                    }
				});

			},
			getData(page) {
				let start = (page - 1) * this.itemLimit;
				let end = start + this.itemLimit;
				this.itemTotal = this.orgDataList.length;

				let orgDataList = this.orgDataList.slice(start, end);
				this.dataList = [];
				let startNum = '';
				if(this.itemTotal >= this.itemLimit) {
					startNum = (this.itemTotal - ((page - 1) * this.itemLimit));
				} else startNum = this.itemTotal

              	let k = 0;
				this.nos = {};
				for (let item of orgDataList) {
					this.nos[item.no] = false;
					item.num = startNum - k;
					this.dataList.push(item);
					k++;

				}

			},
			search() {
				this.orgDataList = [];
				this.serverDataList.filter(data => {
					let result = true;
					let keywordResult = false;
					if (this.keyword) {
						switch (this.cmd) {
							case 'name':
								keywordResult = data.name.includes(this.keyword)
								break;
							case 'uid':
								keywordResult = data.uid.includes(this.keyword)
								break;
						}
					}
					if (this.keyword) {
						if (keywordResult) result = true;
						else result = false;
					} else result = true;
                    if(this.mtype) {
                    	if(data.mtype==this.mtype) {
		                    if(result)result = true;
                        } else result = false;
                    }
					if(this.stdate) {
                        if(!data.rdate) {
                        	result = false;
                        } else {
	                        let stDataVal = this.stdate.split('-');
	                        let stDate = new Date(stDataVal[0], parseInt(stDataVal[1]) - 1, stDataVal[2]);

	                        let rDataVal = data.rdate.split('-');
	                        let rDate = new Date(rDataVal[0], parseInt(rDataVal[1]) - 1, rDataVal[2]);

	                        if(rDate >= stDate) {
		                        if(result)result = true;
                            } else result = false;
                        }
                    }
					if(this.endate) {
						if(!data.rdate) {
							result = false;
						} else {
							let enDataVal = this.endate.split('-');
							let enDate = new Date(enDataVal[0], parseInt(enDataVal[1]) - 1, enDataVal[2]);

							let rDataVal = data.rdate.split('-');
							let rDate = new Date(rDataVal[0], parseInt(rDataVal[1]) - 1, rDataVal[2]);

							if(rDate <= enDate) {
								if(result)result = true;
							} else result = false;
						}
					}
					if (result) {
						this.orgDataList.push(data);
					}
				})
				this.orgDataList = _.orderBy(this.orgDataList, 'no', 'desc');
				for(let key in this.sorts) {
					this.sorts[key] = '';
				}
				this.getData(1);
			}

		},
		updated() {
			this.pageInit = false;
		}

	}
</script>

<style lang="scss" scoped="true">
   .shop {
       color:blueviolet;
   }
    .upd-info-button {
        background:darkslateblue;
    }
    .pop-box {
        background:#fff;
        padding:20px;
        li {
            text-align:center;
            margin:10px 0 20px 0;
            font-weight:bold;
            font-size:12pt;
            cursor:pointer;
            &.point-box {
                margin:20px 0;

            }
        }
    }
    .button-box {
        padding:0;
        display:flex;
        li {
            width:50%;
            .cncle {
                width:100%;
                border-radius:0;
                background:#999;
                color:#fff;
                height:50px;
            }
            .sumt {
                width:100%;
                border-radius:0;
                background:#0088CC;
                color:#fff;
                height:50px;
            }
        }
    }
</style>