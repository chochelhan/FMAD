<template>
    <div :class="'data-contents '+mobileClass">

        <div class="search-box">
            <div class="text">선물함</div>
            <div class="left-box">
                <div class="select-box">
                    <selectBox v-if="itemCategorys.length>0"
                               :value="fcate"
                               :items="itemCategorys"
                               @onSelected="fcateChange"
                    >
                    </selectBox>

                </div>

                <div class="select-box">
                    <selectBox v-if="itemSubCategorys.length>0"
                               :value="scate"
                               :items="itemSubCategorys"
                               @onSelected="scateChange"
                    >
                    </selectBox>

                </div>
                <div class="select-box">
                    <selectBox
                        :value="status"
                        :items="statusTypes"
                        @onSelected="statusChange"
                    >
                    </selectBox>

                </div>

            </div>
            <div style="clear:both"></div>
        </div>


        <table class="list-table" v-if="!mobileView">
            <thead>
            <tr>
                <th>
                    선물한 사람
                </th>
                <th>
                    아이템 분류
                </th>
                <th>
                    아이템명

                </th>
                <th style="width:200px">
                    선물 일시
                </th>
                <th style="width:110px">
                    적용 상태
                </th>
                <th style="width:200px">
                    적용 시작
                </th>
                <th style="width:200px">
                    적용 종료
                </th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="item in dataList"
                :key="item.no"
            >
                <td>
                    {{ item.userName }}({{ item.uid }})
                </td>
                <td>
                    {{ item.categoryName }}
                </td>
                <td>
                    {{ item.goodsName }}
                </td>
                <td>
                    {{ item.rdate }}
                </td>
                <td>
                    <div :class="'status '+item.status">{{ item.statusName }}</div>
                </td>
                <td>
                    {{ item.stdate }}
                </td>
                <td>
                    {{ item.endate }}
                </td>
            </tr>
            </tbody>
        </table>
        <ul v-else>
            <li v-for="item in dataList" :key="item.no">
                <div>
                    {{ item.userName }}({{ item.uid }})
                    <div>
                        {{ item.categoryName }}
                    </div>
                    <div>
                        {{ item.goodsName }}
                    </div>
                    <div>
                        {{ item.rdate }}
                    </div>
                </div>
                <div>
                    <div :class="'status '+item.status">{{ item.statusName }}</div>
                    <div>
                        {{ item.stdate }}
                    </div>
                    <div>
                        {{ item.endate }}
                    </div>
                </div>
            </li>
        </ul>
        <div v-if="dataList.length<1" class="empty-data">
            데이타가 존재하지 않습니다
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
</template>


<script>
import AUTH from '../../../../api/auth'
import {
    HOST,
    API_URL_METABUS_GET_ITEM_LIST,
} from '../../../../api/urls';
import apiService from '../../../../api/apiService';
import {mapGetters} from "vuex";
import selectBox from '../../../../components/selectBox/select';
import paganation from '../../../../components/paganation'

