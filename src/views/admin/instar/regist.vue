<template>
    <div class="page-contents">
        <div class="cfg-contents">
            <form novalidate @submit.prevent="validate">

                <ul class="title-box">
                    <li class="item-title">
                        기본 정보 입력

                    </li>
                    <li class="item">
                    </li>
                </ul>
                <div class="form-item">
                    <ul class="form-box">
                        <li>
                            <div class="subject-item">
                                <v-text-field
                                        v-model="name"
                                        label="인스타명"
                                        outlined
                                        dense
                                        :error-messages="nameErrors"
                                        @input="$v.name.$touch()"
                                        @blur="$v.name.$touch()"
                                ></v-text-field>
                            </div>

                        </li>
                         <li>
                             <div class="subject-item">
                                <v-text-field
                                        v-model="gcode"
                                        label="URL"
                                        outlined
                                        dense
                                        :error-messages="gcodeErrors"
                                        @input="$v.gcode.$touch()"
                                        @blur="$v.gcode.$touch()"
                                ></v-text-field>
                            </div>


                        </li>

                    </ul>


                </div>


                <ul class="title-box">
                    <li class="item-title">
                        이미지

                    </li>
                </ul>
                <div class="form-item" style="padding-bottom:30px;">
                    <div class="file-box">
                        <div class="file-names">

                        </div>
                        <div class="file-click wide">

                            <input ref="imgContainer" class="fileInput"
                                   @change="onChangeImg" type="file"
                                   accept="image/*">
                            <i class="fas fa-images"></i>
                            이미지 찾기
                        </div>
                    </div>
                    <div class="img-preview-box" v-if="image">
                        <div
                                class="list-group-item"
                        >
                            <img :src="image"/>
                        </div>
                    </div>
                </div>

                <div class="submit-button-box">
                    <v-btn
                            class="submit-button"
                            color="primary"
                            type="submit"
                            rounded

                    >
                        확 인
                    </v-btn>
                </div>
            </form>

        </div>
    </div>
</template>


<script>
    import {validationMixin} from 'vuelidate'
    import {required, numeric} from 'vuelidate/lib/validators'
    import {
        HOST,
        API_URL_INSTART_ADMIN_REGIST,
        API_URL_INSTART_ADMIN_REGIST_INFO,
    } from '../../../api/urls';
    import apiService from "../../../api/apiService";


    export default {
        name: 'instarRegist',
        mixins: [validationMixin],
        validations: {
            name: {
                required
            },
            gcode: {
                required
            },

        },
        computed: {
            nameErrors() {
                const errors = []
                if (!this.$v.name.$dirty) return errors
                !this.$v.name.required && errors.push('아이템명을 입력하세요')
                return errors
            },
            gcodeErrors() {
                const errors = []
                if (!this.$v.gcode.$dirty) return errors
                if(!this.$v.gcode.required) {
                    errors.push('URL을 입력하세요')
                }
                return errors
            },

        },
        data() {
            return {
                name: '',
                insertFlag: false,
                image:'',
                no:'',
                gcode:'',
                imgObj:'',

            }
        },
        created() {
            this.no = this.$route.params.no;
            this.getData();

        },
        methods: {
            getData() {
                const frm = new FormData()
                if (this.no != 'new') {
                    frm.append('no', this.no)
                }
                apiService.post(API_URL_INSTART_ADMIN_REGIST_INFO, frm, (res) => {
                    if (this.no != 'new' && res.info.no) {

                        this.name = res.info.name;
                        this.gcode = res.info.gcode;
                        if(res.info.img) {
                            this.image =  HOST+'/upload/images/'+res.info.img
                        }

                    }


                });
            },

            onChangeImg() {

                this.imgObj = this.$refs.imgContainer.files[0];
                this.image = URL.createObjectURL(this.imgObj)
            },
            deleteImg() {
                this.image = '';
                this.imgObj = '';
            },
            validate() {
                if (this.insertFlag) return;
                this.$v.$touch()
                if (!this.$v.$anyError) {



                    const frm = new FormData()
                    if (this.no != 'new') frm.append('no', this.no)
                    frm.append('name', this.name);
                    frm.append('gcode', this.gcode);

                    if(this.imgObj) {
                        frm.append('img',this.imgObj)
                    }
                    this.insertFlag = true;
                    this.$eventBus.$emit('overlay', 'open');

                    apiService.postFile(API_URL_INSTART_ADMIN_REGIST, frm, (res) => {
                        this.$eventBus.$emit('overlay', 'hide');
                        this.insertFlag = false;
                        let result = res.result;
                        let params = {}
                        switch (result) {
                            case 'succ':
                                let msg = (this.no=='new')?'등록':'수정';
                                params = {
                                    message: '정보가 '+msg+'되었습니다',
                                    doAction:()=>{
                                        this.$router.push('/admin/instar/list')
                                    }
                                };
                                this.$eventBus.$emit('modalOpen', params);

                                break;
                        }
                    })
                }
            }
        }

    }
</script>

<style lang="scss" scoped="true">
    .submit-button-box {
        padding-top: 80px;
    }

    .form-box {
        padding: 0;
        li {
            display: flex;
            .category-item {
                margin-right: 15px;
            }
            .radio-box {
                width: 150px;
            }
            .subject-item {
                width: 60%;
                margin-right: 20px;
            }
        }
    }

    .img-preview-box {
        width:300px;
        border: solid 1px #ccc;
        background: #fafafa;
        .list-group-item {
            width:300px;
            img {
                max-width: 100%;

            }

        }
    }

    .file-box {
        margin: 10px 0 10px 0;
        display: flex;
        width: 100%;
        padding: 0;
        height: 50px;
        .file-names {
            width: 100%;
            border: solid 1px #9E9E9E;
            border-right: none;
            border-radius: 5px 0 0 5px;
            padding: 0;

        }
        .file-click {
            position: relative;
            width: 200px;
            background: #03A9F4;
            border: solid 1px #03A9F4;
            text-align: center;
            color: #fff;
            cursor: pointer;
            border-radius: 0 5px 5px 0;
            height: 50px;
            padding-top: 13px;
            font-size: 11pt;

            .fileInput {
                opacity: 0;
                width: 100%;
                position: absolute;
                right: 0;
                height: 50px;

                z-index: 2;
            }
            i {
                position: relative;
                top: 2px;
                font-size: 15pt;
                margin-right: 10px;

            }
        }
    }

    .table-box-level {
        display: flex;
        justify-content: space-between;
        padding: 0;
        margin: 0;
        &.thead {
            li {
                background: #000;
                color: #fff;
                text-align: center;
                height: 40px;
                line-height: 40px;
                font-size: 11pt;
                margin-bottom: 10px;
                padding: 0;

            }
        }
        li {
            width: 30%;
            margin: 0;
            padding: 20px 20px 0 20px;
            border-bottom: solid 1px #dcdcdc;
            &.item-button {
                width: 20%;
                text-align: center;
            }
            &.item-value {
                width: 50%;
            }

        }
    }

    .title-box {
        display: flex;
        justify-content: space-between;
        padding: 0;
        margin: 0;
        li {
            margin: 0 0 20px 0;
            text-align: right;
            &.item-title {
                width: 500px;
                font-weight: bold;
                font-size: 11pt;
                text-align: left;

            }
            .item {
                margin-top: -18px;
            }
            &.item-button {
                width: 150px;
            }

        }
    }
</style>
