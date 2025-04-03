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
                            label="결제일(시작)"
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
                            label="결제일(종료)"
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
            <div class="select-box">
                <v-select
                    v-model="settle"
                    :items="settleTypes"
                    label="정산여부"
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
            <div class="text-box" style="width:200px;">
                <v-text-field
                    v-model="keyword"
                    label="검색어"
                    outlined
                    dense
                ></v-text-field>
                <i class="fas fa-search"></i>
            </div>

        </div>
        <div>
            <div class="data-info-box">
                <div class="total">전체 : {{itemTotal}}</div>
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
                    <th style="width:80px">
                        번호
                    </th>
                    <th>
                        정산요청
                    </th>
                   <th>
                       신청자(아이디)
                    </th>
                    <th>
                       유튜버(아이디)
                    </th>
                    <th>
                        결제금액
                    </th>
                    <th>
                        진행사항
                    </th>
                    <th>
                        세부내역보기
                    </th>
                    <th>
                        결제방법
                    </th>
                    <th>
                        결제여부
                    </th>

                    <th>
                        정산여부
                    </th>

                    <th class="sortBy" @click="sortByData('rdate')">
                        결제일
                        <span :class="((sorts.rdate=='desc')?'active':'')"><i
                            class="fas fa-long-arrow-alt-up"></i></span>
                        <span :class="((sorts.rdate=='asc')?'active':'')"><i
                            class="fas fa-long-arrow-alt-down"></i></span>
                    </th>
                    <th>
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="item in dataList"
                    :key="item.no"
                >
                    <td>{{ item.num }}</td>
                    <td style="width:70px;text-align:center;">
                        <div v-if="item.settleReq=='yes' && item.settle=='no'">
                            <i class="fas fa-check"></i>
                        </div>
                    </td>
                    <td>{{ item.name }} ({{item.uid}})</td>
                    <td>{{ item.targetName }} ({{item.targetUid}})</td>
                    <td>{{item.price}}</td>
                    <td>
                        <div :class="item.status">{{ item.statsName }}</div>
                    </td>
                    <td>
                        <div class="underline" @click="showDetail(item)">보기</div>
                    </td>
                    <td>{{ item.payMethod }}</td>
                    <td>{{ item.payResult }}</td>
                    <td>

                        <div v-if="item.settle=='no' && item.paymentResult == 'yes'">
                            <v-btn class="active-button" style="background: #686EFB;" depressed @click="activeSettle(item.no)">정산하기</v-btn>
                        </div>
                        <div v-else-if="item.paymentResult == 'yes'">
                            정산완료
                        </div>
                    </td>
                    <td>{{ item.rdate.substring(0,10) }}</td>

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
            width="450"
            style="z-index:100;"
        >
            <div class="detail-container">
                <div class="header-box">
                    <div class="stitle"> <span>세부내역</span></div>
                </div>
                <div class="form-box">
                    <ul class="form-basic" style="margin-top:20px;">
                        <li>
                            <div class="gtitle">광고유형 / 광고상품</div>
                            <div class="gtext">{{bannerType}} / {{bannerCode}}</div>
                        </li>
                        <li>
                            <div class="gtitle">링크 URL</div>
                            <div class="gtext">{{detailView.glink}}</div>
                        </li>
                        <li>
                            <div class="gtitle">광고 노출일</div>
                            <div class="gtext">{{detailView.stdate}} ~ {{detailView.endate}}</div>
                        </li>
                        <li>
                            <div class="gtitle">신청자 성명</div>
                            <div class="gtext">{{detailView.name}}</div>
                        </li>
                        <li>
                            <div class="gtitle">이메일</div>
                            <div class="gtext">{{detailView.email}}</div>
                        </li>
                        <li>
                            <div class="gtitle">요청사항</div>
                            <div class="gtext">{{detailView.content}}</div>
                        </li>
                    </ul>
                </div>

            </div>
        </v-dialog>
    </div>
</template>


