
export default {
	nl2br(text) {
		return text.value.replace(/(\n|\r\n)/g, '<br>');
		
	},
	nl2brContent(text) {
		text = text.toString();
		return text.replace(/(\n|\r\n)/g, '<br>');
		
	},
	br2nl(text) {
		return text.replace(/(<br>|<br\/>|<br \/>)/g, '\r');
	},
	numberFormat(number) {
		let nf = new Intl.NumberFormat(["en-US"], {});
		return nf.format(number);
	},
	getStrCut(string,length) {
		if(string.length >= length){
			return string.substr(0,length)+"..";
		} else return string;
	}
	
}
