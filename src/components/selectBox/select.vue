<template>
    <div class="select-layout">
        <div class="out-box" @click="showList()">
            <div class="text">{{selectName}}</div>
            <div class="arrow">
                <i class="fas fa-caret-up" v-if="listShow"></i>
                <i class="fas fa-caret-down" v-else></i>
            </div>

        </div>
        <v-expand-transition>
            <ul class="list-box" v-if="listShow">
                <li v-for="(item,index) in itemList" :class="item.gclass" @click="setSelect(item.value)">
                    {{item.text}}
                </li>
            </ul>
        </v-expand-transition>
    </div>
</template>


<script>

	export default {
		props: ["value", "items", "label"],
		watch: {
			items() {
				this.itemList = [];
				this.listShow = false;
				if(this.items) {
					this.itemList = this.items;
					for (let item of this.itemList) {

						if (item.value == this.value) {
							item.gclass = 'active';
							this.selectName = item.text;
						} else {
							item.gclass = '';
						}
					}
				}
			}
		},
		data() {
			return {
				itemList: [],
				listShow: false,
				selectName: '',
			}
		},
		created() {
			this.itemList = [];
			if (this.value) {
				for (let item of this.items) {
            		if (item.value == this.value) {
						item.gclass = 'active';
						this.selectName = item.text;
					} else {
						item.gclass = '';
					}
				}
			} else if (this.label) {
				this.selectName = this.label;
			}
			for (let item of this.items) {
				this.itemList.push(item)
			}

		},
		methods: {
			setSelect(value) {
				let index = 0;
				for (let item of this.itemList) {
					if (item.value == value) {
						item.gclass = 'active';
						this.selectName = item.text;
					} else {
						item.gclass = '';
					}
					this.$set(this.itemList, index, item);
					index++;
				}
				this.listShow = false;
				this.$emit("onSelected", value);
			},
			showList() {
				if (this.listShow) this.listShow = false;
				else this.listShow = true;
			}
		},


	}
</script>

<style lang="scss" scoped="true">
    .select-layout {
        position: relative;
        width: 100%;
        .out-box {
            background: #fff;
            border-radius: 4px;
            height: 40px;
            color: #444;
            border: solid 1px #dcdcdc;
            display: flex;
            cursor: pointer;
            .text {
                width: 90%;
                font-size: 10pt;
                color: #AFB1B7;
                line-height: 40px;
                padding-left: 15px;
            }
            .arrow {
                width: 10%;
                font-size: 12pt;
                line-height: 48px;
                padding-right: 15px;

            }
        }
        .list-box {
            border: solid 1px #dcdcdc;
            position: absolute;
            width: 100%;
            padding: 0;
            margin-top: 5px;
            background: #fff;
            li {
                font-size: 10pt;
                padding: 10px 0 10px 15px;
                text-align: left;
                color: #555;
                cursor: pointer;
                &.active {
                    color: #fff;
                    background: #1B2439;
                }
            }
        }
    }


</style>
