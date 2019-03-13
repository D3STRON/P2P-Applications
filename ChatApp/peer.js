var topology = require('fully-connected-topology')
var jsonStream = require('duplex-json-stream')
var streamSet = require('stream-set')
var register = require('register-multicast-dns')
var toPort = require('hash-to-port')
var id = Math.random()
var seq = 0
var logs = {}

var me = process.argv[2]
var peers = process.argv.slice(3)


function toAddress(name){
    return 'localhost:' + toPort(name)
}

var swarm = topology(toAddress(me), peers.map(toAddress))
var streams = streamSet()

register(me)



swarm.on('connection',function(fellowPeer){
    console.log("[New peer Connected]")
    fellowPeer = jsonStream(fellowPeer)
    streams.add(fellowPeer)
    fellowPeer.on('data',function(data){
        if(logs[data.log]>= data.seq) return
        logs[data.log] = data.seq
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

