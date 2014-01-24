#!/bin/sh
echo "Publishing Res/ ..."
cp -r Res ../..
echo "Done."

echo "Publishing Articles/ ..."
cp -r Articles ../..
echo "Done."

echo "Publishing new_index.html ..."
cp new_index.html ../../index.html
echo "Done."

echo "Publish done."
