import { NetworkErrorMessage } from "./NetworkErrorMessage"
import styles from '../styles/Home.module.css'
export function ConnectWallet({ connectWallet, networkError, dismiss }) {
  return (
    <>
      <div>
        {networkError && (
          <NetworkErrorMessage 
            message={networkError} 
            dismiss={dismiss} 
          />
        )}
      </div>

      
      <button className={styles.connect} type="button" onClick={connectWallet}>
        Connect Wallet
      </button>
    </>
  )
}