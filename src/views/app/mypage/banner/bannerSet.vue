<template>
    <div class="mypage-container">

        <div class="contents" v-if="!mobileView">

            <div class="stitle">
                <span>배너광고 관리</span>
            </div>
            <div class="title-desc">배너광고 가격을 관리할수 있습니다.</div>

            <table class="list-table">
                <thead>
                <tr>
                    <th>
                        광고유형
                    </th>
                    <th>
                        광고상품

                    </th>
                    <th>
                        단가(단위:원)
                    </th>
                    <th>
                        노출형태
                    </th>
                    <th>
                        사이즈(단위:px)
                    </th>
                    <th>
                        사용여부
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="(item,index) in dataList"
                >
                    <td>{{ item.typeName }}</td>
                    <td>{{ item.codeName }}</td>
                    <td>
                        <input type="text" v-model="item.price" class="inputText">
                        <v-btn
                            class="modify-button"
                            depressed
                            @click="updatePrice(index)">
                            확인
                        </v-btn>

                    </td>
                    <td>
                        <v-select class="select-box"
                                  v-model="item.displayType"
                                  :items="displayTypes"
                                  outlined
                                  @change="updateDisplayType(index)"
                                  dense
                        ></v-select>

                    </td>
                    <td>{{ item.size }}</td>
                    <td>

                        <v-switch class="switch-box"
                                  v-model="item.use"
                                  color="#686EFB"
                                  value="yes"
                                  inset
                                  @change="updateUse(index)"
                        ></v-switch>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="mobile" v-else>
            <ul class="listUl">
                <li
                    v-for="(item,index) in dataList"
                >
                    <div class="top">
                        <div class="info-box">
                            <div class="subject">{{ item.typeName }} - {{ item.codeName }}</div>
                            <div class="size">{{ item.size }}</div>
                            <div class="more-box" @click="showMore(item)">
                                <i class="fas fa-angle-down" v-if="!item.view"></i>
                                <i class="fas fa-angle-up" v-else></i>
                            </div>
                        </div>
                        <div class="switch-box-top">
                            <v-switch class="switch-box"
                                      v-model="item.use"
                                      color="#F2554C"
                                      value="yes"
                                      inset
                                      dense
                                      @change="updateUse(index)"
                            ></v-switch>
                        </div>
                    </div>
                    <v-expand-transition>
                        <div v-if="item.view">
                            <div class="bottom">
                                <div class="item-box">
                                    <div class="item-title">단가</div>
                                    <div class="input-box">
                                        <input type="text" v-model="item.price" class="inputText">
                                        <v-btn
                                            class="modify-button"
                                            depressed
                                            @click="updatePrice(index)">
                                            확인
                                        </v-btn>
                                    </div>
                                </div>
                                <div class="item-box">
                                    <div class="item-title">노출형태</div>

                                    <v-select class="select-box"
                                              v-model="item.displayType"
                                              :items="displayTypes"
                                              outlined
                                              background-color="#fff"
                                              @change="updateDisplayType(index)"
                                              dense
                                    ></v-select>

                                </div>
                            </div>
                        </div>
                    </v-expand-transition>
                </li>
            </ul>
        </div>
    </div>
</template>


<script>
import AUTH from '../../../../api/auth';
import {
    API_URL_BANNER_USER_SETTING,
    API_URL_BANNER_USER_SETTING_INFO
} from '../../../../api/urls';
import apiService from '../../../../api/apiService';
import {BANNER} from '../../../../config/banner'
import {mapActions} from "vuex";

