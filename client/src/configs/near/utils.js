import { connect, Contract, keyStores, WalletConnection } from 'near-api-js'
import { CONTRACT_CHANGE_METHODS, CONTRACT_VIEW_METHODS } from '../appconfig'
import getConfig from './config'

// const nearConfig = getConfig(process.env.NODE_ENV || 'development')
const nearConfig = getConfig('testnet')

export async function initContract() {
  const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))

  window.walletConnection =  new WalletConnection(near)

  window.accountId = await window.walletConnection.getAccountId()

  window.contract =  new Contract(window.walletConnection.account(), nearConfig.contractName, {
    viewMethods: CONTRACT_VIEW_METHODS,
    changeMethods: CONTRACT_CHANGE_METHODS,
  })
}

export function disconnectWallet() {
  window.walletConnection.signOut()
  window.location.replace(window.location.origin + window.location.pathname)
}

export function connectWallet() {
  window.walletConnection.requestSignIn(nearConfig.contractName)
}


export async function getCauses(){
  let causes = await window.contract.get_causes()
  return causes
}