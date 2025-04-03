<template>
    <div :class="'mypage-container '+mobileClass">

        <div class="contents">
            <div class="from-box">

                <div class="stitle"><span class="line">{{ subject }} - 설문조사 내역</span></div>
                <div class="data-list-box">
                    <div class="data-list-item" v-for="(data,idx) in dataList">
                        <div class="people"><span>{{ idx + 1 }}.</span> {{ data.question }}</div>
                        <table class="data-list" v-if="data.prbType=='mchoice'">
                            <thead>
                            <tr>
                                <th>항목명</th>
                                <th>선택률</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="item in data.items">
                                <td>{{ item.answer }}</td>
                                <td>
                                    <div class="gline-box">
                                        <div class="gline" :style="item.itemResult.style"></div>
                                        <div class="result" v-if="item.itemResult.per>0">{{ item.itemResult.per }}%
                                            ({{ item.itemResult.result }}명)
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <table class="data-list single-box" v-if="data.prbType!='mchoice'">
                            <thead>
                            <tr>
                                <th>항목명</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>서술형 문항입니다. '상세 내역 보기' 에서 확인이 가능합니다</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div style="width:100%;text-align:center;padding-top:30px;color:#000;font-weight: bold;"
                         v-if="dataList.length<1">
                        진행한 설문조사가 없습니다
                    </div>
                </div>
                <div class="button-row" v-if="dataList.length>0">
                    <v-btn
                        type="button"
                        class="submit-button"
                        @click="goView()">상세내역보기
                    </v-btn>
                </div>
            </div>

        </div>

    </div>
</template>


<script>
import {mapGetters} from "vuex";
import {
    API_URL_BROADCAST_LIVE_POLL_AFTER_INFO
} from '../../../../api/urls';
import apiService from '../../../../api/apiService';

export default {
    name: 'afterPoll',
    data() {
        return {
            mobileView: false,
            mobileClass: '',
            no: '',
            dataList: [],
            stream: '',
            subject: '',
            totalCount: '',
        }
    },
    created() {
        if (this.$isMobile()) {
            this.mobileView = true;
            this.mobileClass = 'mobile'
        }
        this.no = this.getGno;
        this.getData();
    },
    computed: {
        ...mapGetters('etc', ["getGno"]),

    },
    methods: {
        getData() {
            const frm = new FormData()
            frm.append('gno', this.no)
            apiService.post(API_URL_BROADCAST_LIVE_POLL_AFTER_INFO, frm, (ret) => {
                this.subject = ret.info.subject;
                let item = {};
                let problems = ret.info.problems;
                let key = '';

                let answerItem = [];
                let keyString = '';
                let userAnswerResult = {};
                for (let key in problems) {
                    keyString = 'a' + key;
                    userAnswerResult[keyString] = [];
                }
                let i = 0;
                let userAnswer = {};
                for (let answer of ret.dataList) {
                    answerItem = answer.answers;
                    i = 0;
                    for (let ans of answerItem) {
                        keyString = 'a' + i;
                        userAnswerResult[keyString].push(ans);
                        i++;
                    }
                }
                this.totalCount = ret.dataList.length;
                let resultCount = 0;
                let keynum = 1;
                let style = {};
                let result = 0;
                let per = 0;
                let width = 0;
                let idx = 0;
                let answerString = '';
                let answerResult = {};
                for (let data of problems) {
                    if (data.prbType == 'mchoice') {
                        keynum = 1;
                        answerResult = {};
                        keyString = 'a' + idx;
                        for (let uans of userAnswerResult[keyString]) {
                            if (data.multigood == 'yes') {
                                for (let ans of uans.multiAnswer) {
                                    key = ans;
                                    answerResult[key] = ((answerResult[key] > 0) ? parseInt(answerResult[key]) : 0) + 1;
                                }
                            } else {
                                key = uans.singleAnswer
                                answerResult[key] = ((answerResult[key] > 0) ? parseInt(answerResult[key]) : 0) + 1;
                            }

                        }
                        for (let subdata of data.items) {
                            if (this.totalCount > 0) {
                                result = (isNaN(answerResult[keynum.toString()])) ? 0 : answerResult[keynum.toString()];
                                per = Math.floor((result / this.totalCount) * 100);
                                width = ((800 - 120) / 100) * per;
                                style = {'width': width + 'px'};
                            }
                            item = {
                                text: subdata.answer,
                                result: result,
                                style: style,
                                per: per,
                            }
                            subdata.itemResult = item;
                            keynum++;
                        }

                    }
                    this.dataList.push(data);
                    idx++;
                }
            });
        },
        goView() {
            let path = this.$route.path.split('/');
            this.$router.push('/' + path[1] + '/' + this.no + '/afterPollUser');
        },

    },

}
</script>
<style lang="scss" scoped>
ul {
    padding: 0;

    li {

    }
}

