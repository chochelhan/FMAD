<template>
    <div class="page-container">
        <div class="metabusBg">
            <iframe v-if="debug" id="debugFrame" src="https://duckku.com/webgl2/" style="width:100%;height:600px"
                    frameborder="0"></iframe>
            <div   v-if="!debug" style="width:960px;height:540px;margin:auto">
            <unity src="/webgl2/Build/metaroom_20210727.json" width="960" height="540"
                   unityLoader="/webgl2/Build/UnityLoader.js" hideFooter="true" @unityLoaded="unityLoaded" ref="myUnity"></unity>
            </div>
        </div>
        <v-dialog
            v-model="webGlModalShow"
            width="450"
            style="z-index:100;"
        >
            <webGlItemView v-if="webGlViewShow" :mtype="mtype" :gcode="gcode" :gHome="gHome"
                           @webGlModalHide="webGlModalHide"></webGlItemView>
        </v-dialog>
    </div>
</template>

<script>

	import {mapActions, mapGetters} from "vuex";
	import AUTH from '../../../api/auth'
	import Unity from 'vue-unity-webgl'
	import webGlItemView from '../bj/metabus/webGlitemView'
	import JQ from 'jquery'

	export default {
		name: 'BJ',
		components: {
			Unity,
			webGlItemView
		},
		data() {
			return {
				debug: false,
				host: HOST,
				myUid: '',
				myName:'',
				isLogin: false,
				mtype: '',
				nouserapikey: '',
				gHome: false,
				gcode: '',
				webGlModalShow: false,
				webGlViewShow: false,
				unityObject: '',
				unityMethod: '',

			};
		},
		computed: {
			...mapGetters('member', ["getUid"]),
		},
		watch: {
			getUid(val) {
				if (val) {
					location.reload();
					//this.setMemberInfo();
				}
			},
			webGlModalShow(val) {
				if (!val) {
					this.webGlViewShow = false;
				}
			}

		},
		created() {
            if(location.host=='localhost:8080') {
            	this.debug = true;
            }
			this.$eventBus.$on('unityAction', this.unityAction);
			this.setMemberInfo();

		},
		methods: {
			...mapActions('member', ["setLoginBoxOpen"]),
			setMemberInfo() {
				let memberInfo = AUTH.getSession(this.$isMobile());
				if (memberInfo.AUTHTOKEN) {
					this.isLogin = true;
					this.myUid = memberInfo.uid;
					this.myName = memberInfo.name;

				}

			},
			unityLoaded() {
				this.unityObject = 'Canvas';
				this.unityMethod = 'webReciveChangeScene';
				let webGlParams = {type:'scene',data:{result:'succ',code:'GoRoom',targetUid:this.uid}};
				this.webGlSend(webGlParams)
            },
			webGlModalHide(params) {
				this.webGlModalShow = false;
				this.webGlViewShow = false;
				if (params.type != 'close') {
					this.webGlSend(params);
				}
			},
			activeWebGl(code) {
				this.gcode = code;
				this.gHome = false;
				this.webGlModalShow = true;
				this.webGlViewShow = true;
			},
			activeWebGlHome(code) {
				this.gcode = code;
				this.gHome = true;
				this.webGlModalShow = true;
				this.webGlViewShow = true;
			},
			unityAction(paramsString) {
				let params = JSON.parse(paramsString);
				this.unityObject = params.object;
				this.unityMethod = params.method;

				switch (params.type) {
					case 'item':
						this.activeWebGl(params.code)
						break;
					case 'home':
						this.activeWebGlHome(params.code)
						break;
				}
			},
			webGlSend(params) {
				let result = '';
				let data = {};
				switch (params.type) {
					case 'homeBuy':
						data = {
							result: 'succ',
							code: this.gcode,
							status: 'sale',
							uid: params.uid,
							nameplate: params.nameplate
						};
						result = 'succ';
						break;
					case 'itemBuy':
						data = {
							type:'buy',
							result: 'succ',
                            pno:'',
							code: this.gcode,
							uid: this.myUid,
							name:this.myName,
							stdate:'',
							endate:'',
                            resultType:params.resultType
						};
						result = 'succ';
						break;
					case 'present':
						data = {
							type:'present',
							result: 'succ',
							pno:params.pno,
                            code: this.gcode,
							uid: this.myUid,
                            name:this.myName,
                            stdate:'',
                            endate:'',
							resultType:'',
						};
						result = 'succ';
						break;
                    case 'scene':
	                    result = 'succ';
	                    data = params.data;
                    	break;

				}
				if (result == 'succ') {
					if (this.debug) {

						let sendData = {object: this.unityObject, method: this.unityMethod, data: data}
						JQ('#debugFrame').get(0).contentWindow.postMessage(JSON.stringify(sendData), 'https://duckku.com');

					} else {
						this.$refs.myUnity.message(this.unityObject, this.unityMethod, JSON.stringify(data))
					}
				}
			},

		},
		beforeDestroy() {
			this.$eventBus.$off('unityAction');
		},
		mounted() {

		}


	}
</script>
<style lang="scss" scoped="true">
    .metabusBg {
        width: 100%;
        height: 540px;
        background: #000000;
    }


</style>
