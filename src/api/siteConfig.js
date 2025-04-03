
export default {
	memberServer:false,
	memberConfig:{},
	getMemberConfig() {
		return this.memberConfig;
	},
	setMemberConfig(config) {
		this.memberServer = true;
		this.memberConfig = config;
	}
	
}
