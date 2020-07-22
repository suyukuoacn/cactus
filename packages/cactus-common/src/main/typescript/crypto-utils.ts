import secp256k1 from "secp256k1";
import sha3 from "sha3";
import stringify from "json-stable-stringify";

export class CryptoUtils {
  private cryptoMethod: String;
  private privateKey: any;

  constructor(public method: String, privateKey: any) {
    this.cryptoMethod = method;
    this.privateKey = privateKey;
  }

  public sign(msg: any): Uint8Array {
    console.log(stringify(msg));
    const pkey = Buffer.from(this.privateKey, `hex`);
    var signObj = secp256k1.ecdsaSign(
      Buffer.from(this.dataHash(msg), `hex`),
      pkey
    );
    return signObj.signature;
  }

  public verifySign(
    msg: any,
    signature: Uint8Array,
    pubKey: Uint8Array
  ): boolean {
    return secp256k1.ecdsaVerify(msg, signature, pubKey);
  }

  private dataHash(data: any): string {
    const hashObj = new sha3.SHA3Hash(256);
    hashObj.update(stringify(data));
    const hashMsg = hashObj.digest(`hex`);
    return hashMsg;
  }

  private str2buffer(msg: any): any {
    Buffer.from(msg, `hex`);
  }
}
