const HDWalletProvider = require('truffle-hdwallet-provider')
const Web3 = require('web3')
const {interface, bytecode} = require('./compile')
let INITIAL_STRING = 'Hello world!'

// let rpcUrl = 'https://rinkeby.infura.io/v3/2a805307845c4d45949d434dc5338860';
// var web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));

const provider = new HDWalletProvider(
    'XXX',
    'https://rinkeby.infura.io/v3/2a805307845c4d45949d434dc5338860'
)

const web3 = new Web3(provider)

const deploy = async () =>{
    const accounts = await web3.eth.getAccounts() 
    console.log('Attempting to deploy from the account', accounts[0])

    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: '0x'+ bytecode }) // byte code of the S.C. and arguments are the SC cunrtructor argumentn 
            .send({ from: accounts[0], gas: '2000000' }) // specify gas limit and account address

    console.log(interface)        
    console.log('Contract deployed to :', result.options.address)
} 
deploy()