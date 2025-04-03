<template>
    <div class="cfg-contents">
        <form novalidate @submit.prevent="validate">

            <ul class="title-box">
                <li class="item-title">
                    기본 입력폼 설정

                </li>
                <li class="item">
                </li>
            </ul>
            <div class="form-item">
                <v-select
                    v-model="pcscfg"
                    :items="useList"
                    label="휴대전화 사용여부"
                    outlined
                    :error-messages="pcscfgErrors"
                    dense
                ></v-select>
                <v-expand-transition>
                    <div class="form-sub-box" v-if="pcscfg=='yes'">
                        <v-checkbox
                            v-model="pcsreq"
                            label="휴대전화 필수입력"
                            color="red"
                        ></v-checkbox>
                    </div>
                </v-expand-transition>
            </div>

            <ul class="title-box" style="margin:50px 0 0 0;">
                <li class="item-title">
                    추가 입력폼 설정

                </li>
                <li class="item">
                    <div class="item">
                        <v-switch
                            v-model="extra"
                            label=""
                            inset
                        ></v-switch>
                    </div>
                </li>
            </ul>
            <div class="form-item" v-if="extra" v-for="(item,index) in extraVars" :key="index">
                <ul class="table-box-level">
                    <li class="item-title">
                        <v-text-field
                            v-model="item.name"
                            label="필드명"
                            outlined
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
                <v-expand-transition>
                    <div  v-if="item.type=='select' || item.type=='radio' || item.type=='checkbox'">
                    <div class="table-box-subitem">
                        <div class="item-title">
                            선택 값
                            <i class="fas fa-plus-circle" @click="addSubItem(index)"></i>
                        </div>

                        <ul class="table-box-item">
                            <li v-for="(fieldItem,subIndex) in item.subItems" :key="subIndex">
                                <v-text-field
                                    v-model="fieldItem.name"
                                    label="내용"
                                    outlined
                                    dense
                                ></v-text-field>
                                <i v-if="subIndex>0" class="fas fa-minus-circle"
                                   @click="deleteSubItem(index,subIndex)"></i>
                                <div class="space-item" v-if="subIndex<1"></div>
                            </li>
                        </ul>
                    </div>
                    </div>
                </v-expand-transition>
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
        <v-overlay :value="overlay" style="z-index:100">

            <v-progress-circular
                :size="50"
                color="lime accent-1"
                indeterminate
            ></v-progress-circular>
        </v-overlay>
    </div>
</template>


<script>
	import {validationMixin} from 'vuelidate'
	import {required} from 'vuelidate/lib/validators'
	//import JQ from 'jquery'
	import {
		API_URL_MEMBER_ADMIN_INSERTCONFIG,
		API_URL_MEMBER_ADMIN_GETCONFIG,
		CONFIG_HEADER_POST
	} from '../../../../api/urls';

	export default {
		name: 'JOINCFG',
		mixins: [validationMixin],
		validations: {
			pcscfg: {required},
		},
		computed: {
			pcscfgErrors() {
				const errors = []
				if (!this.$v.pcscfg.$dirty) return errors
				!this.$v.pcscfg.required && errors.push('아이디를 입력하세요')
				return errors
			}
		},
		watch: {
			extra(val) {
				if (val) {
					if (this.extraVars.length < 1) {
						let item = {name: '', req: false, type: 'text', subItems: [{name: '', value: 1}]}
						this.extraVars.push(item)
					}
				}
			}
		},
		data() {
			return {
				pcscfg: 'no',
				useList: [
					{text: '사용', value: 'yes'},
					{text: '사용안함', value: 'no'}
				],
				extraVars: [],
				inputTypeList: [
					{text: '텍스트', value: 'text'},
					{text: '셀렉트박스', value: 'select'},
					{text: '라디오버튼', value: 'radio'},
					{text: '체크박스', value: 'checkbox'},
					{text: '텍스트에어리어', value: 'textarea'},
				],
				pcsreq: false,
				extra: false,
				overlay: false,
			}
		},
		created() {
			this.getData();
		},
		methods: {
			getData() {
				const frm = new FormData()
				frm.append('mode', 'join')
				this.$http.post(API_URL_MEMBER_ADMIN_GETCONFIG, frm, {headers: CONFIG_HEADER_POST}).then(res => {
					console.log(res)

					if (res.data.result == 'succ') {
						let info = res.data.info.content;
						this.pcscfg = info.pcscfg;
						this.pcsreq = (info.pcsreq == 'yes') ? true : false;
						this.extra = (info.extra == 'yes') ? true : false;
						if (this.extra) {
							this.extraVars = info.extraVars;
						}
					}

				});
			},
			addExtraVars() {
				let item = {name: '', req: false, type: 'text', subItems: [{name: '', value: 1}]}
				this.extraVars.push(item)
			},
			deleteExtraVars(index) {
				this.extraVars.splice(index, 1)

			},
			addSubItem(index) {
				let data = this.extraVars[index];
				let subItem = {name: '', value: 1};
				data.subItems.push(subItem);
			},

			deleteSubItem(index, subIndex) {
				let data = this.extraVars[index];
				data.subItems.splice(subIndex, 1);
			},
			validate() {
				if (this.overlay) return;

				this.$v.$touch()
				if (!this.$v.$anyError) {
					if (this.extra) {
						let k = 0;
						for (let item of this.extraVars) {
							if (!item.name) {
								let prm = {
									message: '필드명을 입력하세요',

								};
								this.$eventBus.$emit('modalOpen', prm);
								return;
							} else {
								if (item.type == 'select' || item.type == 'checkbox' || item.type == 'radio') {
									for (let subItem of item.subItems) {
										if (!subItem.name) {
											let prm = {
												message: '내용을 입력하세요',

											};
											this.$eventBus.$emit('modalOpen', prm);
											return;
										}
									}
								}
							}
							k++;
						}
					}
					this.overlay = true;
					const frm = new FormData()
					frm.append('pcscfg', this.pcscfg)
					let pcsreq = (this.pcscfg == 'yes' && this.pcsreq) ? 'yes' : 'no';
					frm.append('pcsreq', pcsreq);
					frm.append('mode', 'join');
					if (this.extra) {
						frm.append('extra', 'yes');
						frm.append('extraVars', JSON.stringify(this.extraVars));
					} else frm.append('extra', 'no');

					this.$http.post(API_URL_MEMBER_ADMIN_INSERTCONFIG, frm, {headers: CONFIG_HEADER_POST}).then(res => {
						this.overlay = false;
						let result = res.data.result;
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
									message: '정보가 변경되었습니다',
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

    .table-box-level {
        display: flex;
        justify-content: space-between;
        padding: 0;
        margin: 0;
        li {
            margin: 0;
            text-align: right;
            &.item-title {
                width: 200px;
                font-size: 11pt;
                text-align: left;

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

        }
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
                min-width: 212px;
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

    .title-box {
        display: flex;
        justify-content: space-between;
        padding: 0;
        margin: 0;
        li {
            margin: 0 0 20px 0;
            text-align: right;
            &.item-title {
                width: 200px;
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