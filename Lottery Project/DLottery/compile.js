const path = require('path')
const fs = require('fs')
const solc = require('solc')

const lotteryPath = path.resolve(__dirname,'contracts','Lottery.sol') // path to the solidity code
const source = fs.readFileSync(lotteryPath, 'utf8')// read the solidity file

module.exports = solc.compile(source,1).contracts[':Lottery'] // compile the solidity file using solc and get the contracts property in the result and the inbox property in it