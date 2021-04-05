FROM node:14-alpine
ENV WEB_ROOT /home/node/app
ENV NODE_ENV=production
RUN mkdir -p $WEB_ROOT && chown -R node:node $WEB_ROOT
RUN apk update && apk add bash
RUN apk add --update --no-cache python3 jq && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools
RUN pip3 install awscli
WORKDIR $WEB_ROOT
COPY --chown=node:node . .
EXPOSE 80
USER node
CMD sh -cl './scripts/install.sh'