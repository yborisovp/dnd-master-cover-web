# pull the base image
FROM node:lts-alpine

# set the working direction
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./

COPY yarn.lock ./

# rebuild node-sass
RUN yarn add sass

RUN yarn

# add app
COPY . ./

# start app
CMD ["yarn", "start"]
