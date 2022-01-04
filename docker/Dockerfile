FROM public.ecr.aws/sam/build-nodejs14.x:latest

RUN npm install --global yarn@1.22.5
RUN npm install --global pnpm
RUN npm install --global typescript
RUN npm install --global --unsafe-perm=true esbuild@0.14.2

RUN mkdir /tmp/npm-cache &&     chmod -R 777 /tmp/npm-cache &&     npm config --global set cache /tmp/npm-cache
RUN mkdir /tmp/yarn-cache &&     chmod -R 777 /tmp/yarn-cache &&     yarn config set cache-folder /tmp/yarn-cache
RUN npm config --global set update-notifier false
RUN /sbin/useradd -u 1000 user && chmod 711 /
