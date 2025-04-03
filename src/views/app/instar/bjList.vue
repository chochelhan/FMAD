<template>
    <div>
        <pcBjList v-if="!mobileView"></pcBjList>
        <mobileBjList v-else></mobileBjList>
    </div>
</template>

<script>
import pcBjList from './pc/bjList'
import mobileBjList from './mobile/bjList'

export default {
    components: {
        mobileBjList,
        pcBjList
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