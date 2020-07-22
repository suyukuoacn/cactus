// tslint:disable-next-line: no-var-requires
const tap = require("tap");

import { CryptoUtils } from "../../../../main/typescript/crypto-utils";

const { randomBytes } = require("crypto");
const secp256k1 = require("secp256k1");
const stringify = require("json-stable-stringify");

tap.test("Simple JSON Test", async (assert: any) => {
  // generate privKey
  let privKey;
  do {
    privKey = randomBytes(32);
  } while (!secp256k1.privateKeyVerify(privKey));

  const cryptoUtils = new CryptoUtils("secp256k1", privKey);

  const payload1 = { field1: "test11", field2: "test12", field3: 13 };
  const sign1 = cryptoUtils.sign(payload1);

  const payload2 = { field3: 13, field2: "test12", field1: "test11" };
  const sign2 = cryptoUtils.sign(payload2);

  assert.equals(sign1.toString, sign2.toString);
});

tap.test("Simple Nested JSON Test", async (assert: any) => {
  // generate privKey
  let privKey;
  do {
    privKey = randomBytes(32);
  } while (!secp256k1.privateKeyVerify(privKey));

  const cryptoUtils = new CryptoUtils("secp256k1", privKey);

  const inner1 = { someProperty: "cool", otherStuff: "also cool" };
  const outer1 = { innerProperty: inner1, outerProperty: "test" };
  const sign1 = cryptoUtils.sign(outer1);

  const inner2 = { otherStuff: "also cool", someProperty: "cool" };
  const outer2 = { outerProperty: "test", innerProperty: inner2 };
  const sign2 = cryptoUtils.sign(outer2);

  assert.equals(sign1.toString, sign2.toString);
});

tap.test("Simple Date JSON Test", async (assert: any) => {
  // generate privKey
  let privKey;
  do {
    privKey = randomBytes(32);
  } while (!secp256k1.privateKeyVerify(privKey));

  const cryptoUtils = new CryptoUtils("secp256k1", privKey);

  const date: Date = new Date();

  const inner1 = {
    someProperty: "cool",
    otherStuff: "also cool",
    dateProperty: date,
  };
  const outer1 = {
    innerProperty: inner1,
    outerProperty: "test",
    outerDateProperty: date,
  };
  const sign1 = cryptoUtils.sign(outer1);

  const inner2 = {
    dateProperty: date,
    otherStuff: "also cool",
    someProperty: "cool",
  };
  const outer2 = {
    outerDateProperty: date,
    outerProperty: "test",
    innerProperty: inner2,
  };
  const sign2 = cryptoUtils.sign(outer2);

  assert.equals(sign1.toString, sign2.toString);
});

tap.test("Circular JSON Test", async (assert: any) => {
  // generate privKey
  let privKey;
  do {
    privKey = randomBytes(32);
  } while (!secp256k1.privateKeyVerify(privKey));

  const cryptoUtils = new CryptoUtils("secp256k1", privKey);

  const date: Date = new Date();

  var obj: any = {
    a: "foo",
    b: obj,
  };

  const sign1 = cryptoUtils.sign(obj);

  console.log(sign1);
});

tap.test("Very Signature Test", async (assert: any) => {
  // generate privKey
  let privKey;
  do {
    privKey = randomBytes(32);
  } while (!secp256k1.privateKeyVerify(privKey));
  const pubKey = secp256k1.publicKeyCreate(privKey);

  const cryptoUtils = new CryptoUtils("secp256k1", privKey);

  const payload1 = { field1: "test11", field2: "test12", field3: 13 };
  const sign1 = cryptoUtils.sign(payload1);

  const verify = cryptoUtils.verifySign(payload1, sign1, pubKey);

  assert.equals("true", verify);
});
