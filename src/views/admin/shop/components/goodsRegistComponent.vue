<template>
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
                                dense
                            ></v-select>
                        </div>
                        <div class="category-item">
                            <v-select
                                v-model="thirdCategory"
                                :items="thirdCategorys"
                                label="3차 카테고리"
                                outlined
                                dense
                            ></v-select>
                        </div>
                    </li>
                    <li>
                        <div class="subject-item">
                            <v-text-field
                                v-model="name"
                                label="상품명"
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

                        <v-radio-group v-model="status" row>
                            <div class="radio-box">
                                <v-radio
                                    value="normal"
                                    label="정상판매"
                                ></v-radio>
                            </div>
                            <div class="radio-box">
                                <v-radio
                                    value="soldout"
                                    label="품절"
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
                            rows="2"
                        ></v-textarea>
                    </li>
                    <li>

                        <v-text-field
                            v-model="keyword"
                            label="추가검색단어"
                            outlined
                            placeholder="','로 구분해서 입력하세요"
                            dense
                        ></v-text-field>
                    </li>

                </ul>


            </div>

            <ul class="title-box" style="margin:50px 0 0 0;">
                <li class="item-title">
                    추가 정보 입력 (제조사, 원산지 등)

                </li>
            </ul>
            <div class="form-item">
                <ul class="table-box-level thead">
                    <li>
                        정보
                    </li>
                    <li class="item-value">
                        내용
                    </li>
                    <li class="item-button">

                    </li>
                </ul>
                <ul class="table-box-level" v-for="(item,index) in extraVars" :key="index">
                    <li>
                        <v-text-field
                            v-model="item.name"
                            label="정보명"
                            outlined
                            dense
                        ></v-text-field>
                    </li>
                    <li class="item-value">
                        <v-text-field
                            v-model="item.value"
                            label="내용"
                            outlined
                            dense
                        ></v-text-field>
                    </li>
                    <li class="item-button">
                        <v-btn
                            color="primary"
                            rounded
                            type="button"
                            outlined
                            v-if="index<1"
                            @click="addExtraVars()"
                        >
                            <i class="fas fa-plus"></i>

                        </v-btn>

                        <v-btn
                            v-else
                            color="red"
                            rounded
                            type="button"
                            outlined
                            @click="deleteExtraVars(index)"

                        >
                            <i class="fas fa-minus"></i>

                        </v-btn>
                    </li>
                </ul>
            </div>
            <ul class="title-box">
                <li class="item-title">
                    상품사진

                </li>
            </ul>
            <div class="form-item" style="padding-bottom:30px;">
                <div class="file-box">
                    <div class="file-names">

                    </div>
                    <div class="file-click wide">

                        <input ref="imgContainer" class="fileInput"
                               multiple @change="onChangeImg" type="file"
                               accept="image/*">
                        <i class="fas fa-images"></i>
                        이미지 찾기 (한번에 여러개의 이미지 선택가능)
                    </div>
                </div>
                <div class="img-preview-box" v-if="resultImgList.length>0">
                    <draggable
                        :list="resultImgList"
                        class="temp-slide-group"
                        ghost-class="ghost"
                        @start="dragging = true"
                        @end="dragging = false"
                    >
                        <div
                            class="list-group-item"
                            v-for="(image,index) in resultImgList"
                            :key="index"
                        >
                            <img :src="image"/>
                            <i class="fas fa-times-circle" @click="deleteTempImg(index)"></i>
                        </div>
                    </draggable>
                </div>
            </div>
            <ul class="title-box">
                <li class="item-title">
                    상품 상세 정보
                </li>
            </ul>
            <div class="form-item" style="padding-bottom:30px;min-height:800px">
                <quill-editor
                    ref="myQuillEditor"
                    class="editor"
                    style="height: 650px"
                    v-model="content"
                    :options="editorOption"
                    @change="onEditorChange($event)"
                ></quill-editor>
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
</template>


