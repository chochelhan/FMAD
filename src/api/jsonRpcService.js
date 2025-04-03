import axios from 'axios'

export default {
	DEBGU:true,
	sendType:'chat',
	jsonRpcUrl:((location.hostname == 'localhost')?'http://localhost:8050':'https://duckku.com:444'),
	jsonRpcConnect:false,
	jsonRpcLiveUrl:((location.hostname == 'localhost')?'http://localhost:8030':'https://duckku.com:446'),
	checkDebug() {
	},
	post(frm,afterFunc) {
		let url = '';
		if(this.sendType=='chat') {
			url = this.jsonRpcUrl+'/chat'
		} else {
			url = this.jsonRpcLiveUrl+'/realTime'
		}
		axios.post(url, frm, {headers: {'Content-Type': 'application/json;charset=UTF-8'}}).then(res => {
			let result = res.data.result;
			if(this.DEBGU) {
				console.log(res.data)
			}
			afterFunc(res.data);
			
		}).catch((error)=> {
			this.setError(error);
		});
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
