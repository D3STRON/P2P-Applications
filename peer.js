var topology = require('fully-connected-topology')
var jsonStream = require('duplex-json-stream')
var streamSet = require('stream-set')
var register = require('register-multicast-dns')


var me = process.argv[2]
var peers = process.argv.slice(3)



var swarm = topology(me,peers)
var streams = streamSet()

register(me)



swarm.on('connection',function(fellowPeer){
    console.log("[New peer Connected]")
    fellowPeer = jsonStream(fellowPeer)
    streams.add(fellowPeer)
    fellowPeer.on('data',function(data){
       
        console.log(data.username +'~ '+ data.message)
        streams.forEach(function(otherFriend){
            otherFriend.write(data)
        })
    })
})

process.stdin.on('data',function(data){
    seq+=1 
    streams.forEach(function(fellowPeer){
        fellowPeer.write({log:id , seq: seq, username: me , message: data.toString().trim()})
    })
})

