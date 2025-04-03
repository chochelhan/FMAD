<template>
    <div class="page-contents">
        <div class="form-box">
            <form novalidate @submit.prevent="validate">
                <div class="sub-title">기본 설정</div>
                <ul class="form-item">
                    <li class="item-list" id="bid">
                        <v-text-field
                            v-model="bid"
                            label="게시판 아이디"
                            required
                            :readonly="bidReadonly"
                            @input="bidErrors()"
                            @blur="bidErrors()"
                            :error-messages="bidError"
                            outlined
                            dense
                        ></v-text-field>
                    </li>
                    <li class="item-list" id="name">
                        <v-text-field
                            v-model="name"
                            label="게시판 이름"
                            required
                            @input="$v.name.$touch()"
                            @blur="$v.name.$touch()"
                            :error-messages="nameErrors"
                            outlined
                            dense
                        ></v-text-field>
                    </li>
                    <li class="item-list" id="btype">
                        <v-select
                            v-model="btype"
                            :items="bTypeList"
                            label="게시판 타입"
                            required
                            @input="$v.btype.$touch()"
                            @blur="$v.btype.$touch()"
                            :error-messages="btypeErrors"
                            outlined
                            dense
                        ></v-select>
                    </li>
                    <li class="item-list">
                        <v-select
                            v-model="reple"
                            :items="repleList"
                            label="댓글 사용 여부"
                            outlined
                            dense
                        ></v-select>
                    </li>
                </ul>
                <div class="sub-title">이미지 및 첨부파일</div>
                <div class="form-item">
                    <ul class="form-item-box">
                        <li class="item-list">
                            <div class="item-title">
                                이미지 및 첨부파일 사용여부
                            </div>
                            <div class="item-switch">
                                <v-switch
                                    v-model="fileUse"
                                    label=""
                                    inset
                                ></v-switch>
                            </div>

                        </li>
                    </ul>
                    <v-expand-transition>
                        <div v-if="fileUse">
                            <div class="table-box-divice"></div>
                            <ul class="table-box-level switch-ul">
                                <li class="item-title">
                                    이미지
                                </li>
                                <li class="switch-box">

                                    <v-switch
                                        v-model="atimg"
                                        label=""
                                        inset
                                        color="lime"
                                    ></v-switch>
                                </li>

                            </ul>
                            <ul class="table-box-level">
                                <li class="item-title">
                                    첨부파일

                                </li>
                                <li class="switch-box">
                                    <v-switch
                                        v-model="atfile"
                                        label=""
                                        inset
                                        color="lime"
                                    ></v-switch>

                                </li>
                            </ul>
                        </div>
                    </v-expand-transition>
                </div>

                <div class="sub-title">카테고리</div>
                <div class="form-item">
                    <ul class="form-item-box">
                        <li class="item-list">
                            <div class="item-title">
                                카테고리 사용여부
                            </div>
                            <div class="item-switch">
                                <v-switch
                                    v-model="category"
                                    label=""
                                    inset
                                ></v-switch>
                            </div>

                        </li>
                    </ul>
                    <v-expand-transition>
                        <div v-if="category">
                            <div class="table-box-divice"></div>
                            <ul class="table-box-level" v-for="(item,index) in categorys" :key="index">
                                <li class="item-title" :id="index+'category'">
                                    <v-text-field
                                        v-model="item.name"
                                        label="카테고리 명"
                                        outlined
                                        @input="categoryToch(item)"
                                        @blur="categoryToch(item)"
                                        :error-messages="item.errors"
                                        dense
                                    ></v-text-field>
                                </li>
                                <li>
                                    <v-text-field
                                        v-model="item.code"
                                        label="카테고리 코드"
                                        outlined
                                        readonly
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
                                        @click="addCategorys()"
                                    >
                                        <i class="fas fa-plus"></i>

                                    </v-btn>

                                    <v-btn
                                        v-else
                                        color="red"
                                        rounded
                                        type="button"
                                        outlined
                                        @click="deleteCategorys(index)"

                                    >
                                        <i class="fas fa-minus"></i>

                                    </v-btn>
                                </li>
                            </ul>
                        </div>
                    </v-expand-transition>
                </div>


                <div class="sub-title">추가 항목 설정</div>
                <div class="form-item">
                    <ul class="form-item-box">
                        <li class="item-list">
                            <div class="item-title">
                                추가항목 사용여부
                            </div>
                            <div class="item-switch">
                                <v-switch
                                    v-model="extra"
                                    label=""
                                    inset
                                ></v-switch>
                            </div>

                        </li>
                    </ul>
                    <v-expand-transition>
                        <div v-if="extra">
                            <div class="table-box-divice"></div>
                            <div v-for="(item,index) in extraVars" :key="index">
                                <ul class="table-box-level">
                                    <li class="item-title" :id="index+'extraField'">
                                        <v-text-field
                                            v-model="item.name"
                                            label="필드명"
                                            outlined
                                            @input="extraFieldTouch(item)"
                                            @blur="extraFieldTouch(item)"
                                            :error-messages="item.extraFieldErrors"
                                            dense
                                        ></v-text-field>
                                    </li>
                                    <li>
                                        <v-checkbox class="item-required"
                                                    v-model="item.req"
                                                    label="필수입력"
                                                    color="red"
                                        ></v-checkbox>
                                    </li>
                                    <li class="item-type">
                                        <v-select
                                            v-model="item.type"
                                            :items="inputTypeList"
                                            label="필드타입"
                                            outlined
                                            dense
                                        ></v-select>
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
                                <div v-if="item.type=='select' || item.type=='radio' || item.type=='checkbox'">
                                    <div class="table-box-subitem">
                                        <div class="item-title">
                                            선택 값
                                            <i class="fas fa-plus-circle" @click="addSubItem(index)"></i>
                                        </div>

                                        <ul class="table-box-item">
                                            <li v-for="(fieldItem,subIndex) in item.subItems" :key="subIndex"
                                                :id="index+'_'+subIndex+'_extraField'">
                                                <v-text-field
                                                    v-model="fieldItem.name"
                                                    label="내용"
                                                    outlined
                                                    @input="subExtraFieldTouch(fieldItem)"
                                                    @blur="subExtraFieldTouch(fieldItem)"
                                                    :error-messages="fieldItem.subItemErrors"
                                                    dense
                                                ></v-text-field>
                                                <i v-if="subIndex>0" class="fas fa-minus-circle"
                                                   @click="deleteSubItem(index,subIndex)"></i>
                                                <div class="space-item" v-if="subIndex<1"></div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </v-expand-transition>
                </div>

                <div class="sub-title">게시글 권한</div>
                <div class="form-item">
                    <ul class="form-item-box">
                        <li class="item-list">
                            <div class="item-title">
                                게시글 권한 사용여부
                            </div>
                            <div class="item-switch">
                                <v-switch
                                    v-model="bauthUse"
                                    label=""
                                    inset
                                ></v-switch>
                            </div>

                        </li>
                    </ul>
                    <v-expand-transition>
                        <div v-if="bauthUse">
                            <div class="table-box-divice"></div>
                            <ul class="table-box-level">
                                <li class="item-title">
                                    게시글 목록
                                </li>
                                <li class="select-box">
                                    <v-select
                                        v-model="blauth"
                                        :items="bAuthList"
                                        label="사용가능 회원등급"
                                        outlined
                                        dense
                                    ></v-select>
                                </li>
                            </ul>
                            <ul class="table-box-level">
                                <li class="item-title">
                                    게시글 상세
                                </li>
                                <li class="select-box" v-if="!bvauthText">
                                    <v-select
                                        v-model="bvauth"
                                        :items="bAuthList"
                                        label="사용가능 회원등급"
                                        outlined
                                        dense
                                    ></v-select>
                                </li>
                                <li class="desc-box" v-if="bvauthText">
                                    {{bvauthText}}
                                </li>
                            </ul>
                            <ul class="table-box-level">
                                <li class="item-title">
                                    게시글 쓰기
                                </li>
                                <li class="select-box" v-if="!bwauthText">
                                    <v-select
                                        v-model="bwauth"
                                        :items="bAuthList"
                                        label="사용가능 회원등급"
                                        outlined
                                        dense
                                    ></v-select>
                                </li>
                                <li class="desc-box" v-if="bwauthText">
                                    {{bwauthText}}
                                </li>
                            </ul>
                        </div>
                    </v-expand-transition>
                </div>
                <!--div class="sub-title" v-if="reple=='yes'">댓글 권한</div>
                <div class="form-item">
                    <ul class="form-item-box">
                        <li class="item-list">
                            <div class="item-title">
                                댓글 권한 사용여부
                            </div>
                            <div class="item-switch">
                                <v-switch
                                    v-model="rauthUse"
                                    label=""
                                    inset
                                ></v-switch>
                            </div>

                        </li>
                    </ul>
                    <v-expand-transition>
                        <div v-if="rauthUse">
                            <div class="table-box-divice"></div>
                            <ul class="table-box-level" v-if="!rauthText">
                                <li class="item-title">
                                    댓글 목록
                                </li>
                                <li class="select-box">
                                    <v-select
                                        v-model="rlauth"
                                        :items="bAuthList"
                                        label="사용가능 회원등급"
                                        outlined
                                        dense
                                    ></v-select>
                                </li>
                            </ul>
                            <ul class="table-box-level" v-if="!rauthText">
                                <li class="item-title">
                                    댓글 쓰기
                                </li>
                                <li class="select-box">
                                    <v-select
                                        v-model="rwauth"
                                        :items="bAuthList"
                                        label="사용가능 회원등급"
                                        outlined
                                        dense
                                    ></v-select>
                                </li>
                            </ul>
                            <div class="rauth-text" v-if="rauthText">{{rauthText}}</div>
                        </div>
                    </v-expand-transition>
                </div>
                <div class="sub-title">포인트</div>
                <div class="form-item">
                    <ul class="form-item-box">
                        <li class="item-list">
                            <div class="item-title">
                                포인트 사용여부
                            </div>
                            <div class="item-switch">
                                <v-switch
                                    v-model="pointUse"
                                    label=""
                                    inset
                                ></v-switch>
                            </div>

                        </li>
                    </ul>
                    <v-expand-transition>
                        <div v-if="pointUse">
                            <div class="table-box-divice"></div>
                            <ul class="table-box-level">
                                <li class="item-title">
                                    게시글 쓰기
                                </li>
                                <li class="select-box">
                                    <v-text-field
                                        v-model="bpoint"
                                        label="게시글 쓰기 포인트"
                                        outlined
                                        dense
                                        @input="bpointTouch()"
                                        @blur="bpointTouch()"
                                        :error-messages="bpointErrors"
                                    ></v-text-field>

                                </li>

                            </ul>
                            <ul class="table-box-level">
                                <li class="item-title">
                                    댓글 쓰기

                                </li>
                                <li class="select-box">
                                    <v-text-field
                                        v-model="rpoint"
                                        label="댓글 쓰기 포인트"
                                        outlined
                                        @input="rpointTouch()"
                                        @blur="rpointTouch()"
                                        :error-messages="rpointErrors"
                                        dense
                                    ></v-text-field>

                                </li>
                            </ul>
                        </div>
                    </v-expand-transition>
                </div-->

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
	import {required} from 'vuelidate/lib/validators'
	import JQ from 'jquery'
	import {
		API_URL_BOARD_ADMIN_INSERT,
		API_URL_BOARD_ADMIN_INFO,
		API_URL_BOARD_ADMIN_CHECK_BID,
		CONFIG_HEADER_POST
	} from '../../../api/urls';

	export default {
		name: 'boardRegist',
		mixins: [validationMixin],
		validations: {
			bid: {required},
			name: {required},
			btype: {required},
		},
		computed: {

			nameErrors() {
				const errors = []
				if (!this.$v.name.$dirty) return errors
				!this.$v.name.required && errors.push('게시판 이름을 입력하세요')
				return errors
			},
			btypeErrors() {
				const errors = []
				if (!this.$v.btype.$dirty) return errors
				!this.$v.btype.required && errors.push('게시판 타입을 선택하세요')
				return errors
			}
		},
		watch: {
			category(val) {
				if (val) {
					if (this.categorys.length < 1) {
						let code = this.getCategoryCode();
						let item = {name: '', code: code, errors: [], autoFocus: false}
						this.categorys.push(item)
					}
				}
			},
			btype(val) {
				if (val == 'onetoone' || val == 'layer') {

					let text = '';
					switch (val) {
						case 'onetoone':
							text = '1:1문의형';
							this.bwauthText = ''
							this.bvauthText = '게시글 작성자와 관리자만이 확인 가능합니다';
							this.rauthText = '관리자만이 댓글 작성이 가능합니다';

							this.repleList = [
								{text: '사용 (' + text + ' 게시판 타입에 따른 자동설정)', value: 'yes'},
							];
							this.reple = 'yes';
							this.bauthUse = true;
							this.rauthUse = true;
							break;
						default:
							text = '레이어형';
							this.bwauthText = '관리자만이 글 작성이 가능합니다';
							this.bvauthText = '모든 사용자가 확인 가능합니다';
							this.rauthText = '관리자만이 댓글 작성이 가능합니다';
							this.repleList = [
								{text: '사용안함 (' + text + ' 게시판 타입에 따른 자동설정)', value: 'no'},
							];
							this.reple = 'no';
							this.bauthUse = true;
							this.rauthUse = false;
							break;
					}

				} else {
					this.repleList = [
						{text: '사용', value: 'yes'},
						{text: '사용안함', value: 'no'},
					];
					this.bwauthText = ''
					this.bvauthText = '';
					this.rauthText = '';
					switch (val) {
						case 'gallery':
						case 'blog':
							this.fileUse = true;
							this.atimg = true;
							break;

					}

				}
			},
			fileUse(val) {
				if (!val && (this.btype == 'gallery' || this.btype == 'blog')) {
					let params = {
						message: '갤러리형 또는 블로그형 게시판 타입은 반드시 이미지를 사용해야 합니다',
						doAction: () => {
							this.fileUse = true;
						}
					};
					this.$eventBus.$emit('modalOpen', params);

				}
			},
			atimg(val) {
				if (!val && (this.btype == 'gallery' || this.btype == 'blog')) {
					let params = {
						message: '갤러리형 또는 블로그형 게시판 타입은 반드시 이미지를 사용해야 합니다',
						doAction: () => {
							this.atimg = true;
						}
					};
					this.$eventBus.$emit('modalOpen', params);

				}
			},
			bauthUse(val) {
				if (!val && (this.btype == 'onetoone' || this.btype == 'layer')) {
					let params = {
						message: '1:1문의형 또는 레이어형 게시판 타입은 게시글 권한설정을 반드시 사용해야 합니다',
						doAction: () => {
							this.bauthUse = true;
						}
					};
					this.$eventBus.$emit('modalOpen', params);

				}
			},
			rauthUse(val) {
				if (val && (this.btype == 'layer')) {
					let params = {
						message: '레이어형 게시판 타입은 댓글 권한설정을사용할수 없습니다',
						doAction: () => {
							this.rauthUse = false;
						}
					};
					this.$eventBus.$emit('modalOpen', params);

				}
			},
			extra(val) {
				if (val) {
					if (this.extraVars.length < 1) {
						let item = {
							name: '',
							req: false,
							extraFieldErrors: [],
							type: 'text',
							subItems: [{name: '', subItemErrors: []}]
						}
						this.extraVars.push(item)
					}
				}
			}
		},
		data() {
			return {
				no: '',
				bTypeList: [
					{text: '리스트형', value: 'list'},
					{text: '갤러리형', value: 'gallery'},
					{text: '블로그형', value: 'blog'},
					{text: '레이어형(고객 Q&A 형태의 게시판에 적당합니다)', value: 'layer'},
					{text: '1:1문의형', value: 'onetoone'},

				],
				btype: '',
				bid: '',
				name: '',
				reple: 'yes',
				repleList: [
					{text: '사용', value: 'yes'},
					{text: '사용안함', value: 'no'},

				],
				bidReadonly:false,
				bauthUse: false,
				rauthUse: false,
				category: false,
				categorys: [],
				blauth: '0',
				bvauth: '0',
				bwauth: '0',
				bvauthText: '',
				bwauthText: '',
				rlauth: '0',
				rauthText: '',
				rwauth: '0',
				bAuthList: [{text: '전체 이용가능', value: '0'}],
				baction: '',
				bActionList: [],
				pointUse: false,
				bpoint: 0,
				rpoint: 0,
				bpointErrors: [],
				rpointErrors: [],
				fileUse: false,
				atimg: false,
				atfile: false,
				extraVars: [],
				inputTypeList: [
					{text: '텍스트', value: 'text'},
					{text: '셀렉트박스', value: 'select'},
					{text: '라디오버튼', value: 'radio'},
					{text: '체크박스', value: 'checkbox'},
					{text: '텍스트에어리어', value: 'textarea'},
				],
				extra: false,
				bpointSucc: false,
				rpointSucc: false,
				bidSucc: false,
				bidError: [],

			}
		},
		created() {
			this.no = this.$route.params.no;
			if(this.no!='new') {
				this.bidReadonly = true;
				this.bidSucc = true;

            }
			this.getData();
		},
		methods: {
			bidErrors() {
				if (this.no == 'new') {
					this.bidSucc = false;
					if (!this.bid) {
						this.bidError = []
						this.bidError.push('게시판 아이디를 입력하세요')
                        return;
					}
					let regType = /^[A-Za-z0-9+]{5,15}$/;
					if (!regType.test(this.bid)) {
						this.bidError = []
						this.bidError.push('게시판 아이디는 5~12자의 영문과 숫자만 가능합니다')
						return;

					}
					if (this.bid) {
						const frm = new FormData()
						frm.append('bid', this.bid)
						this.$http.post(API_URL_BOARD_ADMIN_CHECK_BID, frm, {headers: CONFIG_HEADER_POST}).then(res => {
							this.bidError = []
							if (res.data.result != 'succ') {
								this.bidError.push('중복된 게시판 아이디 입니다')
							} else {
								this.bidSucc = true;

							}
						});

					}

				}
			},
			getData() {
				const frm = new FormData()
				if (this.no != 'new') frm.append('no', this.no)
				this.$http.post(API_URL_BOARD_ADMIN_INFO, frm, {headers: CONFIG_HEADER_POST}).then(res => {
					console.log(res.data)
					if (res.data.result == 'succ') {
						this.bAuthList = [];
						if (res.data.levels.length > 0) {
							let level = res.data.levels.length;
							for (let item of res.data.levels) {
								this.bAuthList.unshift({text: item.name, value: level.toString()})
								level--;
							}
							this.bAuthList.unshift({text: '전체 이용가능', value: '0'});

						} else {
							this.bAuthList.push({text: '전체 이용가능', value: '0'});
							this.bAuthList.push({text: '일반회원', value: '1'})

						}
						if (this.no != 'new') {
							let info = res.data.info;
							console.log(info)
							this.bid = info.bid;
							this.name = info.name;
							this.btype = info.btype;
							this.reple = info.repleUse;

							if (info.fileUse == 'yes') {
								this.fileUse = true;

								this.atfile = (info.fileVars.atfile == 'yes') ? true : false;
								this.atimg = (info.fileVars.atimg == 'yes') ? true : false;
							} else {
								this.fileUse = false;
							}

							if (info.categoryUse == 'yes') {
								this.category = true;
								this.categorys = info.categorys;
							} else {
								this.category = false;
							}
							if (info.extraUse == 'yes') {
								this.extra = true;
								this.extraVars = info.extraVars;
							} else this.extra = false;

							if (info.bauthUse == 'yes') {
								this.bauthUse = true;
								this.blauth = info.bauthVars.blauth;
								this.bvauth = info.bauthVars.bvauth;
								this.bwauth = info.bauthVars.bwauth;
							} else {
								this.bauthUse = false;
							}
							if (info.rauthUse == 'yes') {
								this.rauthUse = true;
								this.rlauth = info.rauthVars.rlauth;
								this.rwauth = info.rauthVars.rwauth;
							} else {
								this.rauthUse = false;
							}
							if (info.pointUse == 'yes') {
								this.pointUse = true;
								this.bpoint = info.pointVars.bpoint;
								this.rpoint = info.pointVars.rpoint;
							} else {
								this.pointUse = false;
							}

						}

					}

				});
			},
			getCategoryCode() {
				let code = 'brd' + (Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000);
				for (let item of this.categorys) {
					if (item.code == code) {
						code = this.getCategoryCode();
					}
				}
				return code;
			},
			addCategorys() {
				let code = this.getCategoryCode();
				let item = {name: '', code: code, errors: [], autoFocus: false}
				this.categorys.push(item)
			},
			deleteCategorys(index) {
				this.categorys.splice(index, 1)

			},
			categoryToch(item) {
				item.errors = [];
				if (!item.name) {
					item.errors.push('카테고리명을 입력하세요')
				}
			},
			bpointTouch() {
				this.bpointErrors = [];
				this.bpointSucc = true;
				let point = this.bpoint;
				if (!point && point != 0) {
					this.bpointSucc = false;
					this.bpointErrors.push('게시글 쓰기 포인트를 입력하세요')
					return;
				}
				if (isNaN(point)) {
					this.bpointSucc = false;
					this.bpointErrors.push('게시글 쓰기 포인트는 숫자만 입력가능합니다')
					return;
				}

			},
			rpointTouch() {
				this.rpointErrors = [];
				this.rpointSucc = true;
				let point = this.rpoint;
				if (!point && point != 0) {
					this.rpointSucc = false;
					this.rpointErrors.push('댓글 쓰기 포인트를 입력하세요')
					return;
				}
				if (isNaN(point)) {
					this.rpointSucc = false;
					this.rpointErrors.push('댓글 쓰기 포인트는 숫자만 입력가능합니다')
					return;
				}
			},
			addExtraVars() {
				let item = {
					name: '',
					req: false,
					extraFieldErrors: [],
					type: 'text',
					subItems: [{name: '', subItemErrors: []}]
				}
				this.extraVars.push(item)
			},
			deleteExtraVars(index) {
				this.extraVars.splice(index, 1)

			},
			addSubItem(index) {
				let data = this.extraVars[index];
				let subItem = {name: '', subItemErrors: []};
				data.subItems.push(subItem);
			},

			deleteSubItem(index, subIndex) {
				let data = this.extraVars[index];
				data.subItems.splice(subIndex, 1);
			},
			extraFieldTouch(item) {
				item.extraFieldErrors = [];
				if (!item.name) {
					item.extraFieldErrors.push('필드명을 입력하세요');
				}
			},
			subExtraFieldTouch(item) {
				item.subItemErrors = [];
				if (!item.name) {
					item.subItemErrors.push('내용을 입력하세요');
				}
			},
			validate(e) {
				this.$v.$touch()
                if(!this.bidSucc) {
					this.bidErrors();
			    }
				if (this.$v.$anyError) {

					for (let fld in this.$v.$params) {
						if (!this.$v[fld].required) {
                            let top = JQ('#' + fld).offset().top - 170;
							if (top < 0) top = 0;
							JQ('html,body').animate({
								scrollTop: top,
							}, 200);
							break;

						}
					}

					return;
				}
				if(!this.bidSucc) {
					let top = JQ('#bid').offset().top - 170;
					if (top < 0) top = 0;
					JQ('html,body').animate({
						scrollTop: top,
					}, 200);
					return;
				}
				if (!this.$v.$anyError) {
					let moveItem = '';
					let validateFlag = true;
					if (this.category) {
						let k = 0;
						for (let item of this.categorys) {
							if (!item.name) {
								item.errors.push('카테고리명을 입력하세요');
								validateFlag = false;
								if (!moveItem) moveItem = k + 'category';

							}
							k++;
						}
					}

					if (this.extra) {
						let k = 0;
						for (let item of this.extraVars) {
							if (!item.name) {
								item.extraFieldErrors.push('필드명을 입력하세요');
								validateFlag = false;

								if (!moveItem) moveItem = k + 'extraField';
							} else {
								if (item.type == 'select' || item.type == 'checkbox' || item.type == 'radio') {
									let j = 0;
									for (let subItem of item.subItems) {
										if (!subItem.name) {
											subItem.subItemErrors.push('내용을 입력하세요');
											validateFlag = false;
											if (!moveItem) moveItem = k + '_' + j + '_extraField';
										}
										j++;
									}
								}
							}
							k++;
						}
					}
					if (this.pointUse) {
						this.bpointTouch();
						this.rpointTouch();
						if (!this.rpointSucc || !this.bpointSucc) {
							validateFlag = false;
						}

					}
					if (moveItem) {
						let top = JQ('#' + moveItem).offset().top - 170;
						if (top < 0) top = 0;
						JQ('html,body').animate({
							scrollTop: top,
						}, 200);
						return;
					}
					if (!validateFlag) return;

					this.$eventBus.$emit('overlay', 'open');
					const frm = new FormData()
					frm.append('bid', this.bid)
					frm.append('name', this.name);
					frm.append('btype', this.btype);
					if (this.no != 'new') frm.append('no', this.no)
					if (this.fileUse) {
						frm.append('fileUse', 'yes');
						let atfile = (this.atfile) ? 'yes' : 'no';
						let atimg = (this.atimg) ? 'yes' : 'no';

						frm.append('fileVars', JSON.stringify({atfile: atfile, atimg: atimg}));
					} else frm.append('fileUse', 'no');

					if (this.extra) {
						frm.append('extraUse', 'yes');
						frm.append('extraVars', JSON.stringify(this.extraVars));
					} else frm.append('extraUse', 'no');


					if (this.category) {
						frm.append('categoryUse', 'yes');
						frm.append('categorys', JSON.stringify(this.categorys));
					} else frm.append('categoryUse', 'no');

					if (this.pointUse) {
						frm.append('pointUse', 'yes');
						frm.append('pointVars', JSON.stringify({bpoint: this.bpoint, rpoint: this.rpoint}));
					} else frm.append('pointUse', 'no');

					if (this.bauthUse) {
						frm.append('bauthUse', 'yes');
						frm.append('bauthVars', JSON.stringify({
							blauth: this.blauth,
							bvauth: this.bvauth,
							bwauth: this.bwauth
						}));
					} else frm.append('bauthUse', 'no');

					if (this.rauthUse) {
						frm.append('rauthUse', 'yes');
						frm.append('rauthVars', JSON.stringify({rlauth: this.rlauth, rwauth: this.rwauth}));
					} else frm.append('rauthUse', 'no');

					frm.append('repleUse', this.reple);

					this.$http.post(API_URL_BOARD_ADMIN_INSERT, frm, {headers: CONFIG_HEADER_POST}).then(res => {
						this.$eventBus.$emit('overlay', 'hide');
						let result = res.data.result;
						let params = {}
						switch (result) {
							case 'fail':
								params = {
									message: '시스템에러',
								};
								this.$eventBus.$emit('modalOpen', params);
								break;
							case 'isBid':
								params = {
									message: '동일한 게시판 아이디가 존재합니다',
								};
								this.$eventBus.$emit('modalOpen', params);
								break;
							case 'succ':
								this.$eventBus.$emit('boardUpdate');
								let msg = (this.no != 'new') ? '정보가 변경되었습니다' : '게시판이 생성되었습니다';
								params = {
									message: msg,
									doAction: () => {
										if (this.no != 'new') {
											this.$router.go(-1);
										} else {
											this.$router.push('/admin/boardList');

										}
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
    .form-box {
        padding: 0;
        width: 900px;
        margin: 0;
        .sub-title {
            font-weight: bold;
            font-size: 11pt;
            text-align: left;
            padding: 20px 0 20px 0;
        }
    }

    .submit-button-box {
        padding-top: 80px;
    }

    .table-box-subitem {
        display: flex;
        padding: 30px 20px 30px 20px;
        border-top: solid 1px #777;
        .item-title {
            min-width: 120px;
            padding-top: 8px;
            font-size: 11pt;
            font-weight: bold;
            .fa-plus-circle {
                position: relative;
                top: 3px;
                margin: 0 0 0 8px;
                font-size: 17pt;
                color: #2196F3;
                cursor: pointer;

            }
        }
        .table-box-item {
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
            padding: 0;
            margin: 0;
            width: auto;
            li {
                max-width: 33%;
                min-width: 220px;
                width: 33%;
                margin: 0;
                display: flex;
                i {
                    font-size: 17pt;
                    margin: 8px;
                    color: #FF9800;
                    cursor: pointer;
                }
                .space-item {
                    width: 45px;
                }

            }
        }
    }

    .form-item {
        .item-list {
            display: flex;
            justify-content: space-between;
            &#bid {
                display: block;
                .bid-check {
                    font-size: 9pt;
                    color: #B71C1C;
                    font-weight: bold;
                    margin: -20px 0 10px 0;

                }
            }
            .item-title {
                font-size: 11pt;
                font-weight: bold;
                color: #888;
            }
            .item-switch {
                margin-top: -20px;
            }
            .item {

            }
            .item-flex {
                width: 30%;
            }
            .item-flex-sub-title {
                font-size: 11pt;
                width: 100px;
                padding-top: 5px;
            }
        }
    }

    .table-box-divice {
        border-top: solid 1px #777;
        margin-bottom: 30px;
    }

    .table-box-level {
        display: flex;
        justify-content: space-between;
        padding: 0 20px;
        margin: 0;
        li {
            margin: 0;
            text-align: right;
            &.item-title {
                width: 200px;
                font-size: 11pt;
                text-align: left;

            }
            &.switch-box {
                margin: -20px -10px 0 0;
            }
            .item-required {
                margin-top: 2px;
            }
            &.item-type {
                width: 180px;
            }
            &.item-button {
                width: 80px;
            }
            &.select-box {
                width: 300px;
            }
            &.desc-box {
                font-size: 11pt;
                color: #B71C1C;
                margin-bottom: 40px;
            }

        }
    }

    .rauth-text {
        font-size: 11pt;
        color: #B71C1C;
        text-align: center;
        padding-bottom: 30px;

    }


</style>