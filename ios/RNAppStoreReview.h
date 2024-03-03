//
//  RNAppStoreReview.h
//  ElitePlusApp
//
//  Created by eCOM-Shahzad.md on 10/02/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#ifndef AppRate_h
#define AppRate_h

#if __has_include(<React/RCTBridgeModule.h>)
#import <React/RCTBridgeModule.h>
#else
#import "RCTBridgeModule.h"
#endif

#import <StoreKit/StoreKit.h>


@interface RNAppStoreReview: NSObject <RCTBridgeModule, SKStoreProductViewControllerDelegate>

@end

#endif /* AppRate_h */
