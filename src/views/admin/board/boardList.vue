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
                <div class="checkbox-box">
                    <v-checkbox style="margin-top:0;"
                                v-model="checkboxAll"
                                color="red"
                                label=""
                    ></v-checkbox>
                </div>
                <v-btn
                    class="remove-button"
                    type="button"
                    depressed
                    color="red"
                    style="color:#FFF"
                >
                    삭제
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
                    <th style="width:80px">

                    </th>
                    <th  style="width:80px">
                        번호
                    </th>
                    <th class="sortBy" @click="sortByData('uid')">
                        게시판 아이디
                        <span :class="((sorts.uid=='desc')?'active':'')"><i
                            class="fas fa-long-arrow-alt-up"></i></span>
                        <span :class="((sorts.uid=='asc')?'active':'')"><i
                            class="fas fa-long-arrow-alt-down"></i></span>
                    </th>
                    <th class="sortBy" @click="sortByData('name')">
                        게시판 이름
                        <span :class="((sorts.name=='desc')?'active':'')"><i
                            class="fas fa-long-arrow-alt-up"></i></span>
                        <span :class="((sorts.name=='asc')?'active':'')"><i
                            class="fas fa-long-arrow-alt-down"></i></span>
                    </th>
                    <th class="sortBy" @click="sortByData('btype')">
                        게시판 타입
                        <span :class="((sorts.btype=='desc')?'active':'')"><i
                            class="fas fa-long-arrow-alt-up"></i></span>
                        <span :class="((sorts.btype=='asc')?'active':'')"><i
                            class="fas fa-long-arrow-alt-down"></i></span>
                    </th>
                    <th class="sortBy" @click="sortByData('rdate')">
                        등록일
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
                    <td style="text-align:center;">
                        <v-checkbox style="margin:-3px auto 0 auto;width:20px;height:20px;padding:0;"
                                    v-model="nos[item.no]"
                        ></v-checkbox>
                    </td>
                    <td>{{ item.num }}</td>
                    <td><a class="link" target="_blank" :href="'/board/list/'+item.bid">{{ item.bid }}</a></td>
                    <td><a class="link" target="_blank" :href="'/board/list/'+item.bid">{{ item.name }}</a></td>
                    <td>{{ bTypeList[item.btype] }}</td>
                    <td>{{ item.rdate }}</td>
                    <td>
                        <v-btn
                            type="button"
                            depressed
                            color="primary"
                            outlined
                            class="modify-button"
                            @click="modify(item.no)"
                        >
                            수정
                        </v-btn>
                    </td>
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
		API_URL_BOARD_ADMIN_GETBOARDLIST,
		CONFIG_HEADER_POST
	} from '../../../api/urls';
	export default {
		name: 'boardList',
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
            }


		},
		data() {
			return {
				page: 1,
				bTypeList: {
					list: '리스트형',
					gallery: '갤러리형',
					blog: '블로그형',
					layer: '레이어형',
				    onetoone: '1:1문의형'
			    },
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
					bid:'',
					btype:'',
					name: '',
                    rdate:'',
				},
				itemTotal: 1,
				dataList: [],
				orgDataList: [],
				stdate: '',//new Date().toISOString().substr(0, 10),
				stDatePicker: false,
				endate: '',//new Date().toISOString().substr(0, 10),
				enDatePicker: false,
				searchItems: [
					{value: 'name', text: '게시판 이름'},
					{value: 'bid', text: '게시판 아이디'}
				],
				serverDataList:[],
			}
		},
		created() {
			this.getServerData();
		},
		methods: {
			goPage(url) {
				this.$router.push(url);
			},
			modify(no) {
		        this.$router.push('/admin/boardRegist/'+no);
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
             	this.$http.post(API_URL_BOARD_ADMIN_GETBOARDLIST, frm, {headers: CONFIG_HEADER_POST}).then(res => {
				//	console.log(res)
                    this.progress = false;
                    if(res.data.list.length>0) {
	                    this.serverDataList = res.data.list;
	                    for (let item of this.serverDataList) {
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
						}
					}
					if (this.keyword) {
						if (keywordResult) result = true;
						else result = false;
					} else result = true;

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
    .link {
        text-decoration: underline;
        cursor:pointer;
        color:#000;
    }
</style>