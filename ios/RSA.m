//
//  RSA.m
//  ElitePlusApp
//
//  Created by David Tran/Platform /SEA/Engineer/삼성전자 on 1/21/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RSA, NSObject)

RCT_EXTERN_METHOD(encrypt:(NSString *)encryptionKey
                  text:(NSString *)text
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
