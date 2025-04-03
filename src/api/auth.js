import { CONFIG_HEADER_POST, CONFIG_HEADER_DEFAULT,CONFIG_HEADER_FORM } from './urls'

export default {
	setDevice(mobile) {
		let member = this.getSession(mobile);
		
		CONFIG_HEADER_POST.AUTHTOKEN = member.AUTHTOKEN;
		CONFIG_HEADER_DEFAULT.AUTHTOKEN = member.AUTHTOKEN;
		CONFIG_HEADER_FORM.AUTHTOKEN = member.AUTHTOKEN;
		
		CONFIG_HEADER_POST.APIKEY = member.APIKEY;
		CONFIG_HEADER_DEFAULT.APIKEY = member.APIKEY;
		CONFIG_HEADER_FORM.APIKEY = member.APIKEY;
	},
	
	getSession(mobile) {
		let result = {};
		let level = 0;
		if (mobile) {
			result.AUTHTOKEN = localStorage.getItem('AUTHTOKEN');
			result.name = localStorage.getItem('memberName');
			result.no = localStorage.getItem('memberNo');
			result.uid = localStorage.getItem('memberUid');
			result.email = localStorage.getItem('email');
			result.photo = localStorage.getItem('photo');
			result.mtype = localStorage.getItem('mtype');
			result.level = localStorage.getItem('memberLevel');
			
			result.APIKEY = localStorage.getItem('APIKEY');
		} else {
			result.AUTHTOKEN = sessionStorage.getItem('AUTHTOKEN');
			result.name = sessionStorage.getItem('memberName');
			result.no = sessionStorage.getItem('memberNo');
			result.uid = sessionStorage.getItem('memberUid');
			result.photo = sessionStorage.getItem('photo');
			result.email = sessionStorage.getItem('email');
			result.mtype = sessionStorage.getItem('mtype');
			result.level = sessionStorage.getItem('memberLevel');
			result.APIKEY = sessionStorage.getItem('APIKEY');
		}
		result.level = (level)?parseInt(level):0;
		return result
		
	},
	setPhoto(mobile,photo) {
		if (mobile) {
			localStorage.setItem('photo',photo);
			
		} else {
			sessionStorage.setItem('photo',photo);
			
		}
	},
	setPartSession(mobile,params) {
		if (mobile) {
			localStorage.setItem('memberName', params.name);
			localStorage.setItem('email', params.email);
		
		} else {
			sessionStorage.setItem('memberName', params.name);
			sessionStorage.setItem('email', params.email);
		}
		
	},
	setSession(mobile,params) {
		params.photo = (params.photo && params.photo!='undefined')?params.photo:'';
		if (mobile) {
			localStorage.setItem('AUTHTOKEN', params.AUTHTOKEN);
			localStorage.setItem('memberName', params.name);
			localStorage.setItem('memberNo', params.no);
			localStorage.setItem('memberUid', params.uid);
			localStorage.setItem('mtype', params.mtype);
			localStorage.setItem('photo', params.photo);
			localStorage.setItem('email', params.email);
			localStorage.setItem('APIKEY', params.APIKEY);
			localStorage.setItem('memberLevel',params.level);
		} else {
			sessionStorage.setItem('AUTHTOKEN', params.AUTHTOKEN);
			sessionStorage.setItem('memberName', params.name);
			sessionStorage.setItem('memberNo', params.no);
			sessionStorage.setItem('email', params.email);
			sessionStorage.setItem('memberUid', params.uid);
			sessionStorage.setItem('photo', params.photo);
			sessionStorage.setItem('mtype', params.mtype);
			sessionStorage.setItem('APIKEY', params.APIKEY);
			sessionStorage.setItem('memberLevel',params.level);
		}
		CONFIG_HEADER_POST.AUTHTOKEN = params.AUTHTOKEN
		CONFIG_HEADER_DEFAULT.AUTHTOKEN = params.AUTHTOKEN
		CONFIG_HEADER_FORM.AUTHTOKEN = params.AUTHTOKEN
		
		CONFIG_HEADER_POST.APIKEY = params.APIKEY;
		CONFIG_HEADER_DEFAULT.APIKEY = params.APIKEY;
		CONFIG_HEADER_FORM.APIKEY = params.APIKEY;
	},
	logout(mobile) {
		if (mobile) {
			localStorage.setItem('AUTHTOKEN', '');
			localStorage.setItem('memberName', '');
			localStorage.setItem('memberNo', '');
			localStorage.setItem('email', '');
			localStorage.setItem('memberUid', '');
			localStorage.setItem('APIKEY', '');
			localStorage.setItem('photo', '');
			localStorage.setItem('mtype','');
			localStorage.setItem('memberLevel','');
			
		} else {
			sessionStorage.setItem('AUTHTOKEN', '');
			sessionStorage.setItem('memberName', '');
			sessionStorage.setItem('memberNo', '');
			sessionStorage.setItem('email', '');
			sessionStorage.setItem('memberUid', '');
			sessionStorage.setItem('photo', '');
			sessionStorage.setItem('APIKEY', '');
			sessionStorage.setItem('mtype','');
			sessionStorage.setItem('memberLevel','');
			
			
		}
		CONFIG_HEADER_POST.AUTHTOKEN = ''
		CONFIG_HEADER_DEFAULT.AUTHTOKEN = ''
		CONFIG_HEADER_FORM.AUTHTOKEN = '';
		
		CONFIG_HEADER_POST.APIKEY = '';
		CONFIG_HEADER_DEFAULT.APIKEY = '';
		CONFIG_HEADER_FORM.APIKEY = '';
	},
	
	
}
