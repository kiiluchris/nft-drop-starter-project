import React, { useEffect, useState } from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';
import CandyMachine from './CandyMachine'

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const wrapPhantomFunction = (f) => {
  return async (...args) => {
    try {
      const { solana } = window
      if (solana) {
        if (solana.isPhantom) {
          await f(solana, ...args)
        }
      } else {
        alert('Solana object not found, get a phantom wallet 👻')
      }
    } catch (err) {
      console.error(err)
    }
  }
}


const renderNotConnectedContainer = (connectWallet) => (
  <button
    className="cta-button connect-wallet-button"
    onClick={connectWallet}
  >
    Connect to Wallet
  </button>
)

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null)

  const checkIfWalletIsConnected = wrapPhantomFunction(async (solana) => {
    console.log('Phantom wallet found')
    const response = await solana.connect({ onlyIfTrusted: true });
    const pubkey = response.publicKey.toString()
    console.log(
      'Connected with Public Key: %s',
      pubkey,
    )
    setWalletAddress(pubkey)
  })

  const connectWallet = wrapPhantomFunction(async (solana) => {
    const response = await solana.connect();
    const pubkey = response.publicKey.toString()
    console.log(
      'Connected with Public Key: %s',
      pubkey,
    )
    setWalletAddress(pubkey)
  })

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected()
    };
    window.addEventListener('load', onLoad)
    return () => window.removeEventListener('load', onLoad)
  }, [checkIfWalletIsConnected])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🍭 Candy Drop</p>
          <p className="sub-text">NFT drop machine with fair mint</p>
          {!walletAddress && renderNotConnectedContainer(connectWallet)}
        </div>
        {walletAddress && <CandyMachine walletAddress={window.solana} />}
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
