<template>
    <div>
        <div v-if="mobileView" class="mobile-metabus-box">
            <ul class="metabus-ul">
                <li v-for="item in subMenus" :class="item.gclass"
                    @click="goMetabusPage(item.code)">{{ item.name }}
                </li>
            </ul>
        </div>

        <itemComponent v-if="itemView" :pageCode="pageCode"></itemComponent>
        <presentComponent v-else></presentComponent>
    </div>
</template>


<script>
import itemComponent from './itemComponent';
import presentComponent from './presentComponent';
import {mapGetters} from "vuex";

export default {
    name: 'itemList',
    components: {
        itemComponent,
        presentComponent
    },
    computed: {
        ...mapGetters('etc', ["getUid"]),
    },
    watch: {

        '$route'(to, from) {
            let path = to.path.split('/');
            this.pageCode = path[4];
            if (this.pageCode != 'goods') this.itemView = true;
            else this.itemView = false;
        }
    },
    data() {
        return {
            mobileView: false,
            mobileClass: '',
            pageCode: '',
            itemView: true,
            ownerUid:'',
            subMenus: [
                {name: '아이템', code: 'list', gclass: 'selected'},
                {name: '나의 아이템', code: 'myitem', gclass: ''},
                {name: '선물함', code: 'goods', gclass: ''},
            ],
        };
    },
    created() {
        if (this.$isMobile()) {
            this.mobileView = true;
            this.mobileClass = 'mobile'
        }
        let path = this.$route.path.split('/');
        this.pageCode = path[4];
        if (this.pageCode != 'goods') this.itemView = true;
        else this.itemView = false;
        this.ownerUid = this.getUid;
    },
    methods: {
        goMetabusPage(itemCode) {

            for (let item of this.subMenus) {
                if (item.code == itemCode) {
                    item.gclass = 'selected';
                } else item.gclass = '';
            }
            this.$router.push('/' + this.ownerUid + '/main/metaroom/' + itemCode)
        },
    }
}
</script>
<style lang="scss" scoped="true">
.mobile-metabus-box {
    .metabus-ul {
        padding: 0;
        display: flex;
        justify-content: space-between;

        li {
            width: 33.33%;
            height: 30px;
            background: #fff;
            text-align: center;
            font-size: 11px;
            line-height: 30px;

            &.selected {
                background: #686EFB;
                color: #fff;
            }
        }
    }
}

</style>