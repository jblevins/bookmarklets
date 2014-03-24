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
		,debuggable=false
		,msg=document.createTextNode("Not in reusable")
		,update=function(e){
			msg.nodeValue=this.hasAttribute('from_reusable') ? this.getAttribute('from_reusable') : "Not in a reusable";
			infoBox.style.left='0px';
			infoBox.style.top='0px';
			infoBox.style.visibility='hidden';
			setTimeout(function(){
				infoBox.style.left=Math.min(e.x+4, window.innerWidth-infoBox.offsetWidth-10)+'px';
				infoBox.style.top=Math.max(0,(e.y-(4+infoBox.offsetHeight)))+'px';
				infoBox.style.visibility='visible';
			});
			e.stopPropagation();
			return false;
		},
		log=function(e){
			if (e.shiftKey){
				console.log("Current reusable path is "+msg.nodeValue);
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
				debuggable=true;
			}
			continue;
		}
		if (node.nodeValue.search('Begin content from page:') > -1) {
			reus.push(node.nodeValue.replace('Begin content from page: ','').replace(/(^\s+)|(\s+$)/g,''));
			continue;
		}
		if (node.nodeValue.search('End of page content from page: ') > -1) {
			reus.pop();
			continue;
		}
	}
	if (debuggable){
		infoBox.innerHTML='<div style="white-space:nowrap;z-index:99999;padding:2px 5px;position:fixed; background:white; border: 1px solid black; width:auto; top:0;left:0;min-width: 60px;"></div>';
		infoBox=infoBox.firstChild;
		infoBox.appendChild(msg);
		document.body.appendChild(infoBox);
		document.body.addEventListener('mouseover',update);
	} else {
		infoBox=node=update=msg=walker=debuggable=undefined;
		alert("No reusables were found on the page.");
	}
}();