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
                        <div class="category-item">
                            <v-select
                                v-model="firstCategory"
                                :items="firstCategorys"
                                label="1차 카테고리"
                                outlined
                                dense
                                :error-messages="firstCategoryErrors"
                                @input="$v.firstCategory.$touch()"
                                @blur="$v.firstCategory.$touch()"
                            ></v-select>
                        </div>
                        <div class="category-item">
                            <v-select
                                v-model="secCategory"
                                :items="secCategorys"
                                label="2차 카테고리"
                                outlined
                                :error-messages="secCategoryErrors"
                                @input="$v.secCategory.$touch()"
                                @blur="$v.secCategory.$touch()"
                                dense
                            ></v-select>
                        </div>
                    </li>
                    <li>
                        <div class="subject-item">
                            <v-text-field
                                v-model="name"
                                label="아이템명"
                                outlined
                                dense
                                :error-messages="nameErrors"
                                @input="$v.name.$touch()"
                                @blur="$v.name.$touch()"
                            ></v-text-field>
                        </div>
                        <div class="price-item">
                            <v-text-field
                                v-model="price"
                                label="판매가격"
                                outlined
                                type="number"
                                dense
                                :error-messages="priceErrors"
                                @input="$v.price.$touch()"
                                @blur="$v.price.$touch()"
                            ></v-text-field>
                        </div>
                    </li>
                    <li>
                        <div style="font-weight:bold;">아이템 코드</div>
                    </li>
                    <li>
                        <div style="padding-top:13px;font-weight:bold;">{{codePrefix}}</div>
                        <div class="price-item">
                            <v-text-field
                                v-model="gcode"
                                label=""
                                outlined
                                dense
                                :readonly="gcodeReadonly"
                                :error-messages="gcodeErrors"
                                @input="$v.gcode.$touch()"
                                @blur="$v.gcode.$touch()"
                            ></v-text-field>
                        </div>
                        <div style="margin-left:10px;font-size:10pt;color:#f00">
                            카테고리 코드값과의 조합으로 아이템 코드가 형성됩니다<br>
                            코드값은 반드시 영문 또는 숫자만 사용가능합니다
                        </div>

                    </li>
                    <li>

                        <v-radio-group v-model="status" row>
                            <div class="radio-box">
                                <v-radio
                                    value="normal"
                                    label="정상판매"
                                ></v-radio>
                            </div>
                           <div class="radio-box">
                                <v-radio
                                    value="out"
                                    label="노출중단"
                                ></v-radio>
                            </div>

                        </v-radio-group>
                    </li>
                    <li>
                        <v-textarea
                            label="간략설명"
                            outlined
                            v-model="summary"
                            :error-messages="summaryErrors"
                            @input="$v.summary.$touch()"
                            @blur="$v.summary.$touch()"
                            rows="2"
                        ></v-textarea>
                    </li>
                    <!--li>

                        <v-text-field
                            v-model="keyword"
                            label="추가검색단어"
                            outlined
                            placeholder="','로 구분해서 입력하세요"
                            dense
                        ></v-text-field>
                    </li-->

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
		API_URL_METABUS_ITEM_ADMIN_REGIST_INFO,
		API_URL_METABUS_ITEM_ADMIN_REGIST,
	} from '../../../api/urls';
	import apiService from "../../../api/apiService";


	export default {
		name: 'itemRegist',
		mixins: [validationMixin],
		validations: {
			firstCategory: {
				required
			},
			secCategory: {
				required
			},
			name: {
				required
			},
			price: {
				required,
				numeric
			},
			gcode: {
				required
            },
			summary: {
				required
			}
		},
		computed: {
			firstCategoryErrors() {
				const errors = []
				if (!this.$v.firstCategory.$dirty) return errors
				!this.$v.firstCategory.required && errors.push('1차 카테고리를 선택하세요')
				return errors
			},
			secCategoryErrors() {
				const errors = []
				if (!this.$v.secCategory.$dirty) return errors
				!this.$v.secCategory.required && errors.push('2차 카테고리를 선택하세요')
				return errors
			},
			nameErrors() {
				const errors = []
				if (!this.$v.name.$dirty) return errors
				!this.$v.name.required && errors.push('아이템명을 입력하세요')
				return errors
			},
			priceErrors() {
				const errors = []
				if (!this.$v.price.$dirty) return errors
				!this.$v.price.required && errors.push('판매가격을 입력하세요')
				!this.$v.price.numeric && errors.push('판매가격은 숫자만 입력가능합니다')
				return errors
			},
			gcodeErrors() {
				const errors = []
				if (!this.$v.gcode.$dirty) return errors
				if(!this.$v.gcode.required) {
					errors.push('코드를 입력하세요')
				} else {
					let check = /[~!@#$%^&*()_+|<>?:{}]/;
					let checkKor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
					if(check.test(this.gcode)) {
						errors.push('코드는 영문 또는 수자만 입력가능합니다')
                    } else if(checkKor.test(this.gcode)) {
						errors.push('코드는 영문 또는 수자만 입력가능합니다')
					}
				}
				return errors
			},
			summaryErrors() {
				const errors = []
				if (!this.$v.summary.$dirty) return errors
				!this.$v.summary.required && errors.push('간략설명을 입력하세요')
				return errors
			},
		},
		watch: {
			firstCategory(val) {
				if (val) {
					this.secCategory = '';
					this.secCategorys = [];
					for (let item of this.firstCategorys) {
						if (val == item.value) {
							if (item.subMenus) {
								for (let subItem of item.subMenus) {
									if (subItem.view == 'yes') {
										this.secCategorys.push({
											value: subItem.code,
											text: subItem.name,
											subMenus: subItem.subMenus
										});
									}
								}
							}
						}
					}
					if(this.secCategory) {
						this.codePrefix = this.firstCategory + '_' + this.secCategory + '_';
					} else this.codePrefix = this.firstCategory + '_';
				} else this.codePrefix = '';
			},
            secCategory(val) {
				if(val) {
					this.codePrefix = this.firstCategory + '_' + this.secCategory + '_';
				}
            }

		},
		data() {
			return {
				firstCategory: '',
				firstCategorys: [],
				secCategory: '',
				secCategorys: [],
				name: '',
				summary: '',
				status: 'normal',
				keyword: '',
				price: '',
				insertFlag: false,
				image:'',
                no:'',
                gcode:'',
				imgObj:'',
				codePrefix:'',
				gcodeReadonly:false,

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
					this.gcodeReadonly = true;
				}
				apiService.post(API_URL_METABUS_ITEM_ADMIN_REGIST_INFO, frm, (res) => {
					if (res.categoryInfo.categorys) {
						for (let item of res.categoryInfo.categorys) {
							if (item.view == 'yes') {
								this.firstCategorys.push({value: item.code, text: item.name, subMenus: item.subMenus})
							}
						}
					}
					if (this.no != 'new' && res.goodsInfo.no) {

						this.name = res.goodsInfo.name;
						this.price = (res.goodsInfo.price)?res.goodsInfo.price:0;
						this.status = res.goodsInfo.status;
						let gcode = res.goodsInfo.gcode.toString();
						let gcodes = gcode.split('_');
						this.gcode = gcodes[2];
						let categorys = res.goodsInfo.category.split(',');
						this.firstCategory = categorys[0];
						if (categorys[1]) {
							setTimeout(() => {
								this.secCategory = categorys[1];
							}, 500)
						}
						this.summary = res.goodsInfo.summary;
						//this.keyword = res.goodsInfo.keyword;
						this.image =  HOST+res.goodsInfo.img
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
					if(!this.image) {
						let params = {
							message: '이미지를 입력하세요',
						};
						this.$eventBus.$emit('modalOpen', params);
						return;
                    }
					let category = this.firstCategory + ',' + this.secCategory;

					const frm = new FormData()
					if (this.no != 'new') frm.append('no', this.no)
					frm.append('category', category);
					frm.append('name', this.name);
					frm.append('price', this.price);
					frm.append('status', this.status);
					frm.append('summary', this.summary);
					frm.append('gcode', this.codePrefix+this.gcode);
					frm.append('img',this.imgObj)
					this.insertFlag = true;
					this.$eventBus.$emit('overlay', 'open');

					apiService.postFile(API_URL_METABUS_ITEM_ADMIN_REGIST, frm, (res) => {
						this.$eventBus.$emit('overlay', 'hide');
						this.insertFlag = false;
						let result = res.msg;
						let params = {}
						switch (result) {
							case 'isGcode':
								params = {
									message: '중복된 아이템 코드입니다',
								};
								this.$eventBus.$emit('modalOpen', params);
								break;
							case 'succ':
								let msg = (this.no=='new')?'등록':'수정';
								params = {
									message: '아이템정보가 '+msg+'되었습니다',
                                    doAction:()=>{
										this.$router.push('/admin/metabus/itemList')
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