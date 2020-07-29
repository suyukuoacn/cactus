import test from "tape";

import { CryptoUtils } from "../../../main/typescript/crypto-utils";

import { randomBytes } from "crypto";
import secp256k1 from "secp256k1";

// generate privKey
let privKey: any;
do {
  privKey = randomBytes(32);
} while (!secp256k1.privateKeyVerify(privKey));
const pubKey = secp256k1.publicKeyCreate(privKey);

const cryptoUtils = new CryptoUtils("secp256k1", privKey);

test("Simple JSON Test", async (assert: any) => {
  const payload1 = { field1: "test11", field2: "test12", field3: 13 };
  const sign1 = cryptoUtils.sign(payload1);

  const payload2 = { field3: 13, field2: "test12", field1: "test11" };
  const sign2 = cryptoUtils.sign(payload2);

  assert.equals(sign1.toString, sign2.toString);
  assert.end();
});

test("Simple Nested JSON Test", async (assert: any) => {
  const inner1 = { someProperty: "cool", otherStuff: "also cool" };
  const outer1 = { innerProperty: inner1, outerProperty: "test" };
  const sign1 = cryptoUtils.sign(outer1);

  const inner2 = { otherStuff: "also cool", someProperty: "cool" };
  const outer2 = { outerProperty: "test", innerProperty: inner2 };
  const sign2 = cryptoUtils.sign(outer2);

  assert.equals(sign1.toString, sign2.toString);
  assert.end();
});

test("Simple Date JSON Test", async (assert: any) => {
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
  assert.end();
});

test("Circular JSON Test", async (assert: any) => {
  const date: Date = new Date();

  const obj: any = {
    a: "foo",
  };
  obj.b = obj;

  assert.throws(() => cryptoUtils.sign(obj));
  assert.end();
});

test("Very Signature Test", async (assert: any) => {
  const payload1 = { field1: "test11", field2: "test12", field3: 13 };
  const sign1 = cryptoUtils.sign(payload1);

  const verify = cryptoUtils.verifySign(payload1, sign1, pubKey);

  assert.equals(true, verify);
});
