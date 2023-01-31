import '../styles/index.css'
import React from 'react'
import App from 'next/app'
import NProgressHandler from 'components/NProgressHandler'
import Head from 'next/head'
import { AuthContextProvider } from 'context/auth'
import { Toaster } from 'components/Toast'
import { SolanaWalletProvider } from 'context/solana-wallet'
import { SolanaTokenProvider } from 'context/solana-token'
import { ProgramProvider } from 'context/program'
import Moralis from 'moralis'
import { GrantProvider } from 'context/grant'

const { MORALIS_API_KEY } = process.env

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props

    if (!Moralis.Core.isStarted && MORALIS_API_KEY) {
      Moralis.start({
        apiKey: MORALIS_API_KEY,
      })
    }

    return (
      <>
        <Head>
          <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
          <title>NextJS boilerplate | Dwarves Foundation</title>
          <meta
            property="og:title"
            content="NextJS boilerplate | Dwarves Foundation"
          />
          <meta name="twitter:site" content="@dwarvesf" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="description"
            content="Opinionated React template for building web applications at scale."
          />
          <meta
            property="og:description"
            content="Opinionated React template for building web applications at scale."
          />
          <meta property="og:image" content="/thumbnail.jpeg" />
          <meta name="twitter:image" content="/thumbnail.jpeg" />
        </Head>
        <AuthContextProvider>
          <SolanaWalletProvider>
            <SolanaTokenProvider>
              <ProgramProvider>
                <GrantProvider>
                  <NProgressHandler />
                  <Component {...pageProps} />
                </GrantProvider>
              </ProgramProvider>
            </SolanaTokenProvider>
          </SolanaWalletProvider>
        </AuthContextProvider>
        <Toaster />
      </>
    )
  }
}
export default MyApp
