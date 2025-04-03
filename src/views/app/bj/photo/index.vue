<template>
    <div :class="'router-box '+contentClass">
        <div class="meet-mobile-header" v-if="contentClass">
            <div class="back-button" @click="$router.back()">
                <i class="fas fa-arrow-left"></i>
            </div>
            <div class="header-title">
                {{ title }}
            </div>
        </div>
        <router-view/>
    </div>
</template>

<script>


export default {
    name: 'userPhoto',
    watch: {
        '$route'(to, from) {
            //console.log(to.name)
            //console.log(from.name)
            if(this.$isMobile()) {
                this.checkPath(to.name);
            }

        },
    },
    data() {
        return {
            contentClass:'',
            title:'',
        };
    },
    created() {
        if(this.$isMobile()) {
            let pathName = this.$route.name;
            this.checkPath(pathName);

        }

    },
    methods: {
        checkPath(name) {
            switch (name) {
                case 'userPhotoRegist':
                case 'userPhotoModify':
                    if(name=='userPhotoRegist')this.title = '사진첩 작성하기';
                    else this.title = '사진첩 수정하기';
                    this.contentClass = 'mobile-screen-box'
                    break;
                default:
                    this.contentClass = ''
                    //this.setTitle(sessionStorage.getItem('bjTitleName'));
                    break;
            }
        }
    }
}
</script>


<style lang="scss" scoped="true">
.mobile-screen-box {
    width:calc(100vw);
    position:fixed;
    top:0;
    left:0;
    z-index:150;
}
.meet-mobile-header {
    width: 100%;
    position: fixed;
    background: #141A2C;
    z-index: 90;
    top: 0;
    left: 0;
    height: 44px;
    display:flex;
    box-shadow: 0px 0px 9px #0000007A;
    .back-button {
        color:#fff;
        margin:10px 0 0 10px;
    }
    .header-title {
        text-align:left;
        padding:10px 0 0 15px;
        color:#fff;
        font-weight: 600;
    }
}
</style>
