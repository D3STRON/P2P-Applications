var utils = require('ethereumjs-util')
var privateKey = new Buffer('vacant element sleep harsh stick else salt great kitten clutch salad subway')
var publicKey = utils.privateToPublic(privateKey).toString('hex')
var address = utils.privateToAddress(privateKey).toString('hex')