export default {
    name: 'bannerSet',
    data() {
        return {
            mobileView: false,
            mobileClass: '',
            dataList: [],
            uid: '',
            displayTypes: [
                {text: '랜덤', value: 'random'},
                {text: '고정', value: 'fixed'},
            ],


        }
    },
    created() {
        if (this.$isMobile()) {
            this.setClass('sub')
            this.setTitle('배너광고 관리');
            this.setBackUrl('');
            this.mobileView = true;
            this.mobileClass = 'mobile'
        }
        let memberInfo = AUTH.getSession(this.$isMobile());
        this.uid = memberInfo.uid;
        this.setDataList();
        //this.getServerData();

    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
        setDataList() {
            this.dataList = [];
            for (let item of BANNER) {
                for (let data of item.codeList) {
                    let itemData = {};
                    itemData.typeName = item.name;
                    itemData.type = item.code;
                    itemData.codeName = data.name;
                    itemData.code = data.code;
                    itemData.price = 1000;
                    itemData.displayType = 'random';
                    itemData.use = 'yes'
                    itemData.size = data.size;
                    itemData.view = false;
                    this.dataList.push(itemData)
                }
            }
            this.getServerData();
        },
        showMore(item) {
          if(item.view) item.view = false;
          else item.view = true;
        },
        getServerData() {
            const frm = new FormData()
            frm.append('uid', this.uid);
            apiService.post(API_URL_BANNER_USER_SETTING_INFO, frm, (res) => {
                if (res.info) {
                    //if(res.info.)
                    for (let item of this.dataList) {

                        if (res.info[item.code]) {
                            if (res.info[item.code].displayType) {
                                item.displayType = res.info[item.code].displayType;
                            }
                            if (res.info[item.code].price) {
                                item.price = res.info[item.code].price;
                            }
                            if (res.info[item.code].guse) {
                                item.use = res.info[item.code].guse;
                            }
                        }
                    }
                }
            });

        },

        updatePrice(index) {
            let item = this.dataList[index];
            if (!item.price) {
                let params = {
                    message: '단가를 입력하세요',
                };
                this.$eventBus.$emit('modalOpen', params);
                return;
            }
            if (isNaN(item.price)) {
                let params = {
                    message: '단가는 숫자만 입력가능합니다',
                };
                item.price = 1000;
                this.$eventBus.$emit('modalOpen', params);
                return;
            }
            this.$eventBus.$emit('overlay', 'show');
            const frm = new FormData()
            frm.append('cmd', 'price')
            frm.append('gcode', item.code)
            frm.append('price', item.price)
            apiService.post(API_URL_BANNER_USER_SETTING, frm, (res) => {
                this.$eventBus.$emit('overlay', 'hide');
                let params = {
                    message: '정보가 변경되었습니다',
                };
                this.$eventBus.$emit('modalOpen', params);

            });
        },
        updateDisplayType(index) {
            let item = this.dataList[index];
            this.$eventBus.$emit('overlay', 'show');
            const frm = new FormData()
            frm.append('cmd', 'displayType')
            frm.append('gcode', item.code)
            frm.append('displayType', item.displayType)
            apiService.post(API_URL_BANNER_USER_SETTING, frm, (res) => {
                this.$eventBus.$emit('overlay', 'hide');
                let params = {
                    message: '정보가 변경되었습니다',
                };
                this.$eventBus.$emit('modalOpen', params);

            });
        },
        updateUse(index) {
            let item = this.dataList[index];
            this.$eventBus.$emit('overlay', 'show');
            const frm = new FormData()
            frm.append('cmd', 'use')
            frm.append('gcode', item.code)
            let use = (item.use == 'yes') ? 'yes' : 'no';
            frm.append('guse', use)
            apiService.post(API_URL_BANNER_USER_SETTING, frm, (res) => {
                this.$eventBus.$emit('overlay', 'hide');
                let params = {
                    message: '정보가 변경되었습니다',
                };
                this.$eventBus.$emit('modalOpen', params);

            });
        }
    }

}
</script>
<style lang="scss" scoped>
.list-table {
    border-spacing: 0;
    border-collapse: collapse;
    width: 100%;

    thead {
        th {
            border-top: solid 1px #C6C6C6;
            text-align: center;
            background: #f4f4f4;
            padding: 10px 0;
            color: #000;
            font-size: 12pt;
            border-bottom: solid 1px #DCDCDC;
        }

    }

    tbody {
        td {
            border-bottom: solid 1px #dcdcdc;
            text-align: center;
            padding: 10px 0;
            font-size: 11pt;

            .inputText {
                width: 140px;
                height: 40px;
                border: solid 1px #dcdcdc;
                border-right: none;
                text-align: right;
                padding-right: 10px;
            }

            .modify-button {

                border-radius: 0;
                min-width: 60px;
                height: 40px;
                margin-top: -3px;
                border: solid 1px #dcdcdc;
            }

            .select-box {
                max-width: 100px;
                border-radius: 0;
                max-height: 40px;
                margin: auto;
            }

            .switch-box {
                margin-left: auto;
                margin-right: auto;
                width: 60px;
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
.mobile {
    .listUl {
        padding:15px;
        li {
            padding:15px 0 ;
            border-bottom:solid 1px #dcdcdc;
            .top {
                display:flex;
                justify-content: space-between;
                .info-box {
                    width:90%;
                    padding-left:10px;
                    .subject {
                        color: #333;
                        font-size: 11pt;
                        font-weight: 600;
                    }

                    .size {
                        color:#999;
                        font-size:8pt;
                        padding-top:4px;
                    }
                    .more-box {
                        font-size:15pt;
                        color:#ccc;
                        padding:3px 0 0 0;
                        height:20px;
                    }
                }
                .switch-box-top {
                    width:45px;
                    margin-right:0;
                    height:30px;
                    margin-top:17px;
                    .switch-box {
                        margin:0;
                    }
                }
            }
            .bottom {
                background:#F4F4F4;
                margin-top:17px;
                padding:15px 15px 0 15px;
                .item-box {
                    padding-bottom:20px;
                    .item-title {
                        font-size:8pt;
                        color:#000;
                        padding-bottom:7px;
                    }
                    .input-box {
                        display:flex;
                        .inputText {
                            background: #fff;
                            border: solid 1px #dcdcdc;
                            border-right:none;
                            width:90%;
                            height: 36px;
                            padding: 0 10px;
                        }

                        .modify-button {
                            background:#fff;
                            border:solid 1px #dcdcdc;
                            border-radius:0;

                        }
                    }
                    .select-box {
                        height:50px;
                    }
                }
            }

        }
    }
}

</style>