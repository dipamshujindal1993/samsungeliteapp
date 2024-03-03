//
//  RNAppStoreReview.m
//  ElitePlusApp
//
//  Created by eCOM-Shahzad.md on 10/02/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "RNAppStoreReview.h"

#import <Foundation/Foundation.h>

@implementation RNAppStoreReview

RCT_EXPORT_MODULE();

- (dispatch_queue_t) methodQueue
{
    return dispatch_get_main_queue();
}

- (UIViewController*) getRootVC {
    UIViewController *root = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
    while (root.presentedViewController != nil) {
        root = root.presentedViewController;
    }

    return root;
}

- (void) openStoreProductWithiTunesItemIdentifierWithinApp:(NSString *) appIdentifier {
    UIViewController *root = [self getRootVC];

    SKStoreProductViewController *storeViewController = [[SKStoreProductViewController alloc] init];
    storeViewController.delegate = self;

    NSDictionary *parameters = @{ SKStoreProductParameterITunesItemIdentifier: appIdentifier };

    [storeViewController loadProductWithParameters:parameters completionBlock:^(BOOL result, NSError *error)  {
        if (result) {
            [root presentViewController:storeViewController animated:YES completion:nil];
        } else {
            NSLog(@"ERROR WITH STORE CONTROLLER %@\n", error.description);
            //redirect to app store
            [self openStoreProductWithiTunesItemIdentifier:appIdentifier];
        }
    }];
}

- (void) openStoreProductWithiTunesItemIdentifier:(NSString *) appIdentifier {
    NSString *strUrl = [NSString stringWithFormat:@"%@%@%@", @"itms-apps://itunes.apple.com/app/id", appIdentifier, @"?action=write-review"];
    NSURL *url = [NSURL URLWithString: strUrl];

    if ([[UIApplication sharedApplication] canOpenURL:url]) {
        [[UIApplication sharedApplication] openURL:url];
    }
}

- (void) productViewControllerDidFinish:(SKStoreProductViewController*)viewController {
    [viewController dismissViewControllerAnimated:YES completion:nil];
}

RCT_EXPORT_METHOD(requestReview:(NSString *) appIdentifier)
{
    if ([SKStoreReviewController class]) {
        [SKStoreReviewController requestReview];
    } else if ([SKStoreProductViewController class]) {
        [self openStoreProductWithiTunesItemIdentifierWithinApp:appIdentifier];
    } else {
        [self openStoreProductWithiTunesItemIdentifier:appIdentifier];
    }
}

@end
