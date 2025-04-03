<template>
    <div class="content-container">
        <div class="folling-box">
            <div class="folling-title">인스타 셀럽</div>
            <ul class="bj-list">
                <li class="padding-box" v-for="(info,index) in bjList">
                    <div class="top-box"  @click="goBj(info.gcode)">
                        <div class="img-box">
                            <img v-if="info.img" :src="host+'/upload/images/'+info.img">
                            <i class="fas fa-user" v-else></i>
                        </div>
                        <div class="info-box" >
                            <div class="subject">{{info.name}}</div>
                            <div class="url">{{info.gcode}}</div>
                       </div>
                    </div>

                </li>
            </ul>
        </div>

    </div>
</template>

<script>
    import {
        HOST,
        API_URL_INSTAR_LIST,
    } from '../../../../api/urls';
    import apiService from '../../../../api/apiService';

    export default {
        data() {
            return {

                host: HOST,
                bjList: [],


            };
        },
        created() {
            this.getData();
        },
        methods: {
            getData() {
                const frm = new FormData()
                apiService.post(API_URL_INSTAR_LIST, frm, (res) => {
                    if (res.list) {
                        for (let bj of res.list) {
                            this.bjList.push(bj);
                        }
                    }

                });
            },
            goBj(url) {
                window.open(url)
            },

        }

    }
</script>
<style lang="scss" scoped="true">
    .empty-div {
        text-align: left;
        color: #000;
        line-height: 130px;
        font-size: 15pt;
    }

    .folling-box {
        height: 230px;
        padding: 40px;
        margin-bottom: 30px;
        position: relative;

        .folling-title {
            color: #000;
            font-weight: bold;
            font-size: 13pt;
            margin-bottom: 15px;
        }

        .bj-list {
            color: #000;
            margin-bottom: 60px;
            cursor: pointer;
            padding:0;
            display: flex;
            flex-wrap: wrap;
            .padding-box {
                background: #F4F4F4;
                padding: 25px 15px 0 15px;
                margin:0 20px 20px 0;
                .top-box {
                    width:289px;
                    max-width:289px;
                    height:105px;
                    display: flex;
                    .img-box {
                        width: 70px;
                        min-width: 70px;
                        height: 70px;
                        min-height: 70px;
                        border-radius: 50%;
                        background: #225CA2;
                        overflow: hidden;
                        text-align: center;

                        img {
                            width: 100%;
                            min-height: 70px;
                        }

                        i {
                            color: #fff;
                            font-size: 28pt;
                            margin-top: 15px;
                        }

                    }

                    .info-box {
                        margin-left: 15px;
                        .subject {
                            margin-top: 10px;
                            font-weight: bold;
                            font-size: 13pt;
                            text-align: left;
                            color: #000;
                            width: 220px;
                            font-weight: bold;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;


                        }

                        .url {
                            width: 220px;
                            font-size: 10pt;
                            color: #999;
                            margin-top: 10px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;

                        }
                    }
                }
            }
        }
    }
</style>
