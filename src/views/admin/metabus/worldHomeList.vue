<template>
    <div class="page-contents">

        <div class="search-box">
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
            <div class="select-box" style="margin-left:20px;">
                <v-select
                    v-model="uid"
                    :items="uidTypes"
                    label="판매상태"
                    outlined
                    dense
                ></v-select>

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
                        이미지
                    </th>
                    <th>
                        월드(맵)
                    </th>
                    <th>
                        아이템명
                    </th>
                    <th>
                        아이템코드
                    </th>
                    <th>
                        판매상태
                    </th>
                    <th>
                        가격
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="item in dataList"
                    :key="item.no"
                >
                    <td>{{ item.num }}</td>
                    <td class="img"><img :src="host+item.img"></td>
                    <td>{{ item.categoryName }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{item.gcode}}</td>
                    <td>{{item.gsale}}</td>
                    <td>{{item.price}}</td>

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
		API_URL_METABUS_WORLD_HOME_ADMIN_LIST
	} from '../../../api/urls';
	import apiService from '../../../api/apiService'

	export default {
		name: 'metabusWorldHomeList',
		components: {
			paganation
		},
		watch: {
			uid(val) {
				this.search()
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
			itemLimit() {
				this.getData(1);
			}


		},
		data() {
			return {
				page: 1,
				host: HOST,
				pageCount: 5,
				itemLimit: 15,
				pageInit: false,
				progress: true,
				itemLimitList: [
					5, 10, 15, 20, 50, 100
				],
				itemTotal: 1,
				dataList: [],
				orgDataList: [],
				serverDataList: [],
				uid: '',
				uidTypes: [
					{text: '판매상태', value: ''},
					{text: '판매완료', value: 'yes'},
					{text: '미판매', value: 'no'},
				],
				categoryTypes: [],
				category: '',
                gcode:'',
				mapList:[],
                orgMapList:{},


			}
		},
		created() {
			this.getServerData();
		},
		methods: {

			getServerData() {
				const frm = new FormData()
				apiService.post(API_URL_METABUS_WORLD_HOME_ADMIN_LIST, frm, (res) => {
					this.progress = false;
					this.categoryTypes = [{text: '카테고리 선택', value: ''}];
					if(res.categoryInfo) {
						for(let cate of res.categoryInfo.categorys) {
							if(cate.code == 'world') {

								for(let item of cate.subMenus) {
									let cateItem = {text:item.name, value:item.code};
									this.categoryTypes.push(cateItem)
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
					this.serverDataList = res.goodsList;
					for (let item of this.serverDataList) {
						item.gsale = (item.uid) ? '판매완료' : '미판매';
						item.categoryName = mapNames[item.category];
						this.orgDataList.push(item);
					}
					this.getData(1);

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
					if (this.category) {
						let cates = data.category.split('_');
						if (cates[1] == this.category) {
							result = true;
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
					if (this.uid) {
						if (data.uid && this.uid == 'yes') {
							if (result) result = true;
						} else if (!data.uid && this.uid == 'no') {
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

    .select-box {
        min-width: 190px;
    }

</style>