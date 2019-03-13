var net = require('net')
var jsonStream = require('duplex-json-stream')
var username = process.argv[2]

var socket = jsonStream(net.connect( 9000 , 'localhost'))

socket.on('data', function(data){
    console.log(data.username + '>' + data.message)
})

process.stdin.on('data',function(data){
    socket.write({username: username , message: data.toString().trim()})
})