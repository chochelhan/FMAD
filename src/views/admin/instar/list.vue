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
                        이름
                    </th>
                    <th>
                        링크
                    </th>

                    <th>
                        등록일
                    </th>
                    <th>
                        관리
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
                    <td><img style="width:60px;max-height:60px;" v-if="item.img" :src="HOST+'/upload/images/'+item.img">
                    </td>
                    <td>{{ item.name }}</td>
                    <td>{{item.gcode}}</td>
                    <td>{{ item.rdate }}</td>
                    <td>
                        <span class="upd" @click="updateItem(item.no)">수정</span>
                        <span class="del" @click="deleteItem(item.no)">삭제</span>
                    </td>
                    <td></td>

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
        API_URL_INSTART_ADMIN_LIST,
        API_URL_INSTART_ADMIN_DELETE
    } from '../../../api/urls';
    import apiService from '../../../api/apiService'

    export default {
        name: 'instarList',
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
            itemLimit() {
                this.getData(1);
            }


        },
        data() {
            return {
                HOST:HOST,
                page: 1,
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
                insertFlag: false,
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
                apiService.post(API_URL_INSTART_ADMIN_LIST, frm, (res) => {
                    this.progress = false;
                    if (res.list.length > 0) {
                        this.serverDataList = res.list;
                        for (let item of this.serverDataList) {
                            item.rdate = item.rdate.substring(0, 10);
                            this.orgDataList.push(item);
                        }
                        if (cmd == 'init') {
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
                                if (result) result = true;
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
                                if (result) result = true;
                            } else result = false;
                        }
                    }

                    if (result) {
                        this.orgDataList.push(data);
                    }
                })
                this.getData(1);
            },
            updateItem(no) {
                this.$router.push('/admin/instar/regist/' + no)
            },
            deleteItem(no) {
                let params = {
                    type: 'confirm',
                    message: '선택된 것을 삭제하시겠습니까?',
                    doAction: () => {
                        const frm = new FormData()
                        frm.append('no',no);
                        this.$eventBus.$emit('overlay', 'open');
                        apiService.post(API_URL_INSTART_ADMIN_DELETE, frm, (res) => {
                            this.$eventBus.$emit('overlay', 'hide');
                            this.getServerData('reload');

                            let params = {
                                message: '삭제되었습니다',
                            };
                            this.$eventBus.$emit('modalOpen', params);
                        });
                    }
                };
                this.$eventBus.$emit('modalOpen', params);
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
        color: #ff253a;
    }

    .underline {
        color: #686EFB;
        text-decoration: underline;
        cursor: pointer;
    }

    .select-box {
        min-width: 190px;
    }

    .del, .upd {
        cursor: pointer;
        text-decoration: underline;
    }

    .upd {
        margin-right: 10px;
    }

    .detail-container {
        width: 100%;
        background: #fff;
        padding: 30px 30px 60px 30px;

        .header-box {
            .stitle {
                font-size: 17pt;
                font-weight: bold;
                padding: 0 0 10px 0;
                color: #686EFB;
                border-bottom: solid 1px #dcdcdc;

                span {
                    padding-bottom: 13px;
                    border-bottom: solid 2px #686EFB;
                }
            }

        }

        ul {
            padding: 0;

            li {
                margin-bottom: 20px;

                .gtitle {
                    font-size: 10pt;
                    color: #999;
                }

                .gtext {
                    font-size: 11pt;
                    color: #000;
                    font-weight: bold;
                }
            }
        }
    }

    .active-button {
        background: #686EFB;
        border-radius: 0;
        color: #fff;
    }
</style>
