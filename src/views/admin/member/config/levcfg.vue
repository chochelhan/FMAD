<template>
    <div class="cfg-contents">
        <form novalidate @submit.prevent="validate">
            <ul class="table-box">
                <li class="item-title">

                    <v-tooltip right>
                        <template v-slot:activator="{ on, attrs }">
                            <span
                                v-bind="attrs"
                                v-on="on"
                            >자동승급 포인트 사용여부 <i style="color:#2196F3;" class="fas fa-question-circle"></i></span>
                        </template>
                        <span>
                            회원이 보유한 포인트에 따라 회원등급을 자동으로 승급 또는 낙급시키는 기능입니다

                        </span>
                    </v-tooltip>

                </li>

                <li>
                    <div class="item">
                        <v-switch
                            v-model="autolevel"
                            label=""
                            inset
                        ></v-switch>
                    </div>
                </li>
            </ul>

            <div class="add-level-button-box">
                <v-btn
                    color="primary"
                    type="button"
                    rounded
                    outlined

                    @click="addLevel()"
                >
                    회원 등급 추가

                </v-btn>
            </div>

            <div class="form-item" v-for="(level,index) in levels" :key="index">
                <ul class="table-box-level">
                    <li class="item-title">

                        <v-text-field
                            v-model="level.name"
                            label="등급명"
                            outlined
                            dense
                        ></v-text-field>

                    </li>
                    <li class="item-point">
                        <v-text-field
                            v-model="level.point"
                            label="자동승급 포인트"
                            outlined
                            dense
                            :readonly="levels.length == (index+1)"
                            v-if="autolevel"
                        ></v-text-field>

                    </li>
                    <li class="item-button">


                        <v-btn
                            v-if="levels.length != (index+1)"
                            color="red"
                            rounded
                            type="button"
                            outlined
                            @click="deleteLevel(index)"

                        >
                            <i class="fas fa-minus"></i>

                        </v-btn>
                        <div v-else>
                            기본등급
                        </div>
                    </li>
                </ul>
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

	import {
		API_URL_MEMBER_ADMIN_INSERTCONFIG,
		API_URL_MEMBER_ADMIN_GETCONFIG,
		CONFIG_HEADER_POST
	} from '../../../../api/urls';

	export default {
		name: 'LEVELCFG',
		data() {
			return {
				autolevel: false,
				levels: [],
				overlay: false,

			}
		},
		created() {
			this.levels.push({name: '일반회원', point: 0})
			this.getData();
		},
		methods: {
			getData() {
				const frm = new FormData()
				frm.append('mode', 'level')
				this.$http.post(API_URL_MEMBER_ADMIN_GETCONFIG, frm, {headers: CONFIG_HEADER_POST}).then(res => {
					console.log(res)

					if (res.data.result == 'succ') {
						let info = res.data.info.content;
						this.autolevel = (info.autolevel == 'yes') ? true : false;
						this.levels = info.levels;
					}

				});
			},
			addLevel() {
				this.levels.unshift({name: '', point: ''})

			},
			deleteLevel(index) {
				this.levels.splice(index, 1)
			},
			validate() {
				if (this.overlay) return;
				let k = 0;
				for (let item of this.levels) {
					if (!item.name) {
						let prm = {
							message: '등급명을 입력하세요',

						};
						this.$eventBus.$emit('modalOpen', prm);
						return;
					}
					if (this.autolevel) {

						if (!item.point) {
							if ((k + 1) != this.levels.length) {
								let prm = {
									message: '포인트를 입력하세요',

								};
								this.$eventBus.$emit('modalOpen', prm);
								return;
							}
						} else if (item.point) {
							if (isNaN(item.point)) {
								item.point = '';
								let prm = {
									message: '포인트는 숫자만 입력가능합니다',

								};
								this.$eventBus.$emit('modalOpen', prm);
								return;
							}
						}
						if (k > 0) {
							let highLevel = this.levels[k - 1];
							if (highLevel.point <= item.point) {
								let prm = {
									message: '상위 등급보다 포인트값을 더 낮게 해야 합니다',

								};
								this.$eventBus.$emit('modalOpen', prm);
								return;
							}
						}
					}
					k++;
				}
				const frm = new FormData()
				frm.append('mode', 'level')
				if (this.autolevel) {
					frm.append('autolevel', 'yes')
					frm.append('levels', JSON.stringify(this.levels))
				} else {
					frm.append('autolevel', 'no')
					frm.append('levels', '')
				}

				this.overlay = true;
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
</script>

<style lang="scss" scoped="true">
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
            &.item-button {
                width: 150px;
            }

        }
    }
    .form-item {
        margin-bottom:20px;
    }
    .add-level-button-box {
        text-align: right;
        margin: 0 0 20px 0;
    }

    .table-box {
        display: flex;
        justify-content: space-between;
        padding: 0;
        margin: 0 0 30px 0;
        li {
            margin: 20px 0 0 0;
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

        }
    }

    .submit-button-box {
        padding-top: 80px;
    }
</style>