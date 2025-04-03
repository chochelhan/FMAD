<template>
    <div>
        <div class="main-content">

            <ul class="dcblock-ul">
                <li class="dcblock-li" v-for="(dcblock,index) in activeDcBlockList" :key="dcblock.id"
                     :style="dcblock.section.style">
                    <div class="content-layout-box" :style="frameData.contentStyle">
                        <div class="content-layout" :style="dcblock.group.style">
                            <ul :class="'dcblock-list '+dcblock.code">
                                <li v-for="(item,itemIndex) in dcblock.list" class="dcblock-item">
                                    <div class="dcblock-item-div" v-if="item.ctype!='cols'" :key="item.id">

                                        <div class="contentData" :style="item.style">
                                            <div v-if="item.ctype=='text'" v-html="item.content.text">
                                            </div>
                                            <div v-else-if="item.ctype=='img'">
                                                <img :src="item.content.imgUrl" style="max-width:100%;">
                                            </div>

                                            <div class="icon-table-box" v-else-if="item.ctype=='icon'">
                                                <div class="icon-box" :style="item.content.iconBoxStyle"
                                                     v-if="item.content.iconBoxUse=='yes'">
                                                    <i :class="item.content.iconClass"
                                                       :style="item.content.iconStyle"></i>
                                                </div>
                                                <i :class="item.content.iconClass" :style="item.content.iconStyle"
                                                   v-else></i>
                                            </div>
                                            <div v-else-if="item.ctype=='board'">
                                                <!--dcArticleList v-if="item.board.vtype=='list'"
                                                               :bid="item.board.bid"></dcArticleList-->
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="item.ctype=='cols'" :style="item.style">
                                        <ul class="dcmenu-box-table-ul">
                                            <li class="dcmenu-box-table-li" v-for="(col,colIndex) in item.cols"
                                                :key="col.id">
                                                <div class="contentData" :style="col.style">
                                                    <div v-if="col.ctype=='text'" v-html="col.content.text">
                                                    </div>
                                                    <div v-else-if="col.ctype=='img'">
                                                        <img :src="col.content.imgUrl" style="max-width:100%;">
                                                    </div>

                                                    <div v-else-if="col.ctype=='icon'">
                                                        <div :style="col.content.iconBoxStyle"
                                                             v-if="col.content.iconBoxUse=='yes'">
                                                            <i :class="col.content.iconClass"
                                                               :style="col.content.iconStyle"></i>
                                                        </div>
                                                        <i :class="col.content.iconClass"
                                                           :style="col.content.iconStyle"
                                                           v-else></i>
                                                    </div>
                                                    <div v-else-if="col.ctype=='board'">
                                                        <!-- dcArticleList v-if="col.board.vtype=='list'"
                                                                       :bid="col.board.bid"></dcArticleList -->
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>

                                </li>
                            </ul>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>


<script>
	import {mapActions, mapGetters} from "vuex";
	import JQ from 'jquery'
//	import dcArticleList from './dcArticleList'


	export default {
		name: 'pageContent',
        components: {
//			dcArticleList
		},
		watch: {
			getEditUpdate(val) {
				if(val) {
					this.activeDcBlockList = this.mapContentData;
					this.frameData = this.mapBaseData;
                }
            }
		},
		computed: {
			...mapGetters('riverflowDA', ["mapContentData","mapBaseData","getEditUpdate"])
		},
		data() {
			return {
				frameData: {},
				activeDcBlockList: [],

			}

		},
		created() {
			this.activeDcBlockList = this.mapContentData;
			this.frameData = this.mapBaseData;

		},
		methods: {

		},
		mounted() {

		},
		updated() {

		}
	}
</script>
<style lang="scss" scoped="true">
    .main-content {
        width: 100%;
        min-height: 500px;
        margin: auto;
        padding: 0;
        margin-bottom: 100px;
        .dcblock-ul {
            padding: 0;
            width: 100%;
            .dcblock-li {
                width: 100%;
                min-height: 50px;
                .content-layout-box {
                    width: 1100px;
                    margin: auto;
                    .content-layout {
                        width: 100%;
                        height: 100%;
                        .dcblock-list {
                            padding: 0;
                            display: flex;
                            height: 100%;
                            & > li {
                                height: 100%;
                                min-height: 100px;
                            }
                            &.b4 {
                                .dcblock-item {

                                    width: 25%;
                                }
                            }
                            &.b3 {
                                .dcblock-item {

                                    width: 33.33333%;

                                }
                            }
                            &.b2 {
                                .dcblock-item {

                                    width: 50%;

                                }
                            }
                            &.b2r {
                                .dcblock-item {
                                    &:first-child {
                                        width: 33.3333%;
                                    }
                                    &:last-child {
                                        width: 66.6666%;
                                    }
                                }
                            }
                            &.b2l {
                                .dcblock-item {
                                    &:first-child {
                                        width: 66.6666%;
                                    }
                                    &:last-child {
                                        width: 33.3333%;
                                    }
                                }
                            }
                            &.b2 {
                                .dcblock-item {

                                    width: 50%;

                                }
                            }
                            &.b1 {
                                .dcblock-item {

                                    width: 100%;

                                }
                            }
                            .dcblock-item {
                                height: 100%;
                                .dcmenu-box-table-ul {
                                    padding: 0;
                                    .dcmenu-box-table-li {
                                        width: 100%;
                                        min-height: 50px;
                                        position: relative;
                                    }
                                }
                                .dcblock-item-div {
                                    position: relative;
                                    height: 100%;
                                    display: table;
                                    min-height: 100px;
                                    width: 100%;
                                    .contentData {
                                        min-height: 100%;
                                        width:100%;
                                        display:table-cell;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    .icon-table-box {
        display: table;
        .icon-box {
            display: table-cell;
            vertical-align: middle;
            i {
            }
        }
    }
    .content-img-box {
        max-width: 100%;
    }
</style>