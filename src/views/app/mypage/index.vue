<template>
    <router-view/>
</template>

<script>
	export default {
		name: 'myPage',
		created() {
		}
	}
</script>
<style lang="scss">
    .mypage-container {
        width: 100%;
        min-height: calc(100vh);
        background: #fff;
        .contents {
            padding: 50px 35px;
            .submit-button-box {
                display:flex;
                width:700px;
                margin:80px auto;
                justify-content: space-between;
                .cancle-button {
                    width: 48%;
                    border-radius:0;
                    padding: 0;
                    background: #999999;
                    color: #fff;
                    min-height: 70px;
                    font-size: 14pt;
                }
                .submit-button {
                    width: 48%;
                    border-radius:0;
                    padding: 0;
                    background: #686EFB;
                    color: #fff;
                    min-height: 70px;
                    font-size: 14pt;

                }
            }
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
            .title-desc {
                padding:10px 0 40px 0;
                font-size:10pt;
                color:#555;

            }
            .field-box {
                padding: 0;
                & > li {
                    border-bottom: solid 1px #DCDCDC;
                    display: flex;
                    padding: 25px 25px 0 25px;
                    &:first-child {
                        border-top: solid 1px #dcdcdc;
                    }
                    .required-icon {
                        width: 220px;
                        color: #000;
                        font-weight: bold;
                        font-size: 12pt;
                        padding-top: 15px;
                    }
                    .field-input {
                        width: 60%;
                        .switch-ul {
                            width: 480px;
                            padding: 0;
                            display: flex;
                            margin-bottom: 25px;
                            li {
                                width: 50%;
                                border: solid 1px #dcdcdc;
                                text-align: center;
                                line-height: 55px;
                                height: 55px;
                                cursor: pointer;
                                &.active {
                                    background: #686EFB;
                                    color: #fff;
                                }
                                &:first-child {
                                    border-right: none;
                                    border-radius: 10px 0 0 10px;
                                }
                                &:last-child {
                                    border-radius: 0 10px 10px 0;
                                }
                            }
                        }

                    }
                }
            }
        }
        &.mobile {
            .empty-data {
                height: 150px;
                text-align: center;
                line-height: 150px;
                font-size: 10pt;
                background: #fff;
                color: #999;
                border-top: solid 1px #dcdcdc;
                border-bottom: solid 1px #dcdcdc;
            }
            .contents {
                padding: 30px 15px;
                .submit-button-box {
                    display: flex;
                    width: 100%;
                    margin: 30px auto;
                    justify-content: space-between;

                    .cancle-button {
                        width: 50%;
                        border-radius: 0;
                        padding: 0;
                        background: #999999;
                        color: #fff;
                        min-height: 50px;
                        font-size: 11pt;
                    }

                    .submit-button {
                        width: 50%;
                        border-radius: 0;
                        padding: 0;
                        background: #686EFB;
                        color: #fff;
                        min-height: 50px;
                        font-size: 11pt;

                    }
                }

                .field-box {
                    padding: 0;
                    & > li {
                        border-bottom:none;
                        display: block;
                        padding:0;
                        &:first-child {
                            border-top: none;
                        }
                        .required-icon {
                            width:100%;
                            color: #000;
                            font-weight:600;
                            font-size: 11pt;
                            padding-bottom:15px;
                        }
                        &.use-box {
                            display:flex;
                            border-bottom:solid 1px #dcdcdc;
                        }
                        .field-input {
                            width:100%;

                            .switch-ul {
                                width: 480px;
                                padding: 0;
                                display: flex;
                                margin-bottom: 25px;

                                li {
                                    width: 50%;
                                    border: solid 1px #dcdcdc;
                                    text-align: center;
                                    line-height: 55px;
                                    height: 55px;
                                    cursor: pointer;

                                    &.active {
                                        background: #686EFB;
                                        color: #fff;
                                    }

                                    &:first-child {
                                        border-right: none;
                                        border-radius: 10px 0 0 10px;
                                    }

                                    &:last-child {
                                        border-radius: 0 10px 10px 0;
                                    }
                                }
                            }

                        }
                    }
                }
            }
        }
    }

</style>
