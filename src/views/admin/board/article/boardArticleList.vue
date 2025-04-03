<template>
    <div>

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
        <div class="regist-button">
            <v-btn
                class="reg-button"
                type="button"
                color="primary"
                @click="goPage('/admin/boardArticle/'+bid+'/regist/new')"
            >
                게시글 작성
            </v-btn>
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

                    </th>
                    <th style="width:80px">
                        번호
                    </th>
                    <th class="sortBy" @click="sortByData('subject')">
                        제목
                        <span :class="((sorts.subject=='desc')?'active':'')"><i
                            class="fas fa-long-arrow-alt-up"></i></span>
                        <span :class="((sorts.subject=='asc')?'active':'')"><i
                            class="fas fa-long-arrow-alt-down"></i></span>
                    </th>
                    <th style="width:150px" class="sortBy" @click="sortByData('name')">
                        작성자
                        <span :class="((sorts.name=='desc')?'active':'')"><i
                            class="fas fa-long-arrow-alt-up"></i></span>
                        <span :class="((sorts.name=='asc')?'active':'')"><i
                            class="fas fa-long-arrow-alt-down"></i></span>
                    </th>
                    <th style="width:100px" class="sortBy" @click="sortByData('hit')">
                        조회수
                        <span :class="((sorts.hit=='desc')?'active':'')"><i
                            class="fas fa-long-arrow-alt-up"></i></span>
                        <span :class="((sorts.hit=='asc')?'active':'')"><i
                            class="fas fa-long-arrow-alt-down"></i></span>
                    </th>
                    <th style="width:150px" class="sortBy" @click="sortByData('rdate')">
                        등록일
                        <span :class="((sorts.rdate=='desc')?'active':'')"><i
                            class="fas fa-long-arrow-alt-up"></i></span>
                        <span :class="((sorts.rdate=='asc')?'active':'')"><i
                            class="fas fa-long-arrow-alt-down"></i></span>
                    </th>
                    <th style="width:100px">
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
                    <td style="text-align:left;padding-left:10px;"><span @click="articleView(item.no)" class="subject">{{ item.subject }}</span>
                    </td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.hitView }}</td>
                    <td>{{ item.rdate }}</td>
                    <td>
                        <v-btn v-if="bid!='userqna'"
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
            <div class="regist-button-bottom">
                <v-btn
                    class="reg-button"
                    type="button"
                    color="primary"
                    @click="goPage('/admin/boardArticle/'+bid+'/regist/new')"
                >
                    게시글 작성
                </v-btn>
            </div>
        </div>
        <div style="height:40px"></div>
    </div>
</template>


<script>
	import paganation from '../../../../components/paganation'
	import {
		API_URL_BOARD_ADMIN_GETARTICLELIST,
		CONFIG_HEADER_POST
	} from '../../../../api/urls';

	export default {
		name: 'boardArticleList',
		components: {
			paganation
		},
		watch: {
			checkboxAll(val) {
				for (let key in this.nos) {
					if (val) {
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
				bid: '',
				page: 1,
				nos: {},
				pageCount: 5,
				keyword: '',
				cmd: 'subject',
				checkboxAll: false,
				itemLimit: 15,
				pageInit: false,
				progress: true,
				itemLimitList: [
					5, 10, 15, 20, 50, 100
				],
				sorts: {
					no: '',
					subject: '',
					hit: '',
					name: '',
					rdate: '',
				},

				itemTotal: 1,
				dataList: [],
				orgDataList: [],
				stdate: '',//new Date().toISOString().substr(0, 10),
				stDatePicker: false,
				endate: '',//new Date().toISOString().substr(0, 10),
				enDatePicker: false,
				searchItems: [
					{value: 'subject', text: '제목'},
					{value: 'name', text: '작성자'}
				],
				serverDataList: [],
			}
		},
		destroyed() {
			this.$eventBus.$off('articleListChange');

		},
		created() {
			this.$eventBus.$on('articleListChange', this.changeArticle);
			this.bid = this.$route.params.bid;
			this.getServerData();
		},
		methods: {
			changeArticle(url) {
				this.dataList = [];
				this.orgDataList = [];
				this.serverDataList = [];

				let urls = url.split('/');
				this.bid = urls[3];
				this.getServerData();
			},
			goPage(url) {
				this.$router.push(url);
			},
			articleView(no) {
				this.$router.push('/admin/boardArticle/' + this.bid + '/view/' + no);
			},
			modify(no) {
				this.$router.push('/admin/boardArticle/'+this.bid+'/regist/' + no);
			},
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
			getServerData() {

				this.progress = true;
				const frm = new FormData()
				frm.append('bid', this.bid)
				this.$http.post(API_URL_BOARD_ADMIN_GETARTICLELIST, frm, {headers: CONFIG_HEADER_POST}).then(res => {
					//	console.log(res)
					this.progress = false;
					if (res.data.list.length > 0) {
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
					let result = false;
					let keywordResult = false;
					if (this.keyword) {
						switch (this.cmd) {
							case 'name':
								if (!data.name) return;
								keywordResult = data.name.includes(this.keyword)
								break;
							case 'subject':
								keywordResult = data.subject.includes(this.keyword)
								break;
						}
					}
					if (this.keyword) {
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
								result = true;
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
								result = true;
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
			}

		},
		updated() {
			this.pageInit = false;
		}

	}
</script>

<style lang="scss" scoped="true">
    .subject {
        text-decoration: underline;
        cursor: pointer;
    }

</style>