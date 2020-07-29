import { Logger } from "./logging/logger";
import { LoggerProvider } from "./logging/logger-provider";

import secp256k1 from "secp256k1";
import sha3 from "sha3";
import stringify from "json-stable-stringify";

export class CryptoUtils {
  private cryptoMethod: string;
  private privateKey: any;
  private readonly logger: Logger;

  constructor(public method: string, privateKey: any) {
    this.cryptoMethod = method;
    this.privateKey = privateKey;

    this.logger = LoggerProvider.getOrCreate({
      label: "crypto-utils",
      level: "debug",
    });
  }

  /**
   * Generate signature from formated message
   * @package msg
   * @returns Generated signature
   */
  public sign(msg: any): Uint8Array {
    // FIXME use the logger factory to get a logger instead
    // tslint:disable-next-line: no-console
    this.logger.info("Message to sign: " + stringify(msg));
    const pkey = Buffer.from(this.privateKey, `hex`);
    const signObj = secp256k1.ecdsaSign(
      Buffer.from(this.dataHash(msg), `hex`),
      pkey
    );
    return signObj.signature;
  }

  /**
   * Verify if a signature corresponds to given message and public key
   * @param msg
   * @param pubKey
   * @param signature
   * @returns {boolean}
   */
  public verifySign(
    msg: any,
    signature: Uint8Array,
    pubKey: Uint8Array
  ): boolean {
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

  /**
   * Cast string into hexadecimal encoded buffer
   * @param msg
   * @return {any}
   */
  private str2buffer(msg: any): any {
    Buffer.from(msg, `hex`);
  }
}
