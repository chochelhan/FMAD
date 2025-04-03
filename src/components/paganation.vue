<template>
    <div>
        <ul class="paganation">
            <li @click="getPagingMove(1,'pre')" ><i class="fas fa-angle-double-left"></i></li>
            <li @click="getPagingMove(prePage,'pre')" class="move-left-item"><i class="fa fa-angle-left"></i></li>
            <li v-for="item in  pagingList" :class="item.gclass" @click="getPagingData(item.number)">{{item.number}}</li>
            <li @click="getPagingMove(nextPage,'next')" class="move-right-item"><i class="fa fa-angle-right"></i></li>
            <li @click="getPagingMove(lastPage,'next')"><i class="fa fa-angle-double-right"></i></li>
        </ul>
    </div>
</template>


<script>
	export default {
		name: 'paganation',
		props:["page","pageCount","total","limit","pageInit"],
        watch: {
			total() {
				this.page = 1;
				this.getPageCount(this.page);
				this.getPagingList();
            },
	        pageInit(val) {
				if(val) {
					this.getPageCount(1);
					this.getPagingList();
				}
            },
            limit() {
	            this.getPageCount(1);
	            this.getPagingList();
            }
        },
		data () {

			return {
				pagingList:[],
				prePage:1,
				nextPage:1,
				lastPage:1,
				lastPageCount:1,
				pageStart:1,
				pageCountLimit:1,
                pagePage:1,
				nextMoveFlag:true,


			}
		},
		created() {
			this.getPageCount(this.page);
			this.getPagingList();

		},
		methods: {
			getPageCount(page) {
				let pageCount = 1;
				if(this.total>0) {
					pageCount = this.total/this.limit;
					if(pageCount<=0)pageCount = 1;
					else if(pageCount>this.pageCount) {
						pageCount = this.pageCount;

					} else {
						pageCount = Math.ceil(pageCount);
					}
					this.lastPageCount = Math.ceil(this.total/this.limit);
				}
				let lastPage = Math.floor(this.lastPageCount /this.pageCount);
				this.lastPage = (lastPage * pageCount)+1;
				this.pageStart = page;
				this.pagePage = page;
				this.pageCountLimit = (page-1) + pageCount;

				this.nextPage = this.pageCountLimit+1;
                if(this.pageStart>1)this.prePage = this.pageStart - pageCount;
				else this.prePage =1;
			},
			getPagingData(number) {
				this.pagePage = number;
				this.getPagingList();
				this.$emit('getDataListByPaging',number);
			},
			getPagingMove(number,cmd) {
				if(!this.nextMoveFlag && cmd=='next') {
					return;
				}
				this.getPageCount(number);
				this.getPagingList();
				this.$emit('getDataListByPaging',number);
			},
			getPagingList() {
	            let item = {};
	            let active = '';
	            this.pagingList = [];
	            let nextMoveFlag = true;
	            for(let k=this.pageStart; k<=this.pageCountLimit; k++) {

		            active = (this.pagePage==k)?'active':'';
		            item = {number:k,gclass:active}
		            this.pagingList.push(item)
		            if(this.lastPageCount <= k) {
			            this.nextPage = this.pageStart;
			            nextMoveFlag = false;
			            break;
		            }

	            }
	        	this.nextMoveFlag = nextMoveFlag;
            }

		},
		mounted: function() {

		}

	}
</script>

<style lang="scss" scoped>
    .paganation {
        display: table;
        margin:30px auto 0 auto;
        li {
            float:left;
            width:30px;
            text-align:center;
            line-height:28px;
            cursor:pointer;
            color:#222;
            font-size:10pt;
            height:30px;
            background:#FFF;
            border:solid 1px #555;
            border-radius:15px;
            margin-left:7px;

        }
        li:first-child {
            margin-left:0;
            font-weight:bold;
            color:#000;
            background:#fff;
            border:solid 1px #000;
            line-height:30px;
            font-size:12pt;

        }
        li:last-child {
            font-weight:bold;
            color:#000;
            border:solid 1px #000;
            background:#fff;
            line-height:30px;
            font-size:12pt;
        }

        li.active {
            font-weight:bold;
            color:#fff;
            background:#646AF3;

        }
        li.move-left-item {
            font-weight:bold;
            color:#000;
            background:#fff;
            margin-right:7px;
            border:solid 1px #000;
            line-height:30px;
            font-size:12pt;
        }
        li.move-right-item {
            font-weight:bold;
            color:#000;
            background:#fff;
            margin-left:14px;
            border:solid 1px #000;
            line-height:30px;
            font-size:12pt;
        }
    }

</style>