<script>
	import {validationMixin} from 'vuelidate'
	import draggable from "vuedraggable";
	import {required, numeric} from 'vuelidate/lib/validators'
	import {
		API_URL_SHOP_GOODS_ADMIN_REGIST_INFO,
		API_URL_SHOP_GOODS_ADMIN_REGIST,
		API_URL_SHOP_GOODS_ADMIN_INSERT_TEMPIMAGE,
		API_URL_SHOP_GOODS_ADMIN_INSERT_MULTI_TEMPIMAGE,
	} from '../../../../api/urls';
	import apiService from "../../../../api/apiService";
	import 'quill/dist/quill.core.css'
	import 'quill/dist/quill.snow.css'
	import 'quill/dist/quill.bubble.css'
	import {quillEditor} from 'vue-quill-editor'


	export default {
		name: 'goodsRegistComponent',
		components: {
			draggable,
			quillEditor,
		},
		props: ["no"],
		mixins: [validationMixin],
		validations: {
			firstCategory: {
				required
			},
			name: {
				required
			},
			price: {
				required,
				numeric
			}
		},
		computed: {
			firstCategoryErrors() {
				const errors = []
				if (!this.$v.firstCategory.$dirty) return errors
				!this.$v.firstCategory.required && errors.push('1차 카테고리를 선택하세요')
				return errors
			},
			nameErrors() {
				const errors = []
				if (!this.$v.name.$dirty) return errors
				!this.$v.name.required && errors.push('상품명을 입력하세요')
				return errors
			},
			priceErrors() {
				const errors = []
				if (!this.$v.price.$dirty) return errors
				!this.$v.price.required && errors.push('판매가격을 입력하세요')
				!this.$v.price.numeric && errors.push('판매가격은 숫자만 입력가능합니다')
				return errors
			},
		},
		watch: {
			firstCategory(val) {
				if (val) {
					this.secCategory = '';
					this.secCategorys = [];
					this.thirdCategory = '';
					this.thirdCategorys = [];
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
				}
			},
			secCategory(val) {
				if (val) {
					this.thirdCategory = '';
					this.thirdCategorys = [];
					for (let item of this.secCategorys) {
						if (val == item.value) {
							if (item.subMenus) {
								for (let subItem of item.subMenus) {
									if (subItem.view == 'yes') {
										this.thirdCategorys.push({value: subItem.code, text: subItem.name});
									}
								}
							}
						}
					}
				}
			},
		},
		data() {
			return {
				firstCategory: '',
				firstCategorys: [],
				secCategory: '',
				secCategorys: [],
				thirdCategory: '',
				thirdCategorys: [],
				name: '',
				summary: '',
				status: 'normal',
				keyword: '',
				price: '',
				extraVars: [],
				insertFlag: false,
				resultImgList: [],
				content:'',
                gcode:'',
				editorOption: {
					theme: 'snow',
					placeholder: '상품상세정보를 입력하세요',
                    modules:{
	                    toolbar: {
		                    container: [
			                    [{'header': [1, 2, 3, 4, 5, 6, false]}],
			                    ['image', 'bold', 'italic', 'underline', 'strike'],
			                    ['blockquote', 'code-block'],
			                    [{'list': 'ordered'}, {'list': 'bullet'}],
			                    [{'script': 'sub'}, {'script': 'super'}],
			                    [{'indent': '-1'}, {'indent': '+1'}],
			                    [{'color': []}, {'background': []}],
			                    ['clean']
		                    ],
		                    handlers: {
			                    image:()=> {
			                    	const input = document.createElement('input');
				                    input.setAttribute('type', 'file');
				                    input.setAttribute('accept', 'image/*');
				                    input.click();

				                    input.onchange = async () => {
					                    const file = input.files[0];
					                    const formData = new FormData();
					                    formData.append('image', file);
					                    formData.append('gcode', this.gcode);
					                    let quill = this.$refs.myQuillEditor.quill;
					                    const range = quill.getSelection(true);
                                        // Insert temporary loading placeholder image
					                    quill.setSelection(range.index + 1);
                                        apiService.postFile(API_URL_SHOP_GOODS_ADMIN_INSERT_TEMPIMAGE, formData, (res) => {
						                    quill.deleteText(range.index, 1);
						                    quill.insertEmbed(range.index, 'image', res.image);
					                    })

				                    }
                                }
		                    }
	                    }
                    }
				},

			}
		},
		created() {
			this.getData();

		},
		methods: {
	        getData() {
				const frm = new FormData()
				if (this.no != 'new') frm.append('no', this.no)
				apiService.post(API_URL_SHOP_GOODS_ADMIN_REGIST_INFO, frm, (res) => {
					if (res.categoryInfo.categorys) {
						for (let item of res.categoryInfo.categorys) {
							if (item.view == 'yes') {
								this.firstCategorys.push({value: item.code, text: item.name, subMenus: item.subMenus})
							}
						}
					}
					this.gcode = res.gcode;
					if (this.no != 'new') {
						this.name = res.goodsInfo.name;
						this.price = res.goodsInfo.price;
						this.status = res.goodsInfo.status;
						let categorys = res.goodsInfo.category.split(',');
						this.firstCategory = categorys[0];
						if (categorys[1]) {
							setTimeout(() => {
								this.secCategory = categorys[1];
								if (categorys[2]) {
									setTimeout(() => {
										this.thirdCategory = categorys[2];
									}, 500)
								}
							}, 500)
						}
						this.summary = res.goodsInfo.summary;
						this.keyword = res.goodsInfo.keyword;
						if (res.goodsInfo.addinfo) {
							this.extraVars = res.goodsInfo.addinfo;
						}
						for (let img of res.goodsInfo.main_imgs) {
							this.resultImgList.push(img);
						}
						this.content = res.goodsInfo.contents;
					} else {
						let item = {name: '', value: ''}
						this.extraVars.push(item)
					}


				});
			},
			addExtraVars() {
				let item = {name: '', value: ''}
				this.extraVars.push(item)
			},
			deleteExtraVars(index) {
				this.extraVars.splice(index, 1)

			},
			onChangeImg() {

				const formData = new FormData();
				formData.append('gcode', this.gcode);

				const imgObj = this.$refs.imgContainer.files;
				let k=1;
				for (let img of imgObj) {
					formData.append('img' + k,img);
					k++;
				}
				formData.append('imgLength', k - 1);

				apiService.postFile(API_URL_SHOP_GOODS_ADMIN_INSERT_MULTI_TEMPIMAGE, formData, (res) => {
					for (let img of res.images) {
				    	this.resultImgList.push(img);
				    }
				})

			},
			deleteTempImg(index) {
				this.resultImgList.splice(index, 1)
			},
			onEditorChange({quill, html, text}) {
				this.content = html
                console.log(this.content)

			},
			validate() {
				if (this.insertFlag) return;
				this.$v.$touch()
				if (!this.$v.$anyError) {
					if(!this.content) {
						let prm = {
							message: '상품상세정보를 입력하세요',
						};
						this.$eventBus.$emit('modalOpen', prm);
						return;
                    }
					/*
					let k = 0;
					for (let item of this.extraVars) {
						if (!item.name) {
							let prm = {
								message: '필드명을 입력하세요',

							};
							this.$eventBus.$emit('modalOpen', prm);
							return;
						}

						k++;
					}
					*/

					let category = this.firstCategory + ',' + this.secCategory + ',' + this.thirdCategory;

					const frm = new FormData()
					if (this.no != 'new') frm.append('no', this.no)
					frm.append('category', category);
					frm.append('name', this.name);
					frm.append('price', this.price);
					frm.append('status', this.status);
					frm.append('summary', this.summary);
					frm.append('keyword', this.keyword);
					frm.append('contents',this.content)
					frm.append('gcode', this.gcode);
					if (this.extraVars.length > 0) frm.append('addinfo', JSON.stringify(this.extraVars));
					frm.append('mainImgs',JSON.stringify(this.resultImgList))
					this.insertFlag = true;
					this.$eventBus.$emit('overlay', 'open');

					apiService.postFile(API_URL_SHOP_GOODS_ADMIN_REGIST, frm, (res) => {
						this.$eventBus.$emit('overlay', 'hide');
						this.insertFlag = false;
						let result = res.result;
						let params = {}
						switch (result) {
							case 'fail':
								params = {
									message: '시스템에러',
								};
								this.$eventBus.$emit('modalOpen', params);
								break;
							case 'succ':
								params = {
									message: '상품정보가 등록되었습니다',
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
        border: solid 1px #ccc;
        background: #fafafa;
        .temp-slide-group {
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            padding: 7px;
            .list-group-item {
                width: 18%;
                margin: 7px;
                cursor: move;
                position: relative;
                height: 160px;
                overflow-y: hidden;
                img {
                    width: 100%;

                }
                .fa-times-circle {
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    cursor: pointer;
                    font-size: 14pt;
                    color: #fff;

                }
                .fa-link {
                    position: absolute;
                    top: 5px;
                    left: 5px;
                    cursor: pointer;
                    color: #fff;
                    font-size: 13pt;

                }
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
            &.wide {
                width: 740px;
            }
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