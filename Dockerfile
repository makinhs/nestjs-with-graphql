FROM node:14.17-alpine3.11 AS BUILD_IMAGE

RUN apk update && apk add yarn curl bash python g++ make && rm -rf /var/cache/apk/*

# install node-prune (https://github.com/tj/node-prune)
RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin
RUN apk add  g++ gcc libgcc libstdc++ linux-headers make python
RUN npm install -g node-gyp
RUN npm install
RUN npm i -g rimraf
WORKDIR /usr/src/app

RUN yarn --frozen-lockfile

# install dependencies

COPY . .

# lint & test
#RUN yarn lint & yarn test

# build application
RUN yarn install
RUN yarn build


FROM node:14.17-alpine3.11

USER 1000
RUN mkdir -p /home/node/app/
RUN mkdir -p /home/node/app/node_modules
RUN mkdir -p /home/node/app/dist

RUN chown -R 1000:1000 /home/node/app
RUN chown -R 1000:1000 /home/node/app/node_modules
RUN chown -R 1000:1000 /home/node/app/dist

WORKDIR /home/node/app

# copy from build image
COPY --from=BUILD_IMAGE /usr/src/app/dist /home/node/app/dist
COPY --from=BUILD_IMAGE /usr/src/app/package.json /home/node/app/
COPY --from=BUILD_IMAGE /usr/src/app/node_modules /home/node/app/node_modules

EXPOSE 3000
CMD ["node", "dist/main.js"]
