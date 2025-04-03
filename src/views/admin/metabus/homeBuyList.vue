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
                    v-model="category"
                    :items="categoryTypes"
                    label="카테고리 분류"
                    outlined
                    dense
                ></v-select>
            </div>
            <div class="select-box" style="margin-left:0;">
                <v-select
                    v-model="gcode"
                    :items="mapList"
                    label="월드(맵) 분류"
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
                        신청자(아이디)
                    </th>
                    <th>
                        카테고리
                    </th>
                    <th>
                        맵(월드)
                    </th>
                    <th>
                        아이템명(코드)
                    </th>
                    <th>
                        명패정보
                    </th>

                    <th>
                        결제마일리지
                    </th>
                    <th class="sortBy" @click="sortByData('rdate')">
                        결제일
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
                    <td>{{ item.num }}</td>
                    <td>{{ item.userName }} ({{item.uid}})</td>
                    <td>{{ item.pcateName}}</td>
                    <td>{{ item.mapName}}</td>
                    <td>{{ item.name}} ({{ item.gcode}})</td>
                    <td>{{ item.nameplate}}</td>
                    <td>{{item.price}} M</td>
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
    </div>
</template>


<script>
	import paganation from '../../../components/paganation'
	import {
		HOST,
		API_URL_METABUS_WORLD_HOME_ADMIN_BUY_LIST,

	} from '../../../api/urls';
	import apiService from '../../../api/apiService'

	export default {
		name: 'metabusWorldHomeBuyList',
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
			itemLimit() {
				this.getData(1);
			},
			category(val) {
				if(val) {
					this.gcode = '';
					this.mapList = [];
					if(this.orgMapList[val]) {
						this.mapList.push({text: '월드(맵) 선택', value: ''});
						for(let map of this.orgMapList[val]) {
							this.mapList.push({text:map.name,value:map.code})
						}
					}

				} else {
					this.gcode = '';
					this.mapList = [];
				}
				this.search()
			},
			gcode(val) {
				this.search()
			},


		},
		data() {
			return {
				categoryTypes: [],
				category: '',
				gcode:'',
				mapList:[],
				orgMapList:{},
				page: 1,
				host: HOST,
				nos: {},
				pageCount: 5,
				keyword: '',
				cmd: 'userName',
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
					{value: 'userName', text: '신청자 이름'},
					{value: 'uid', text: '신청자 아이디'},
					{value: 'name', text: '아이템 명'},
					{value: 'gcode', text: '아이템 코드'},
				],

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
				apiService.post(API_URL_METABUS_WORLD_HOME_ADMIN_BUY_LIST, frm, (res) => {
					this.progress = false;
					let cateNames = {};
					this.categoryTypes = [{text: '카테고리 선택', value: ''}];
					if(res.categoryInfo) {
						for(let cate of res.categoryInfo.categorys) {
							if(cate.code == 'world') {

								for(let item of cate.subMenus) {
									let cateItem = {text:item.name, value:item.code};
									this.categoryTypes.push(cateItem)
									cateNames[item.code] = item.name;
								}
								break;
							}
						}
					}
					let mapNames = {};
					for(let key in res.mapList ) {
						for (let map of res.mapList[key]) {
							mapNames[map.code] = map.name;
						}
					}
					this.orgMapList = res.mapList;
					if (res.list.length > 0) {
						this.serverDataList = res.list;
						for (let item of this.serverDataList) {
							/*
							if(this.categorys[item.category1]) {
								let cateData = this.categorys[item.category1];
								item.category = cateData.name + ' | ' + cateData.subMenus[item.category2];
							}
							*/
							let categorys = item.category.split('_');
							item.pcate = categorys[1];
                            item.pcateName = cateNames[item.pcate];
							item.mapName = mapNames[item.category];
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
					if (this.keyword && this.cmd) {
						switch (this.cmd) {
							case 'name':
								if(data.name) {
									keywordResult = data.name.includes(this.keyword)
								}
								break;
							case 'uid':
								keywordResult = data.uid.includes(this.keyword)
								break;
							case 'userName':
								keywordResult = data.userName.includes(this.keyword)
								break;
							case 'gcode':
								keywordResult = data.gcode.includes(this.keyword)
								break;

						}
						if (keywordResult) result = true;
						else result = false;
					} else result = true;
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
					if (this.category) {
						if (data.pcate == this.category) {
							if(result)result = true;
						} else {
							result = false;
						}
					}
					if(this.gcode) {
						if(this.gcode==data.category) {
							if (result) result = true;
						} else {
							result = false;
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