<script>
	import {BANNER} from '../../../config/banner'
	import paganation from '../../../components/paganation'
	import {
		HOST,
		API_URL_BANNER_ADMIN_PAYMENT_LIST,
		API_URL_BANNER_ADMIN_UPDATE_SETTLE
	} from '../../../api/urls';
	import apiService from '../../../api/apiService'

	export default {
		name: 'bannerPaymentList',
		components: {
			paganation
		},
		watch: {
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
			settle() {
				this.search()
			},
			itemLimit() {
				this.getData(1);
			}


		},
		data() {
			return {
				page: 1,
				host: HOST,
				nos: {},
				pageCount: 5,
				keyword: '',
				cmd: 'name',
				itemLimit: 15,
				pageInit: false,
				progress: true,
				itemLimitList: [
					5, 10, 15, 20, 50, 100
				],
				sorts: {
					rdate: '',
				},
				insertFlag:false,
				itemTotal: 1,
				dataList: [],
				orgDataList: [],
				stdate: '',//new Date().toISOString().substr(0, 10),
				stDatePicker: false,
				endate: '',//new Date().toISOString().substr(0, 10),
				enDatePicker: false,
				serverDataList: [],
				searchItems: [
					{value: 'name', text: '신청자 이름'},
					{value: 'uid', text: '신청자 아이디'},
					{value: 'targetName', text: '유튜버 이름'},
					{value: 'targetUid', text: '유튜버 아이디'}
				],
                settle:'',
				settleTypes:[
					{value: '', text: '정산여부 선택'},
					{value: 'yes', text: '정산완료'},
					{value: 'no', text: '미정산'}
                ],
				modalShow: false,
				bannerType:'',
                bannerCode:'',
                detailView:{},

			}
		},
		created() {
			this.getServerData('init');
		},
		methods: {

			sortByData(field) {

				if (this.sorts[field] == 'asc') {
					this.sorts[field] = 'desc'
				} else this.sorts[field] = 'asc'
				for (let key in this.sorts) {
					if (key != field) {
						this.sorts[key] = '';
					}
				}
				this.orgDataList = _.orderBy(this.orgDataList, field, this.sorts[field]);
				this.pageInit = true;
				this.getData(1);
			},
			getServerData(cmd) {
				const frm = new FormData()
				apiService.post(API_URL_BANNER_ADMIN_PAYMENT_LIST, frm, (res) => {
					this.progress = false;
					if (res.list.length > 0) {
						this.serverDataList = res.list;
						for (let item of this.serverDataList) {
							if (item.paymentResult == 'yes') {
								switch (item.status) {
									case 'ready':
										item.statsName = '대기중';
										break;
									case 'ing':
										item.statsName = '진행중';
										break;
									case 'end':
										item.statsName = '종료';
										break;
									case 'stop':
										item.statsName = '중지';
										break;
								}
								item.payResult = '완료'
							} else {
								item.statsName = '-';
								item.payResult = '미결제';
							}
                            switch(item.paymentMethod) {
                                case 'card':
                                	item.payMethod = '신용카드';
                                	break;
                                default:
	                                item.payMethod = '계좌이체';
	                                break;
                            }
							this.orgDataList.push(item);
						}
						if(cmd=='init') {
							this.getData(1);
						} else {
							this.search();
                        }
					}
				});

			},
			serverData() {
				this.getServerData('reload');
            },
			getData(page) {
				let start = (page - 1) * this.itemLimit;
				let end = start + this.itemLimit;
				this.itemTotal = this.orgDataList.length;

				let orgDataList = this.orgDataList.slice(start, end);
				this.dataList = [];
				let startNum = '';
				if (this.itemTotal >= this.itemLimit) {
					startNum = (this.itemTotal - ((page - 1) * this.itemLimit)) + 1;
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
							case 'targetName':
								keywordResult = data.targetName.includes(this.keyword)
								break;
							case 'targetUid':
								keywordResult = data.targetUid.includes(this.keyword)
								break;
						}
						if (keywordResult) result = true;
						else result = false;
					} else result = true;
                    if(this.settle) {
                    	if(data.settle==this.settle) {
		                    if (result) result = true;
	                    } else result = false;
                    }
					if (this.stdate) {
						if (!data.rdate) {
							result = false;
						} else {
							let stDataVal = this.stdate.split('-');
							let stDate = new Date(stDataVal[0], parseInt(stDataVal[1]) - 1, stDataVal[2]);

							let rDataVal = data.rdate.split('-');
							let rDate = new Date(rDataVal[0], parseInt(rDataVal[1]) - 1, rDataVal[2]);

							if (rDate >= stDate) {
                                if(result)result = true;
							} else result = false;
						}
					}
					if (this.endate) {
						if (!data.rdate) {
							result = false;
						} else {
							let enDataVal = this.endate.split('-');
							let enDate = new Date(enDataVal[0], parseInt(enDataVal[1]) - 1, enDataVal[2]);

							let rDataVal = data.rdate.split('-');
							let rDate = new Date(rDataVal[0], parseInt(rDataVal[1]) - 1, rDataVal[2]);

							if (rDate <= enDate) {
								if(result)result = true;
							} else result = false;
						}
					}

					if (result) {
						this.orgDataList.push(data);
					}
				})
				this.orgDataList = _.orderBy(this.orgDataList, 'no', 'desc');
				for (let key in this.sorts) {
					this.sorts[key] = '';
				}
				this.getData(1);
			},
			showDetail(item) {
				for(let banner of BANNER) {
					if(banner.code==item.bannerType) {
						this.bannerType = banner.name;
						for(let sub of banner.codeList) {
							if(sub.code==item.bannerCode)this.bannerCode = sub.name;
						}
					}
				}
				this.modalShow = true;
				this.detailView = item;
			},
			activeSettle(no) {
				let params = {
					type: 'confirm',
					message: '선택된 결제를 정산 하시겠습니까?',
					doAction: () => {
						this.$eventBus.$emit('overlay', 'show');
						const frm = new FormData()
						frm.append('no',no)
						apiService.post(API_URL_BANNER_ADMIN_UPDATE_SETTLE,frm,(res)=> {
							this.$eventBus.$emit('overlay', 'hide');
							this.getServerData('reload')
						});
					}
				};
				this.$eventBus.$emit('modalOpen', params);

			}

		},
		updated() {
			this.pageInit = false;
		}

	}
</script>

<style lang="scss" scoped="true">
    .link {
        text-decoration: underline;
        cursor: pointer;
        color: #000;
    }

    .img {
        width: 120px;
        img {
            max-width: 100px;
        }
    }
    .fa-check {
        color:#ff253a;
    }
    .underline {
        color: #686EFB;
        text-decoration: underline;
        cursor: pointer;
    }
    .select-box {
        min-width: 190px;
    }
    .detail-container {
        width: 100%;
        background: #fff;
        padding:30px 30px 60px 30px;
        .header-box {
            .stitle {
                font-size: 17pt;
                font-weight: bold;
                padding: 0 0 10px 0;
                color: #686EFB;
                border-bottom:solid 1px #dcdcdc;
                span {
                    padding-bottom:13px;
                    border-bottom:solid 2px #686EFB;
                }
            }

        }
        ul {
            padding: 0;
            li {
                margin-bottom:20px;
                .gtitle {
                    font-size:10pt;
                    color:#999;
                }
                .gtext {
                    font-size:11pt;
                    color:#000;
                    font-weight:bold;
                }
            }
        }
    }
    .active-button {
        background: #686EFB;
        border-radius:0;
        color:#fff;
    }
</style>