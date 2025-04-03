<template>
    <div class="comment-container">
            <Comment :parent="'timeline'" :parentNo="updateNo" :rwauth="rwauth"
                     :isAdmin="isAdmin"></Comment>
    </div>
</template>

<script>
import {mapGetters} from "vuex";
import Comment from '../../../../components/comment/comment';
export default {
    name: 'timelineComment',
    components: {
        Comment,
    },
    data() {
        return {
            isAdmin: false,
            updateNo: '',
            rwauth: true,

        }
    },
    created() {
        this.updateNo = this.$route.params.no;
    },
    methods: {

    }

}
</script>

<style lang="scss" scoped>

.comment-container {
    min-height:calc(100vh - 50px);
    padding:70px 10px 0 10px;
}
</style>