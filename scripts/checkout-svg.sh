#!/bin/sh
SVG_DIR="App/Images/svg"
rm -rf $SVG_DIR
git clone git@git.samsungmtv.com:omnichannel/svg.git $SVG_DIR
if [ -d "$SVG_DIR" ]; then
  cd $SVG_DIR
  {
    echo {
    echo '  "name":"@svg"'
    echo }
  } > package.json
fi