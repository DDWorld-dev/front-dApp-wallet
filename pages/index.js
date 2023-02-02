import React, { Component } from 'react'
import { ethers } from 'ethers'
import styles from '../styles/Home.module.css'
import { ConnectWallet } from '../components/ConnectWallet'
import LockAddress from '../contracts/Lock-contract-address.json'
import LockArtifact from '../contracts/Lock.json'

const HARDHAT_NETWORK_ID = '1337'

export default class Game extends Component {       

    constructor(props) {
  
      super(props)
      this.textInput = React.createRef();

      this.initialState = {
        selectedAccount: null,
        networkError: null,
        balance: null
      }
     

      this.state = this.initialState
      
    }
    
  
    _connectWallet = async () => {

      if(window.ethereum === undefined) {
        this.setState({
          networkError: 'Please install Metamask!'
        })
        return
      }
  
      const [selectedAddress] = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })
      
      if(!this._checkNetwork()) { return }
  
      this._initialize(selectedAddress)
  
      window.ethereum.on('accountsChanged', ([newAddress]) => {
        if(newAddress === undefined) {
          return this._resetState()
        }
  
        this._initialize(newAddress)
      })
  
      window.ethereum.on('chainChanged', ([networkId]) => {
        this._resetState()
      })
    
     
      
    }
    _checkNetwork() {
      if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) { return true }
  
      this.setState({
        networkError: 'Please connect to localhost:8545'
      })
  
      return false
    } 

    async _initialize(selectedAddress) {
      
      this._provider = new ethers.providers.Web3Provider(window.ethereum)
  
      this.Lock = new ethers.Contract(
        LockAddress.Lock,
        LockArtifact.abi,
        this._provider.getSigner(0)
      )
     
      this.setState({
        selectedAccount: selectedAddress
      }, async () => 
        await this.updateBalance()
    ) 
   
   
  
    }
   
    async updateBalance() {
      const newBalance = (await this._provider.getBalance(
        this.state.selectedAccount
      )).toString()
  
      this.setState({
        balance: newBalance
      })
    }
  

    _resetState() {
      this.setState(this.initialState)
    }
  
    
    _dismissNetworkError = () => {
      this.setState({
        networkError: null
      })
    }
  
   
  
    
  

  render() {
    if(!this.state.selectedAccount) {
     
      return <>
       
          <div className={styles.front}>
            <ConnectWallet  connectWallet={this._connectWallet} networkError={this.state.networkError} dismiss={this._dismissNetworkError}/>
          </div >
         
          
        </> 
      }
    return(
      
      <>
      {this.state.balance &&  
       <p className={styles.balance}>balance: {ethers.utils.formatEther(this.state.balance).slice(0,10)} ETH</p>}
       
     </>
    )
        
       
      
    }
  } 