export default {
    name: 'presentComponent',
    components: {
        paganation,
        selectBox
    },
    computed: {
        ...mapGetters('etc', ["getUid"]),
    },
    data() {
        return {
            mobileView: false,
            mobileClass: '',
            ownerUid: '',
            page: 1,
            pageCount: 5,
            itemLimit: 20,
            pageInit: false,
            itemTotal: 1,
            dataList: [],
            orgDataList: [],
            serverDataList: [],
            itemCategorys: [],
            itemSubCategorys: [],
            fcate: 'all',
            scate: 'all',
            orgCategorys: {},
            status: 'all',
            statusTypes: [
                {value: 'all', text: '적용상태 선택'},
                {value: 'none', text: '미적용'},
                {value: 'end', text: '적용 완료'},
                {value: 'reserve', text: '적용 예정'},
                {value: 'ing', text: '적용중'},
            ]

        }
    },
    created() {
        if (this.$isMobile()) {
            this.mobileView = true;
            this.mobileClass = 'mobile'
        }
        let memberInfo = AUTH.getSession(this.$isMobile());
        if (memberInfo.AUTHTOKEN) {
        }
        this.ownerUid = this.getUid;
        this.getServerData('init')
    },
    methods: {
        getServerData(cmd) {
            this.orgDataList = [];

            const frm = new FormData()
            frm.append('pageCode', 'goods')
            frm.append('ownerUid', this.ownerUid);
            apiService.post(API_URL_METABUS_GET_ITEM_LIST, frm, (res) => {
                this.itemCategorys.push({text: '1차 분류 전체', value: 'all'});
                for (let item of res.categorys) {
                    this.itemCategorys.push({text: item.name, value: item.code})
                    this.orgCategorys[item.code] = item;
                }
                this.itemSubCategorys.push({text: '2차 분류 전체', value: 'all'});
                if (res.goodsList.length > 0) {
                    this.serverDataList = res.goodsList;
                    for (let item of this.serverDataList) {
                        if (this.orgCategorys[item.category1]) {
                            let subCateName = '';
                            for (let sub of this.orgCategorys[item.category1].subMenus) {
                                if (sub.code == item.category2) subCateName = sub.name;
                            }
                            item.categoryName = this.orgCategorys[item.category1].name + '/' + subCateName;
                        } else item.categoryName = '';
                        switch (item.status) {
                            case 'ing':
                                item.statusName = '적용중';
                                break;
                            case 'end':
                                item.statusName = '적용 완료';
                                break;
                            case 'reserve':
                                item.statusName = '적용 예정';
                                break;
                            default:
                                item.status = 'none';
                                item.statusName = '미적용';
                                break;
                        }

                        this.orgDataList.push(item);
                    }
                    if (cmd == 'init') {
                        this.getData(1);
                    } else {
                        this.search();
                    }

                } else {
                    this.dataList = [];
                    this.itemTotal = 0;
                }

            });

        },
        getData(page) {
            let start = (page - 1) * this.itemLimit;
            let end = start + this.itemLimit;
            this.itemTotal = this.orgDataList.length;

            let orgDataList = this.orgDataList.slice(start, end);
            this.dataList = [];
            let k = 0;
            this.nos = {};
            for (let item of orgDataList) {
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
            this.getData(1);
        },
        fcateChange(value) {
            this.fcate = value;

            this.scate = 'all';
            this.itemSubCategorys = [];
            this.itemSubCategorys.push({text: '2차 분류 전체', value: 'all'});
            for (let key in this.orgCategorys[this.fcate].subMenus) {
                let item = this.orgCategorys[this.fcate].subMenus[key];
                this.itemSubCategorys.push({text: item.name, value: item.code})
            }
            this.search();
        },
        scateChange(value) {
            this.scate = value;
            this.search();
        },
        statusChange(value) {
            this.status = value;
            this.search();
        }
    }

}
</script>
<style lang="scss" scoped>
.data-contents {
    width: 100%;

    .search-box {
        margin: 10px 0 30px 0;
        position: relative;
        padding-bottom: 15px;
        border-bottom: solid 1px #fff;
        z-index: 10;

        .text {
            float: left;
            font-size: 16pt;
            color: #fff;
            font-weight: bold;
            padding-right: 10px;
            line-height: 28pt;
        }

        .left-box {
            float: left;
            display: flex;

            .select-box {
                width: 170px;
                margin-right: 15px;
            }
        }

        .right-box {
            float: right;
            display: flex;

            .select-box {
                width: 160px;
                margin-right: 15px;
            }

            .reg-button-box {
                .reg-button {
                    width: 140px;
                    border-radius: 5px;
                    background: #686EFB;
                    color: #fff;
                    height: 40px;
                }
            }
        }

    }

    .list-table {
        border-spacing: 0;
        border-collapse: collapse;
        width: 100%;

        thead {
            th {
                border-top: solid 1px #999999;
                text-align: center;
                background: #1F2940;
                padding: 16px 0;
                color: #fff;
                font-size: 12pt;
                border-bottom: solid 1px #dcdcdc;
            }

        }

        tbody {
            td {
                border-bottom: solid 1px #dcdcdc;
                text-align: center;
                padding: 15px 0;
                font-size: 11pt;
                color: #fff;

                .reserve {
                    color: #999;
                }

                .end {
                    color: #686EFB;
                }

                .none {
                    color: #EB5248;
                }

            }
        }
    }

    .empty-data {
        height: 150px;
        text-align: center;
        line-height: 150px;
        font-size: 10pt;
        color: #000;
        border-bottom: solid 1px #dcdcdc;
    }

    &.mobile {
        width: 100%;

        .search-box {
            margin: 10px 0 30px -15px;
            width: calc(100vw);
            position: relative;
            padding-bottom: 15px;
            border-bottom: none;
            display: block;
            z-index: 10;

            .text {
                float: left;
                font-size: 14px;
                color: #fff;
                font-weight: bold;
                padding-left: 15px;
                line-height: 28pt;
                width: 100%;
            }

            .left-box {
                width: 100%;
                display: flex;

                .select-box {
                    width: 50%;
                    margin-right: 5px;
                }
            }

        }

        .list-table {
            border-spacing: 0;
            border-collapse: collapse;
            width: 100%;

            thead {
                display: none;

                th {
                    border-top: solid 1px #999999;
                    text-align: center;
                    background: #1F2940;
                    padding: 16px 0;
                    color: #fff;
                    font-size: 12px;
                    border-bottom: solid 1px #dcdcdc;
                }

            }

            tbody {
                td {
                    border-bottom: solid 1px #dcdcdc;
                    text-align: center;
                    padding: 15px 0;
                    font-size: 11pt;
                    color: #fff;

                    .reserve {
                        color: #999;
                    }

                    .end {
                        color: #686EFB;
                    }

                    .none {
                        color: #EB5248;
                    }

                }
            }
        }

        .empty-data {
            color:#fff;
            font-size: 12px;
            border-bottom:none;

        }

    }
}

.settleyes {
    color: #55C579;
}


</style>