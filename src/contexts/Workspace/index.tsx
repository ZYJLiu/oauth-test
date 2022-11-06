import { createContext, useState, useContext, ReactNode } from "react"
import {
  Program,
  AnchorProvider,
  Idl,
  setProvider,
} from "@project-serum/anchor"
import idl from "./token_rewards.json"
import NftIdl from "./nft.json"
import { IDL, TokenRewards } from "./token_rewards"
import { IDL as NftIDL, Nft } from "./nft"
import { Connection, PublicKey } from "@solana/web3.js"
import MockWallet from "./MockWallet"

const WorkspaceContext = createContext({})
const programId = new PublicKey(idl.metadata.address)
const nftProgramId = new PublicKey(NftIdl.metadata.address)

interface WorkSpace {
  connection?: Connection
  provider?: AnchorProvider
  program?: Program<TokenRewards>
  nftProgram?: Program<Nft>
}

const WorkspaceProvider = ({ children }: any) => {
  const network = "https://api.devnet.solana.com/"
  const connection = new Connection(network)
  const provider = new AnchorProvider(connection, MockWallet, {})

  setProvider(provider)
  const program = new Program(
    IDL as Idl,
    programId
  ) as unknown as Program<TokenRewards>
  const nftProgram = new Program(
    NftIDL as Idl,
    nftProgramId
  ) as unknown as Program<Nft>
  const workspace = {
    connection,
    provider,
    program,
    nftProgram,
  }

  return (
    <WorkspaceContext.Provider value={workspace}>
      {children}
    </WorkspaceContext.Provider>
  )
}

const useWorkspace = (): WorkSpace => {
  return useContext(WorkspaceContext)
}

export { WorkspaceProvider, useWorkspace }
