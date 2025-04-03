<template>
    <div>
        <pcMain v-if="!mobileView"></pcMain>
        <mobileMain v-else></mobileMain>
    </div>
</template>

<script>
import pcMain from './pc/main';
import mobileMain from './mobile/main';

export default {
    name: 'MainPage',
    components: {
        pcMain,
        mobileMain
    },
    data() {
        return {
            mobileView: false,

        };
    },
    created() {
        if (this.$isMobile()) {
            this.mobileView = true;
        }

    }

}
</script>