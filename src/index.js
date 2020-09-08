var http = require('http')
var url = require('url')
var querystring = require('querystring')
var {info,error}= require('./modules/my-logs')
var {countries} = require('countries-list')
const { ifError } = require('assert')
const { isNull } = require('util')

var server = http.createServer(function(request, response){
    var parsed = url.parse(request.url)
    console.log("Parsed: ", parsed)
    var pathname = parsed.pathname
    var query = querystring.parse(parsed.query)
    console.log ("Query: ", query)

    if(pathname=='/'){
        response.writeHead(200,{'Content-Type': 'text/html'})
        response.write("<html><body>HOME PAGE</body></html>")
        info("Home Page Reached")
        response.end()
    }
    else if(pathname=='/exit'){
        response.writeHead(200,{'Content-Type': 'text/html'})
        response.write("<html><body>EXIT PAGE</body></html>")
        response.end()
    }else if(pathname=='/info'){
        response.writeHead(200,{'Content-Type': 'text/html'})
        response.write("<html><body><p>INFO PAGE</p></body></html>")
        info("Info page reached")
        response.end()
    }else if(pathname=='/country'){
        response.writeHead(200,{'Content-Type': 'application/json'})
        if(query.code == null)
        response.write(JSON.stringify(countries))
        else
        response.write(JSON.stringify(countries[query['code']]))
        info("Countries page reached")
        response.end()
    }else if(pathname=='/error'){
        response.writeHead(200,{'Content-Type': 'text/html'})
        response.write("<html><body><h1>Error Page</h1></body></html>")
        error("Error page reached")
        response.end()
    }else{
        response.writeHead(404,{'Content-Type': 'text/html'})
        response.write("<html><body>NOT FOUND</body></html>")
        response.end()
    }

})

server.listen(4000)
console.log("Running on port 4000")
