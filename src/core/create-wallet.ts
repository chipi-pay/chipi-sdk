import type { DeploymentData, GaslessOptions } from "@avnu/gasless-sdk";
import {
  BASE_URL,
  SEPOLIA_BASE_URL,
  fetchBuildTypedData,
  fetchExecuteTransaction,
} from "@avnu/gasless-sdk";
import type { Call } from "starknet";
import {
  Account,
  cairo,
  CairoCustomEnum,
  CairoOption,
  CairoOptionVariant,
  CallData,
  ec,
  hash,
  num,
  RpcProvider,
  stark,
} from "starknet";
import { encryptPrivateKey } from "./lib/encryption";
import { CreateWalletParams, CreateWalletResponse, WalletData } from "./types";


export const createArgentWallet = async (
  params: CreateWalletParams
): Promise<CreateWalletResponse> => {

  console.log("create wallet Params: ", params);
  try {
    const { encryptKey, apiKey, network, rpcUrl } = params;

    const options: GaslessOptions = {
      baseUrl: network === "mainnet" ? BASE_URL : SEPOLIA_BASE_URL,
      apiKey,
    };
    const provider = new RpcProvider({
      nodeUrl: rpcUrl,
    });

    // Generating the private key with Stark Curve
    const privateKeyAX = stark.randomAddress();
    const starkKeyPubAX = ec.starkCurve.getStarkKey(privateKeyAX);

    // Using Argent X Account v0.4.0 class hash
    // POR REVISAR: CLASSHASH ES EL MISMO EN MAINNET?
    const accountClassHash = params.argentClassHash;

    // Calculate future address of the ArgentX account
    const axSigner = new CairoCustomEnum({
      Starknet: { pubkey: starkKeyPubAX },
    });
    // Set the dApp Guardian address
    const axGuardian = new CairoOption<unknown>(CairoOptionVariant.None);

    const AXConstructorCallData = CallData.compile({
      owner: axSigner,
      guardian: axGuardian,
    });

    const contractAddress = hash.calculateContractAddressFromHash(
      starkKeyPubAX,
      accountClassHash,
      AXConstructorCallData,
      0
    );

    // Initiating Account
    const account = new Account(provider, contractAddress, privateKeyAX);
    console.log("Account ", { ...account });

    // Ping to activate the account
    const initialValue: Call[] = [
      {
        contractAddress: params.activateContractAddress,
        entrypoint: params.activateContractEntryPoint,
        calldata: [contractAddress], // , cairo.felt("Hello, from Chipi SDK!")
      },
    ];

    const typeData = await fetchBuildTypedData(
      contractAddress,
      initialValue,
      undefined,
      undefined,
      { baseUrl: BASE_URL, apiKey: options.apiKey },
      accountClassHash
    );

    const userSignature = await account.signMessage(typeData);

    const deploymentData: DeploymentData = {
      class_hash: accountClassHash,
      salt: starkKeyPubAX,
      unique: `${num.toHex(0)}`,
      calldata: AXConstructorCallData.map((value) => num.toHex(value)),
    };

    const executeTransaction = await fetchExecuteTransaction(
      contractAddress,
      JSON.stringify(typeData),
      userSignature,
      options,
      deploymentData
    );

    const encryptedPrivateKey = encryptPrivateKey(privateKeyAX, encryptKey);
    console.log("Encrypted private key: ", encryptedPrivateKey);

    // TODO: Guardar la wallet en dashboard
    console.log(
      "Wallet created successfully with txHash: ",
      executeTransaction.transactionHash
    );
    console.log("Account address: ", contractAddress);
    return {
      success: true,
      wallet: {
        publicKey: contractAddress,
        encryptedPrivateKey,
      },
      txHash: executeTransaction.transactionHash,
    };
  } catch (error: unknown) {
    console.error("Error detallado:", error);

    if (error instanceof Error && error.message.includes("SSL")) {
      throw new Error(
        "Error de conexión SSL. Intenta usando NODE_TLS_REJECT_UNAUTHORIZED=0 o verifica la URL del RPC"
      );
    }

    throw new Error(
      `Error creating Argent wallet: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
