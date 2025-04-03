import axios from 'axios'
import { CONFIG_HEADER_POST, CONFIG_HEADER_FORM } from './urls'


export default {
	DEBGU:true,
	post(url,frm,afterFunc) {
		this.checkDebug();
		axios.post(url, frm, {headers: CONFIG_HEADER_POST}).then(res => {
			let result = res.data.result;
			if(this.DEBGU) {
				console.log(res.data)
			}
			afterFunc(res.data);
			
		}).catch((error)=> {
			this.setError(error);
		});
	},
	postFile(url,frm,afterFunc) {
		this.checkDebug();
		axios.post(url, frm, {headers: CONFIG_HEADER_FORM}).then(res => {
			let result = res.data.result;
			if(this.DEBGU) {
				console.log(res.data)
			}
			afterFunc(res.data);
			
		}).catch((error)=> {
			this.setError(error);
		});
	},
	get(url,frm,afterFunc) {
		this.checkDebug();
		axios.post(url,{params:frm,headers: CONFIG_HEADER_POST}).then(res => {
			let result = res.data.result;
			if(this.DEBGU) {
				console.log(res.data)
			}
			if (result=='succ') {
				afterFunc(res.data);
			} else {
				if(!this.DEBGU)location.href='/';
			}
		}).catch((error)=> {
			this.setError(error);
		});
	},
	checkDebug() {
		if(location.host == 'localhost:8080') {
			this.DEBGU = true;
		}	else this.DEBGU = false;
	},
	setError(error) {
		if(!this.DEBGU)return;
		
		if (error.response) {
			// 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
			console.log(error.response.data);
			console.log(error.response.status);
			console.log(error.response.headers);
		}
		else if (error.request) {
			// 요청이 이루어 졌으나 응답을 받지 못했습니다.
			// `error.request`는 브라우저의 XMLHttpRequest 인스턴스 또는
			// Node.js의 http.ClientRequest 인스턴스입니다.
			console.log(error.request);
		}
		else {
			// 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
			console.log('Error', error.message);
		}
		console.log(error.config);
	}
	
	
	
}
