FROM node:14-alpine
ENV WEB_ROOT /home/node/app
ENV NODE_ENV=production
RUN mkdir -p $WEB_ROOT && chown -R node:node $WEB_ROOT
WORKDIR $WEB_ROOT
COPY --chown=node:node . .
EXPOSE 80
USER node
CMD sh -cl 'npm install --verbose && node app.js'