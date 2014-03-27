!function($){
	var reus=[] 
		,walker=document.createTreeWalker(document,NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT,{
		acceptNode:function(node) {
			if (node.nodeType==1) {return NodeFilter.FILTER_ACCEPT;}
			return (node.nodeValue.search('Begin content from page:')) > -1 || (node.nodeValue.search('End of page content from page: ')) > -1;
		}
	} )
		,infoBox=document.createElement('div')
		,node
		,reusables=[]
		,msg=document.createTextNode('Not in reusable')
		,update=function(e){
			msg.nodeValue=this.hasAttribute('from_reusable') ? this.getAttribute('from_reusable') : 'Not in a reusable';
			infoBox.style.left='0px';
			infoBox.style.top='0px';
			infoBox.style.visibility='hidden';
			setTimeout(function(){
				infoBox.style.left=Math.min(e.clientX+4, window.innerWidth-infoBox.offsetWidth-15)+'px';
				infoBox.style.top=Math.max(0,(e.clientY-(4+infoBox.offsetHeight)))+'px';
				infoBox.style.visibility='visible';
			},1);
			e.stopPropagation();
			return false;
		},
		log=function(e){
			if (e.shiftKey){
				console.log('Current reusable path is '+msg.nodeValue);
			}
			e.stopPropagation();
			return false;
		};
	while (node=walker.nextNode()){
		if (node.nodeType==1){
			if (reus.length) {
				node.setAttribute('from_reusable',reus.join('->'));
				node.addEventListener('mouseover',update);
				node.addEventListener('click',log);
			}
			continue;
		}
		if (node.nodeValue.search('Begin content from page:') > -1) {
			reus.push(node.nodeValue.replace('Begin content from page: ','').replace(/(^\s+)|(\s+$)/g,''));
			reusables.push(node.nodeValue.replace('Begin content from page: ','').replace(/(^\s+)|(\s+$)/g,''));
			continue;
		}
		if (node.nodeValue.search('End of page content from page: ') > -1) {
			reus.pop();
			continue;
		}
	}
	if (reusables.length){
		infoBox.innerHTML='<div style=&quot;border-radius:8px;box-shadow:2px 2px 4px rgba(0,0,0,.7);white-space:nowrap;z-index:99999;padding:2px 5px;position:fixed; background:white; border: 1px solid black; width:auto; top:0;left:0;min-width: 60px;&quot;></div>';
		infoBox=infoBox.firstChild;
		infoBox.appendChild(msg);
		document.body.appendChild(infoBox);
		document.body.addEventListener('mouseover',update);
		alert('The following reusables are present on this page:\nThese are also logged to the console)\n'+reusables.join('\n'));
		console.log('The following reusables are present on this page:\n('+reusables.join('\n')+'\nShift click on an element to log its closest reusable to the console.');
	} else {
		infoBox=node=update=msg=walker=reus=reusables=undefined;
		if (window.location.href.search('s_debug=true')==-1){
			if(confirm('No reusables were found. Reload with s_debug=true?\n(You will have to click the bookmarklet again afterward)')){
				window.location=window.location.href.replace(/\?|(#|$)/,'?s_debug=true&$1')
			}
		} else {
			alert('No reusables were found on the page.');
		}
	}
}();