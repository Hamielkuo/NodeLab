var http=require("http");
var url=require("url");//注入url 這個模組來找出request 的url路徑

function start(route, handle) {
	// body...
	function onRequest(request,response) {
		console.log("Rqeuest received");
		var pathname=url.parse(request.url).pathname;
		console.log("Request for " +pathname+" received.");
		
		route(handle, pathname,response)
		
	}
	http.createServer(onRequest).listen(8888);

	console.log("Server has started");
}
//匯出start這個函數
exports.start=start;