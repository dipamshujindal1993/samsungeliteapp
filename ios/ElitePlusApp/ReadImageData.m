//
//  ReadImageData.m
//  demoApp
//
//  Created by eCOM-Shahzad.md on 30/01/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <Photos/Photos.h>
#import <UIKit/UIKit.h>
@interface ReadImageData : NSObject <RCTBridgeModule>
@end

@implementation ReadImageData

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(readImage:(NSString *)input isVideo:(BOOL) isVideo callback:(RCTResponseSenderBlock)callback)
{
  PHFetchResult *result = [PHAsset fetchAssetsWithLocalIdentifiers:@[input] options:nil];
  [result enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
      PHAsset *asset = (PHAsset *)obj;
    if(isVideo){
      PHVideoRequestOptions * option = PHVideoRequestOptions.new;
      option.version =  PHVideoRequestOptionsVersionOriginal;
      [PHImageManager.defaultManager requestAVAssetForVideo:asset options:option resultHandler:^(AVAsset * _Nullable asset, AVAudioMix * _Nullable audioMix, NSDictionary * _Nullable info) {
        NSURL *url = (NSURL *)[(AVURLAsset *)asset URL];
        NSString *path = [url.absoluteString substringFromIndex:7];
        NSFileManager *fileManager = [NSFileManager defaultManager];
          BOOL isExist = [fileManager fileExistsAtPath:path];
        if(isExist){
          callback(@[path]);
        }else{
          callback(@[@"No Result"]);
        }
      }];
    }else{
      [asset requestContentEditingInputWithOptions:nil completionHandler:^(PHContentEditingInput * _Nullable contentEditingInput, NSDictionary * _Nonnull info) {
        NSString* path = [contentEditingInput.fullSizeImageURL.absoluteString substringFromIndex:7];
          NSFileManager *fileManager = [NSFileManager defaultManager];
          BOOL isExist = [fileManager fileExistsAtPath:path];
        if(isExist){
          callback(@[path]);
        }else{
          callback(@[@"No Result"]);
        }
      }];
    }
  }];
  
}
@end
