var querystring = require("querystring"),
    fs = require("fs"),
    formidable = require("formidable");
var multiparty = require('multiparty');
var stream = require('stream')
var azure = require("azure");
var accessKey = "tsnfha5B6JYUj28o7neR/C9nULLfxp+FslNpLlpUcixkr6Vb225K/03HQSmAO5B1wHc4Ep0RtQMq8nwppxWZ3A==";
var storageAccount = "hamielnodedata";
var containerName = "mycontainer";
var blobService = azure.createBlobService(storageAccount, accessKey);
blobService.createContainerIfNotExists(containerName, function(error, result, response) {
    if (!error) {
        // Container exists and allows 
        // anonymous read access to blob 
        // content and metadata within this container
    }
});

function start(response) {
    console.log("Request handler 'start' was called.");

    var body = '<html>' +
        '<head>' +
        '<meta http-equiv="Content-Type" content="text/html; ' +
        'charset=UTF-8" />' +
        '</head>' +
        '<body>' +
        '<form action="/upload" enctype="multipart/form-data" ' +
        'method="post">' +
        '<input type="file" name="upload" multiple="multiple">' +
        '<input type="submit" value="Upload file" />' +
        '</form>' +
        '</body>' +
        '</html>';

    response.writeHead(200, {
        "Content-Type": "text/html"
    });
    response.write(body);
    response.end();
}

function upload(res, req) {
    console.log("Request handler 'upload' was called.");

    console.log("about to parse");
    var form = new multiparty.Form();

    form.on('part', function(part) {
        if (part.filename) {

            var size = part.byteCount - part.byteOffset;
            var name = part.filename;

            blobService.createBlockBlobFromStream(containerName, "myblob", part, size, function(error) {
                if (error) {
                    res.send(' Blob create: error ');
                }
            });
        } else {
            form.handlePart(part);
        }
    });
    form.parse(req);
    res.writeHead(200, {
        "Content-Type": "text/html"
    });
    res.write("received image:<br/>");
    res.write("<img src='/show' />");
    res.end();

}

function show(res) {
    console.log("Request handler 'show' was called.");
    // var a= blobService.getBlob(containerName, 'myblob').pipe(fs.createWriteStream('test.jpg'));
    // console.log(a);
    var a= blobService.getBlobToStream(containerName, "myblob", res, function(error, result, response) {
        if (!error) {
            // // blob retrieved
// res.writeHead(200, {
//     "Content-Type": "image/jpg"
// });
// console.log(result);
// res.write(fs, "binary");
// res.end();

            res.writeHead(200, {'Content-Type': 'image/png'});
            res.end();
        }
    });

}

exports.start = start;
exports.upload = upload;
exports.show = show;
