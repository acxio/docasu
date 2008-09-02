function UnCryptMailto(s, shift) {
	var n=0;
	var r="";
	for(var i=0;i<s.length;i++) { 
		n=s.charCodeAt(i); 
		if (n>=8364) {n = 128;}
		r += String.fromCharCode(n-(shift)); 
	}
	return r;
}
function linkTo_UnCryptMailto(s, shift)	{
	location.href=UnCryptMailto(s, shift);
}