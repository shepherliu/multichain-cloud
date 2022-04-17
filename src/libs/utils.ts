import mime from "mime-types"
//copy string to clipboard
export const clickToCopy = (content:string) => {
	const textarea = document.createElement('textarea');

	textarea.readOnly = true;
	textarea.style.position = 'absolute';
	textarea.style.left = '-9999px';

	textarea.value = content;

	document.body.appendChild(textarea);

	textarea.select();

	const result = document.execCommand('Copy');

	document.body.removeChild(textarea);

	return result;
}

//short content string
export const shortString = (content:string) => {
  if(content.length <= 15){
    return content;
  }

  const length = content.length;

  return content.substr(0,7)+"..."+content.substr(length-5,length);
}

export const fileType = (name: string) => {
	const mimeType = mime.contentType(mime.lookup(name) || "application/octet-stream");

	return mimeType as string;
}

export const fileSize = (size: number) => {
	if (size < 1024) {
		return size.toFixed(2) + ' B';
	} else {
		size /= 1024;
	}

	if (size < 1024) {
		return size.toFixed(2) + 'KB';
	} else {
		size /= 1024;
	}

	if (size < 1024) {
		return size.toFixed(2) + 'MB';
	} else {
		size /= 1024;
	}

	return size.toFixed(2) + 'GB'
}