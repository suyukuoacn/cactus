// tslint:disable-next-line: no-var-requires
import test from "tape";

import {
  JsObjectSigner,
  IJsStringObjectOptions,
} from "../../../main/typescript/js-object-signer";

import crypto from "crypto";
import secp256k1 from "secp256k1";
import stringify from "json-stable-stringify";

const keyPairs = JsObjectSigner.getKeyPairs();

const hashFunction = function (data: any): string {
  return crypto.createHash("sha256").update(stringify(data)).digest("hex");
};

const signFunction = function (msg: any, pkey: any): any {
  const signObj = secp256k1.ecdsaSign(
    Buffer.from(hashFunction(msg), `hex`),
    Buffer.from(pkey, `hex`)
  );
  return signObj.signature;
};

const verifySignFunction = function (
  msg: any,
  signature: any,
  pubKey: Uint8Array
): boolean {
  return secp256k1.ecdsaVerify(
    signature,
    Buffer.from(hashFunction(msg), `hex`),
    pubKey
  );
};

test("Simple JSON Test", async (assert: any) => {
  const jsStringObjectOption: IJsStringObjectOptions = {
    privateKey: keyPairs.privateKey,
    logLevel: "debug",
  };
  const jsStringObject = new JsObjectSigner(jsStringObjectOption);

  const payload1 = { field1: "test11", field2: "test12", field3: 13 };
  const sign1 = jsStringObject.sign(payload1);

  const payload2 = { field3: 13, field2: "test12", field1: "test11" };
  const sign2 = jsStringObject.sign(payload2);

  assert.equals(sign1.toString, sign2.toString);
  assert.end();
});

test("Simple Nested JSON Test", async (assert: any) => {
  const jsStringObjectOption: IJsStringObjectOptions = {
    privateKey: keyPairs.privateKey,
    logLevel: "debug",
  };
  const jsStringObject = new JsObjectSigner(jsStringObjectOption);

  const inner1 = { someProperty: "cool", otherStuff: "also cool" };
  const outer1 = { innerProperty: inner1, outerProperty: "test" };
  const sign1 = jsStringObject.sign(outer1);

  const inner2 = { otherStuff: "also cool", someProperty: "cool" };
  const outer2 = { outerProperty: "test", innerProperty: inner2 };
  const sign2 = jsStringObject.sign(outer2);

  assert.equals(sign1.toString, sign2.toString);
  assert.end();
});

test("Simple Date JSON Test", async (assert: any) => {
  const jsStringObjectOption: IJsStringObjectOptions = {
    privateKey: keyPairs.privateKey,
    logLevel: "debug",
  };
  const jsStringObject = new JsObjectSigner(jsStringObjectOption);

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
  const sign1 = jsStringObject.sign(outer1);

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
  const sign2 = jsStringObject.sign(outer2);

  assert.equals(sign1.toString, sign2.toString);
  assert.end();
});

test("Circular JSON Test", async (assert: any) => {
  const jsStringObjectOption: IJsStringObjectOptions = {
    privateKey: keyPairs.privateKey,
    logLevel: "debug",
  };
  const jsStringObject = new JsObjectSigner(jsStringObjectOption);

  const date: Date = new Date();

  const obj: any = { a: "foo" };
  obj.b = obj;

  assert.throws(() => jsStringObject.sign(obj));
  assert.end();
});

test("Very Signature Test", async (assert: any) => {
  const jsStringObjectOption: IJsStringObjectOptions = {
    privateKey: keyPairs.privateKey,
    logLevel: "debug",
  };
  const jsStringObject = new JsObjectSigner(jsStringObjectOption);

  const payload1 = { field1: "test11", field2: "test12", field3: 13 };
  const sign1 = jsStringObject.sign(payload1);

  const verify = jsStringObject.verify(payload1, sign1, keyPairs.publicKey);

  assert.equals(true, verify);
  assert.end();
});

test("Test optional sign function", async (assert: any) => {
  const jsStringObjectOption: IJsStringObjectOptions = {
    privateKey: keyPairs.privateKey,
    logLevel: "debug",
    signatureFunc: signFunction,
  };

  const jsStringObject = new JsObjectSigner(jsStringObjectOption);

  const inner1 = { someProperty: "cool", otherStuff: "also cool" };
  const outer1 = { innerProperty: inner1, outerProperty: "test" };
  const sign1 = jsStringObject.sign(outer1);

  const inner2 = { otherStuff: "also cool", someProperty: "cool" };
  const outer2 = { outerProperty: "test", innerProperty: inner2 };
  const sign2 = jsStringObject.sign(outer2);

  assert.equals(sign1.toString, sign2.toString);
  assert.end();
});

test("Test optional verify sign function", async (assert: any) => {
  const jsStringObjectOption: IJsStringObjectOptions = {
    privateKey: keyPairs.privateKey,
    logLevel: "debug",
    signatureFunc: signFunction,
    verifySignatureFunc: verifySignFunction,
  };

  const jsStringObject = new JsObjectSigner(jsStringObjectOption);

  const inner1 = { someProperty: "cool", otherStuff: "also cool" };
  const outer1 = { innerProperty: inner1, outerProperty: "test" };
  const sign1 = jsStringObject.sign(outer1);

  const verify = jsStringObject.verify(outer1, sign1, keyPairs.publicKey);

  assert.equals(true, verify);
  assert.end();
});

test("Test optional hash function", async (assert: any) => {
  const jsStringObjectOption: IJsStringObjectOptions = {
    privateKey: keyPairs.privateKey,
    logLevel: "debug",
    hashFunc: hashFunction,
  };

  const jsStringObject = new JsObjectSigner(jsStringObjectOption);

  const inner1 = { someProperty: "cool", otherStuff: "also cool" };
  const outer1 = { innerProperty: inner1, outerProperty: "test" };
  const sign1 = jsStringObject.sign(outer1);

  const inner2 = { otherStuff: "also cool", someProperty: "cool" };
  const outer2 = { outerProperty: "test", innerProperty: inner2 };
  const sign2 = jsStringObject.sign(outer2);

  assert.equals(sign1.toString, sign2.toString);
  assert.end();
});

test("Test missing required constructor field", async (assert: any) => {
  try {
    const jsStringObjectOption: IJsStringObjectOptions = {
      privateKey: undefined,
    };

    const jsStringObject = new JsObjectSigner(jsStringObjectOption);
  } catch (e) {
    assert.equal(e.message, "JsStringObject#ctor options.privateKey falsy.");
    assert.end();
  }
});
