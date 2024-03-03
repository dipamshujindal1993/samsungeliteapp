//
//  RSA.swift
//  ElitePlusApp
//
//  Created by David Tran/Platform /SEA/Engineer/삼성전자 on 1/21/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

import SwiftyRSA

@objc(RSA)
class RSA: NSObject {
  @objc static func requiresMainQueueSetup() -> Bool {
    return false
  }

  @objc(encrypt:text:resolver:rejecter:)
  func encrypt(encryptionKey: String,
               text: String,
               resolver resolve: RCTPromiseResolveBlock,
               rejecter reject: RCTPromiseRejectBlock) -> Void {
    if (encryptionKey.isEmpty) {
      reject("encryptionKey", "Please provide encryption key!", NSError(domain: "", code: 200, userInfo: nil))
      return
    }

    let parts = encryptionKey.split(separator: ".")
    if (parts.count != 2) {
      reject("encryptionKey", "Please provide valid encryption key!", NSError(domain: "", code: 200, userInfo: nil))
      return
    }

    let modulus = String(parts[0])
    let exponent = String(parts[1])

    let keyString = RSAConverter.pemFrom(mod_b64: modulus, exp_b64: exponent) ?? ""
    let publicKey = try! PublicKey(pemEncoded: keyString)

    let clear = try! ClearMessage(string: text, using: .utf8)
    let encrypted = try! clear.encrypted(with: publicKey, padding: .PKCS1)

    resolve(encrypted.base64String)
  }
}
