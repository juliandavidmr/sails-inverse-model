// Concat text
export function concat(text1: string, text2: string) {
	if (process.platform === 'win32') {
		if (text1.search(/^[a=zA-Z]:/gm) > -1) {
			if (text1.search(/\genviews$/gm) > -1) {
				return text1.concat("\\").concat(text2);
			}
			return text2;
		} else {
			return text1.concat("\\").concat(text2);
		}
	} else {
		return text1.concat("/").concat(text2);
	}
};