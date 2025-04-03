<template>
    <div class="content-container">
        <div class="folling-box">
            <div class="folling-title">인스타 셀럽</div>
            <ul class="bj-list">
                <li class="padding-box" v-for="(info,index) in bjList">
                    <div class="top-box" @click="goBj(info.gcode)">
                        <div class="img-box">
                            <img v-if="info.img" :src="host+'/upload/images/'+info.img">
                            <i class="fas fa-user" v-else></i>
                        </div>
                        <div class="info-box">
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
    .content-container {
        width: 100%;
        padding: 0 0 60px 0;
        min-height:calc(100vh - 60px);
        background: #fff;
        margin: 0;

        .empty-div {
            text-align: left;
            color: #000;
            line-height: 130px;
            font-size: 15pt;
        }

        .folling-box {
            padding: 10px;
            margin-bottom: 20px;
            position: relative;

            .folling-title {
                color: #000;
                font-weight: 600;
                font-size: 12pt;
                margin-bottom: 10px;
            }

            .bj-list {
                padding: 0;

                .padding-box {
                    color: #fff;
                    margin-bottom: 10px;
                    background: #fafafa;
                    padding: 10px;
                    display: flex;
                    justify-content: space-between;

                    .top-box {
                        color: #000;
                        margin-bottom: 10px;
                        padding: 10px;
                        display: flex;
                        justify-content: space-between;

                        .img-box {
                            width: 45px;
                            min-width: 45px;
                            height: 45px;
                            min-height: 45px;
                            border-radius: 50%;
                            background: #686EFB;
                            overflow: hidden;
                            text-align: center;

                            img {
                                width: 100%;
                                min-height: 45px;
                            }

                            i {
                                color: #fff;
                                font-size: 18pt;
                                margin-top: 10px;
                            }

                        }

                        .info-box {
                            margin-left: 15px;
                            .subject {
                                margin-top:0;
                                font-weight: bold;
                                font-size: 10pt;
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
                                margin-top: 5px;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;

                            }
                        }
                    }
                }
            }
        }
    }
</style>
