<template>
    <div>
        <div :class="'exam-make-box '+mobileClass">
            <div class="title-box" v-if="!mobileView">
                <div class="exam-title">시험 즉시 만들기</div>
                <div class="del-box" @click="hideEventBox()"><i class="fas fa-times"></i></div>
            </div>
            <div class="contentsBox">
                <div class="from-box">
                    <div v-if="!makeShow">
                        <form novalidate @submit.prevent="validate">
                            <ul class="field-box">
                                <li>
                                    <div class="required-icon">시험명 입력</div>
                                    <div class="field-input">
                                        <v-text-field
                                            v-model="name"
                                            required
                                            :dense="dense"
                                            placeholder="시험명을 입력하세요"
                                            :error-messages="nameErrors"
                                            @input="$v.name.$touch()"
                                            @blur="$v.name.$touch()"
                                            outlined
                                        ></v-text-field>
                                    </div>
                                </li>
                                <li>
                                    <div class="required-icon">출제자 입력</div>
                                    <div class="field-input">
                                        <v-text-field
                                            v-model="author"
                                            required
                                            placeholder="출제자를 입력하세요"
                                            :error-messages="authorErrors"
                                            @input="$v.author.$touch()"
                                            @blur="$v.author.$touch()"
                                            outlined
                                            :dense="dense"
                                        ></v-text-field>
                                    </div>
                                </li>
                                <li>
                                    <div class="required-icon">제한시간 입력</div>
                                    <div class="field-input">
                                        <v-text-field
                                            v-model="timelimit"
                                            required
                                            :dense="dense"
                                            placeholder="제한시간을 숫자로 입력하세요 (단위:분)"
                                            :error-messages="timelimitErrors"
                                            @input="$v.timelimit.$touch()"
                                            @blur="$v.timelimit.$touch()"
                                            outlined
                                        ></v-text-field>
                                    </div>
                                </li>
                                <li>
                                    <div class="required-icon">총배점 입력</div>
                                    <div class="field-input">
                                        <v-text-field
                                            v-model="totalJumsu"
                                            required
                                            placeholder="총배점을 숫자로 입력하세요"
                                            :error-messages="totalJumsuErrors"
                                            @input="$v.totalJumsu.$touch()"
                                            @blur="$v.totalJumsu.$touch()"
                                            outlined
                                            :dense="dense"
                                        ></v-text-field>
                                    </div>
                                </li>
                            </ul>
                            <p class="submit-button-box">
                                <v-btn
                                    v-if="!mobileView"
                                    type="button"
                                    class="cancle-button"
                                    @click="hideEventBox()"
                                >
                                    취소
                                </v-btn>
                                <v-btn
                                    type="submit"
                                    class="submit-button"
                                >
                                    문제 설정
                                </v-btn>
                            </p>

                        </form>
                    </div>
                    <examDirectMake v-else :sendParams="sendParams" @backChange="makeShow=false"
                                    @submitResult="submitResult"></examDirectMake>
                </div>

            </div>
        </div>
    </div>
</template>


<script>
import {validationMixin} from 'vuelidate'
import {required, numeric} from 'vuelidate/lib/validators'
import examDirectMake from './examDirectMake'

export default {
    name: 'examMake',
    props: ["gno"],
    components: {
        examDirectMake
    },
    mixins: [validationMixin],
    validations: {
        name: {required},
        author: {required},
        timelimit: {required, numeric},
        totalJumsu: {required, numeric},

    },
    data() {
        return {
            insertFlag: false,
            mobileView: false,
            mobileClass: '',
            name: '',
            author: '',
            timelimit: '',
            totalJumsu: 100,
            makeShow: false,
            sendParams: {},
            dense:false,
        }
    },
    created() {
        if (this.$isMobile()) {
            this.mobileClass = 'mobile'
            this.mobileView = true;
            this.dense = true;
        }
    },
    computed: {
        nameErrors() {
            const errors = []
            if (!this.$v.name.$dirty) return errors
            if (!this.$v.name.required) {
                errors.push('시험명을 입력하세요')
            }
            return errors
        },
        authorErrors() {
            const errors = []
            if (!this.$v.author.$dirty) return errors
            if (!this.$v.author.required) {
                errors.push('출제자를 입력하세요')
            }
            return errors
        },
        timelimitErrors() {
            const errors = []
            if (!this.$v.timelimit.$dirty) return errors
            if (!this.$v.timelimit.required) {
                errors.push('제한시간을 입력하세요')
            }
            if (!this.$v.timelimit.numeric) {
                errors.push('제한시간은 숫자만 입력가능합니다')
            }

            return errors
        },
        totalJumsuErrors() {
            const errors = []
            if (!this.$v.totalJumsu.$dirty) return errors
            if (!this.$v.totalJumsu.required) {
                errors.push('총배점을 입력하세요')
            }
            if (!this.$v.totalJumsu.numeric) {
                errors.push('총배점은 숫자만 입력가능합니다')
            }

            return errors
        },

    },
    methods: {
        hideEventBox() {
            this.$emit("hideEvent", {page: 'immExam'});
        },
        submitResult(no) {
            this.$emit("hideEvent", {page: 'immExam', action: 'sendProblem', no: no});
        },
        validate() {
            this.$v.$touch()
            if (!this.$v.$anyError) {
                this.sendParams = {
                    name: this.name,
                    author: this.author,
                    timelimit: this.timelimit,
                    totalJumsu: this.totalJumsu,
                    sendType: 'immExam',
                    gno: this.gno,
                }
                this.makeShow = true;
            }

        }
    },

}
</script>
<style lang="scss">
ul {
    padding: 0;
}

