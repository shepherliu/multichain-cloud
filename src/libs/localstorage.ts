export const setLocalStorage = (key:string, value:any, expiretime:number = 0) => {
	if(expiretime > 0){
		expiretime += (new Date()).getTime();
	}

	try{
		const data = {
			value: value,
			expiretime: expiretime,
		};

		(window as any).localStorage.setItem(key, JSON.stringify(data));

		return true;
	}catch(e){
		return false;
	}

}

export const getLocalStorage = (key:string) => {
	const value = (window as any).localStorage.getItem(key);

	try{
		const data = JSON.parse(value);

		if(data.expiretime > 0){
			if(data.expiretime > (new Date()).getTime()){
				return data.value;
			}else{
				return null;
			}
		}else{
			return data.value;
		}

	}catch(e){
		return value;
	}
}