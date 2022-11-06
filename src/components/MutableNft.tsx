import { FC, useState, Fragment, useEffect, useRef, useCallback } from "react"
import {
  Transaction,
  PublicKey,
  sendAndConfirmTransaction,
} from "@solana/web3.js"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import {
  Metaplex,
  walletAdapterIdentity,
  bundlrStorage,
  MetaplexFile,
  toMetaplexFileFromBrowser,
  findMetadataPda,
  keypairIdentity,
  toMetaplexFileFromJson,
  findMasterEditionV2Pda,
} from "@metaplex-foundation/js"
import { awsStorage } from "@metaplex-foundation/js-plugin-aws"
import { S3Client } from "@aws-sdk/client-s3"
11
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Container,
  AspectRatio,
  Box,
  BoxProps,
  forwardRef,
  Text,
  Image,
} from "@chakra-ui/react"

import { useWorkspace } from "../contexts/Workspace"
import { useAuthContext } from "../contexts/Auth"

export const MutableNft: FC = () => {
  const keypair = useAuthContext()
  const workspace = useWorkspace()
  const program = workspace.program
  const nftProgram = workspace.nftProgram
  console.log(nftProgram)

  const { connection } = useConnection()

  const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  )

  // build and send transaction
  const update = useCallback(async () => {
    if (!keypair) {
      return
    }

    // get mint metedata account PDA
    const metadataPDA = await findMetadataPda(
      new PublicKey("3MFTFVZ9zm6YaZT8CzZQUJDY5JSnq2D7WuoNNCxFzEDx")
    )

    const transaction = await nftProgram.methods
      .updateMetadata(
        "https://s3.us-east-1.amazonaws.com/metaplex-test-upload/THREE-METADATA",
        "Update",
        "Update"
      )
      .accounts({
        metadata: metadataPDA,
        auth: new PublicKey("GPYKTMcZqqNXDdgmx4DcFEGb38JNBMBBkYTkCETDPiFs"),
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        payer: keypair.publicKey,
      })
      .transaction()

    // send transaction
    const transactionSignature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [keypair]
    )
    await connection.confirmTransaction(transactionSignature)
    const url = `https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
    console.log(url)

    alert("Success")
  }, [connection, keypair])

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"}>
      <Stack
        spacing={4}
        w={"full"}
        maxW={"md"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
          Update Metadata
        </Heading>

        <Stack spacing={6}>
          <Button
            bg={"blue.400"}
            color={"white"}
            _hover={{
              bg: "blue.500",
            }}
            onClick={update}
          >
            Update
          </Button>
        </Stack>
      </Stack>
    </Flex>
  )
}
