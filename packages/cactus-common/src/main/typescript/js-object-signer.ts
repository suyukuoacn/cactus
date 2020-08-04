import { Logger } from "./logging/logger";
import { LoggerProvider } from "./logging/logger-provider";
import { LogLevelDesc } from "loglevel";

import crypto from "crypto";
import secp256k1 from "secp256k1";
import sha3 from "sha3";
import stringify from "json-stable-stringify";

export type SignatureFunction = (msg: any, pkey: any) => any;
export type VerifySignatureFunction = (
  msg: any,
  signature: any,
  pubKey: Uint8Array
) => boolean;
export type HashFunction = (data: any) => string;

export interface IJsStringObjectOptions {
  privateKey: any;
  signatureFunc?: SignatureFunction;
  verifySignatureFunc?: VerifySignatureFunction;
  hashFunc?: HashFunction;
  logLevel?: LogLevelDesc;
}

export interface IJsStringObjectKeyPairs {
  privateKey: any;
  publicKey: any;
}

export class JsStringObjectSigner {
  private privateKey: any;
  private signatureFunc: any;
  private verifySignatureFunc: any;
  private hashFunc: any;
  private readonly logger: Logger;

  constructor(public readonly options: IJsStringObjectOptions) {
    if (!options) {
      throw new Error(`JsStringObject#ctor options falsy.`);
    }
    if (!options.privateKey) {
      throw new Error(`JsStringObject#ctor options.privateKey falsy.`);
    }

    this.privateKey = options.privateKey;
    this.signatureFunc = options.signatureFunc;
    this.verifySignatureFunc = options.verifySignatureFunc;
    this.hashFunc = options.hashFunc;

    this.logger = LoggerProvider.getOrCreate({
      label: "js-string-object",
      level: options.logLevel || "INFO",
    });
  }

  /**
   * Generate random private and public secp256k1 key
   * @return Generated key pair
   */
  static getKeyPairs(): IJsStringObjectKeyPairs {
    let privKey: any;
    // generate secp256K1 private key
    do {
      privKey = crypto.randomBytes(32);
    } while (!secp256k1.privateKeyVerify(privKey));

    // generate secp256K1 public key
    const pubKey = secp256k1.publicKeyCreate(privKey);

    return { privateKey: privKey, publicKey: pubKey };
  }

  /**
   * Generate signature from formated message
   * @param msg
   * @returns Generated signature
   */
  public sign(msg: any): any {
    this.logger.debug("Message to sign: " + stringify(msg));

    if (this.signatureFunc) {
      return this.signatureFunc(msg, this.privateKey);
    } else {
      let hashMsg: any;
      if (this.hashFunc) {
        hashMsg = this.hashFunc(msg);
      } else {
        hashMsg = this.dataHash(msg);
      }

      const pkey = Buffer.from(this.privateKey, `hex`);
      const signObj = secp256k1.ecdsaSign(Buffer.from(hashMsg, `hex`), pkey);
      return signObj.signature;
    }
  }

  /**
   * Verify if a signature corresponds to given message and public key
   * @param msg
   * @param pubKey
   * @param signature
   * @returns {boolean}
   */
  public verify(msg: any, signature: Uint8Array, pubKey: any): boolean {
    if (this.verifySignatureFunc) {
      return this.verifySignatureFunc(msg, signature, pubKey);
    }
    return secp256k1.ecdsaVerify(
      signature,
      Buffer.from(this.dataHash(msg), `hex`),
      pubKey
    );
  }

  /**
   * Format message to be signed
   * @param data
   * @returns {string}
   */
  private dataHash(data: any): string {
    const hashObj = new sha3.SHA3Hash(256);
    hashObj.update(stringify(data));
    const hashMsg = hashObj.digest(`hex`);
    return hashMsg;
  }
}
