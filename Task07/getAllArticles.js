get();
function get(){
	
let xhr=new XMLHttpRequest();
let body={page:Number(page.value),sortType:sortType.value,sortField:sortField.value,limit:Number(limit.value),includeDeps:includeDeps.value};
//alert(body.page);
xhr.open('POST', '/api/articles/readall', true);
xhr.setRequestHeader('Content-type','application/json');
xhr.send(JSON.stringify(body));

xhr.onreadystatechange = function (){

	let res=[];
	if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
		res=JSON.parse(xhr.responseText);
		//alert(xhr.responseText);
		console.log(res);
		deleteNodes('articlesContainer');
		if(body.includeDeps=='true')
		{
			for(let i=0;i<res.items.length;i++)
			{
			//alert(res.items[i]);

				let div=document.createElement('div');
				let set="<p>"+res.items[i].title+"</p>"+"<p>"+res.items[i].text+"</p>"+"<p>"+res.items[i].date+"</p>"+"<p>"+res.items[i].author+"</p>";
				if(res.items[i].comments!=null)
				if(res.items[i].comments.length>0)
				{
					set=set+"<p>comments<p>";
					for(let j=0;j<res.items[i].comments.length;j++)
						set=set+"<p>"+res.items[i].comments[j].text+"</p>"+"<p>"+res.items[i].comments[j].date+"</p>"+"<p>"+res.items[i].comments[j].author+"</p>";
					
				}
				div.innerHTML=set;
				articlesContainer.appendChild(div);
			}
		}
		else
		{
			for(let i=0;i<res.items.length;i++)
			{
			//alert(res.items[i]);

				let div=document.createElement('div');				
				let set="<p>"+res.items[i].title+"</p>"+"<p>"+res.items[i].text+"</p>"+"<p>"+res.items[i].date+"</p>"+"<p>"+res.items[i].author;	
				div.innerHTML=set;
				articlesContainer.appendChild(div);
			}
		}

	}

}
}
function deleteNodes(id)
{
	 var myNode = document.getElementById(id);
				while (myNode.firstChild) {
    				myNode.removeChild(myNode.firstChild);
					}
}