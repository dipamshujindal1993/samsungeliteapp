#!/bin/sh
RNCDIR="./node_modules/react-native-config/ios"

if [ ! -z "$SYMROOT" ]; then
  # Ensure directories exist before copying files
  mkdir -p $SYMROOT
  mkdir -p $BUILD_DIR

  # Build dotenv
  cd $RNCDIR
  ./ReactNativeConfig/BuildDotenvConfig.ruby
  cd -

  # Copy generated dotenv files to node_modules directory
  cp "$BUILD_DIR/GeneratedInfoPlistDotEnv.h" "$RNCDIR/ReactNativeConfig/GeneratedInfoPlistDotEnv.h"
  cp "$SYMROOT/GeneratedDotEnv.m" "$RNCDIR/ReactNativeConfig/GeneratedDotEnv.m"
fi