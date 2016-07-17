#!/bin/bash

mkdir -p proto
rm -rf proto/*
cd ./POGOProtos/
./compile.py -l python -o ../proto
cd ../
find ./proto/ -type d -exec touch {}/__init__.py \;
