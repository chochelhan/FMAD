<template>
    <div class="board-container">
        <List v-if="boardInfo.btype=='list'" :boardInfo="boardInfo" :articleList="list"></List>
        <layerList v-else-if="boardInfo.btype=='layer'" :boardInfo="boardInfo" :articleList="list"></layerList>
    </div>
</template>


<script>
	import AUTH from '../../../api/auth'
	import List from '../../../components/board/skin/duckkuList'
	import layerList from '../../../components/board/skin/duckkuLayerList'
	import {
		API_URL_BOARD_ARTICLE_LIST,
	} from '../../../api/urls';
	import apiService from '../../../api/apiService';

	export default {
		name: 'articleList',
		components: {
			List,
			layerList
		},
		data() {
			return {
				bid:'',
                boardInfo:{},
                list:[],
				memberInfo:{},
			}
		},
		created() {
			this.memberInfo = AUTH.getSession(this.$isMobile());
			this.bid = this.$route.params.bid;
			this.getData();
		},
		methods: {
            getData() {
	            const frm = new FormData()
	            frm.append('bid',this.bid)
	            apiService.post(API_URL_BOARD_ARTICLE_LIST, frm,(res) => {
		            if(res.msg == 'noAuth') {
	                    if (!this.memberInfo.AUTHTOKEN) {
		                    this.$router.push('/login');
	                    } else {
		                    let prm = {
			                    message: '접근불가능한 회원등급입니다',
			                    doAction: () => {
				                    this.$router.push('/');
			                    }
		                    };
				            this.$eventBus.$emit('modalOpen', prm);
	                    }
	                    return;
                    } else if(res.msg == 'succ') {
		           		this.boardInfo = res.board;
		           		this.list = res.list;
                    }

	            });
            }
		}

	}
</script>

<style lang="scss">
.board-container {
    padding:40px;
    background:#fff;
    min-height:calc(100vh);
    .stitle {
        font-size: 17pt;
        font-weight: bold;
        padding: 0 0 10px 0;
        color: #686EFB;
        border-bottom:solid 1px #dcdcdc;
        span {
            padding-bottom:13px;
            border-bottom:solid 2px #686EFB;
        }
    }

}
</style>