.exam-make-box {
    width: 1100px;
    height: 700px;
    -webkit-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
    -moz-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
    box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
    border-radius: 10px;
    position: absolute;
    left: 50%;
    top: 50%;
    background: #ffffff;
    margin: -350px 0 0 -550px;

    .title-box {
        height: 55px;
        line-height: 55px;
        border-bottom: solid 1px #dcdcdc;
        position: relative;

        .exam-title {
            font-size: 12pt;
            font-weight: bold;
            color: #000;
            text-align: center;
        }

        .del-box {
            cursor: pointer;
            position: absolute;
            right: 15px;
            top: 17px;
            background: #999999;
            width: 20px;
            height: 20px;
            text-align: center;
            line-height: 20px;
            border-radius: 10px;

            i {
                font-size: 10pt;
                color: #fff;
            }
        }
    }

    .contentsBox {
        padding: 40px 60px;
        height: 645px;
        overflow-y: auto;
        border-radius: 0 0 10px 10px;

    }

    .submit-button-box {
        display: flex;
        width: 700px;
        margin: 40px auto 0 auto;
        justify-content: space-between;

        .cancle-button {
            width: 48%;
            border-radius: 0;
            padding: 0;
            background: #999999;
            color: #fff;
            min-height: 70px;
            font-size: 14pt;
        }

        .submit-button {
            width: 48%;
            border-radius: 0;
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
        border-bottom: solid 1px #dcdcdc;

        span.line {
            padding-bottom: 13px;
            border-bottom: solid 2px #686EFB;
        }

        span.question-box {
            border-bottom: solid 1px #999;
            line-height: 6px;
        }
    }

    .title-desc {
        padding: 10px 0 40px 0;
        font-size: 10pt;
        color: #555;

    }

    .sub-title {
        margin-top: 50px;
        font-weight: bold;
        color: #000;
        font-size: 14pt;
    }

    .sub-title-desc {
        padding: 5px 0 20px 0;
        font-size: 10pt;
        color: #555;

    }

    .field-box {
        padding: 0;

        & > li {
            border-bottom: solid 1px #DCDCDC;
            display: flex;
            padding: 25px 25px 0 25px;

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
                    width: 500px;
                    padding: 0;
                    display: flex;
                    margin-bottom: 25px;

                    &.three-box {
                        width: 600px;

                        li {
                            border-right: none;

                            &:last-child {
                                border-right: solid 1px #dcdcdc;
                            }
                        }
                    }

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

    &.mobile {
        width: 100%;
        height: auto;
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
        border-radius: 0;
        position: relative;
        left: 0;
        top: 0;
        background: #ffffff;
        margin: 0;
        .contentsBox {
            padding:20px 15px;
            height: 645px;
            overflow-y: auto;
            border-radius:0;
        }

        .submit-button-box {
            width:100%;
            margin:40px auto 0 auto;
            .submit-button {
                width:100%;
                min-height: 50px;
                font-size: 14px;

            }
        }
        .sub-title {
            margin-top: 50px;
            font-weight: bold;
            color: #000;
            font-size: 16px;
        }

        .sub-title-desc {
            padding: 5px 0 20px 0;
            font-size: 11px;
            color: #555;

        }

        .field-box {
            padding: 0;

            & > li {
                border-bottom: solid 1px #DCDCDC;
                display: block;
                padding:15px 5px 0 5px;

                .required-icon {
                    width:100%;
                    color: #000;
                    font-weight: bold;
                    font-size: 14px;
                    padding:5px 0 10px 0;
                }

                .field-input {
                    width: 100%;
                    .switch-ul {
                        width:100%;
                        padding: 0;
                        display: flex;
                        margin-bottom: 25px;
                        &.three-box {
                            width: 600px;

                            li {
                                border-right: none;

                                &:last-child {
                                    border-right: solid 1px #dcdcdc;
                                }
                            }
                        }

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


</style>