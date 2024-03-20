FROM node:20-bullseye

ENV DEBIAN_FRONTEND noninteractive

COPY package.json /opt/bpm/package.json
COPY src          /opt/bpm/src

WORKDIR /opt/bpm

RUN ln -fs /usr/share/zoneinfo/CET /etc/localtime && dpkg-reconfigure -f noninteractive tzdata
RUN npm ci --omit=dev

CMD [ "npm", "start" ]
