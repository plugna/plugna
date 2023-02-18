#!/bin/bash
# Prepare build for SVN
yarn prod

mkdir "export"

rsync -av \
--exclude=README.md \
--exclude=.gitignore \
--exclude=.git \
--exclude=main.js \
--exclude=yarn.lock \
--exclude=yarn-error.log \
--exclude=packer.sh \
--exclude=node_modules \
--exclude=mix-manifest.json \
--exclude=resources/js \
--exclude=webpack.mix.js \
--exclude=package.json \
--exclude=resources/scss \
./ export/plugna

cd export

zip -r plugna.zip .