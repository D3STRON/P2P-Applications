 const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')

const web3 = new Web3(ganache.provider()) // ganache provider connects us to the test network
const {interface, bytecode} = require('../compile')

let accounts
let lottery

beforeEach(async ()=>{
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts()
    //Use one of those accounts to deploy
    // the contract
    lottery = await new web3.eth.Contract(JSON.parse(interface)) // the passed argument is te abi helping js to understand S.C. file
                .deploy({ data: bytecode }) // byte code of the S.C. and arguments are the SC cunrtructor argumentn 
                    .send({ from: accounts[0], gas: '1000000' }) // specify gas limit and account address
})

describe('Inbox',()=>{
    it('deploys a contract',()=>{
        assert.ok(lottery.options.address)
    })

    it('allows multiple account to enter', async ()=> {
        
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02','ether')
        })

        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02','ether')
        })

        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02','ether')
        })

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        })

        assert.equal(accounts[0],players[0])
        assert.equal(accounts[1],players[1])
        assert.equal(accounts[2],players[2])
        assert.equal(3, players.length)
    })

    it('allows one account to enter', async ()=> {
        
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02','ether')
        })

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        })

        assert.equal(accounts[0],players[0])
        assert.equal(1, players.length)
    })

    it('Requires a minimum number of ether to enter',async () =>{
        try{
            await lottery.methods.enter().send({
            from: accounts[0],
            value: 0 
            })
            assert(false) // tells us that an error is not thrown when ether is less than required
         } catch (err)
        {
            assert(err)
        }
    })

    it('Only manager calls Pick Winner', async()=>{
        try{
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            })
            assert(false)
        }catch(err)
        {
            assert(err)
        }
    })

    it('Sends money to the winner ans resets the players array', async() => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2','ether')
        })

        const initialBalance = await web3.eth.getBalance(accounts[0])
        await lottery.methods.pickAWinner().send({
            from: accounts[0]
        })
        const finalBalance = await web3.eth.getBalance(accounts[0])
        const difference = finalBalance - initialBalance
        assert(difference > web3.utils.toWei('1.8','ether'))

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        })
        assert.equal(0,players.length)
    })
})

// npm install --save solc@0.4.25 mocha ganache-cli
//npm install --save web@1.0.0-beta.15
// change scripts.testing to mocha in package.json