.mypage-container {
    .data-list-box {
        margin-top: 30px;
        background: #F4F4F4;
        border: solid 1px #DCDCDC;
        padding: 10px 40px 40px 40px;

        .people {
            margin: 30px 0 10px 0;
            padding-left: 6px;

            span {
                color: #2D8CFF;
                font-weight: bold;
            }
        }

        .data-list {
            width: 100%;
            color: #000;
            font-size: 11pt;

            th {
                &:first-child {
                    width: 200px;
                    border-right: none;

                }

                text-align: center;
                background: #E8F4FF;
                border: solid 1px #DCDCDC;
                height: 40px;
                line-height: 40px;
                font-weight: normal;
            }

            tbody tr {
                td {
                    height: 50px;
                    background: #FFFFFF;
                    border: solid 1px #DCDCDC;
                    border-top: none;
                    font-weight: bold;

                    &:first-child {
                        padding: 3px 0 0 20px;
                        border-right: none;
                    }

                    .gline-box {
                        width: 700px;
                        display: flex;

                        .gline {
                            background: #2D8CFF;
                            height: 30px;
                        }

                        .result {
                            padding: 7px 0 0 10px;
                            width: 120px;
                            font-size: 9pt;
                            font-weight: normal;
                        }
                    }

                }
            }

            &.single-box {
                th {
                    &:first-child {
                        border-right: solid 1px #DCDCDC;
                    }
                }

                td {
                    text-align: center;

                    &:first-child {
                        border-right: solid 1px #DCDCDC;
                    }
                }
            }

        }
    }

    .button-row {
        width: 100%;
        margin: 40px auto;
        text-align: center;

        button {
            width: 300px;
            border-radius: 40px;
            min-height: 60px;

            &.submit-button {
                background: #686EFB;
                color: #fff;
            }
        }
    }

    &.mobile {
        .data-list-box {
            margin-top:30px;
            background: #F4F4F4;
            border: solid 1px #DCDCDC;
            padding:15px;
            .data-list {
                width: 100%;
                color: #000;
                font-size: 10pt;
                th {
                    width:65%;
                    &:first-child {
                        max-width:35%;
                        border-right: none;

                    }
                    text-align: center;
                    background: #E8F4FF;
                    border: solid 1px #DCDCDC;
                    height: 40px;
                    line-height: 40px;
                    font-weight: normal;
                }

                tbody tr {
                    td {
                        height: 50px;
                        background: #FFFFFF;
                        border: solid 1px #DCDCDC;
                        border-top: none;
                        font-weight: bold;

                        &:first-child {
                            padding: 3px 0 0 20px;
                            border-right: none;
                        }

                        .gline-box {
                            width:100%;
                            display: flex;

                            .gline {
                                background: #2D8CFF;
                                height: 30px;
                            }

                            .result {
                                padding: 7px 0 0 10px;
                                width:120px;
                                font-size: 9pt;
                                font-weight: normal;
                            }
                        }

                    }
                }

                &.single-box {
                    th {
                        &:first-child {
                            border-right: solid 1px #DCDCDC;
                        }
                    }

                    td {
                        text-align: center;

                        &:first-child {
                            border-right: solid 1px #DCDCDC;
                        }
                    }
                }

            }

            .button-row {
                width: 100%;
                margin: 40px auto;

                button {
                    width: 100%;
                    border-radius: 30px;
                }
            }
        }
    }
}

</style>