FROM public.ecr.aws/docker/library/node:18-alpine

ARG AWS_DEFAULT_REGION
ARG SERVICE_NAME
ENV AWS_DEFAULT_REGION=$AWS_DEFAULT_REGION
ENV SERVICE_NAME=$SERVICE_NAME

WORKDIR /app

RUN apk add --update --no-cache \
    curl aws-cli jq \
    && rm -rf /var/cache/apk/*

COPY package.json yarn.lock ./
RUN yarn

COPY . .

RUN npm install pm2 -g

EXPOSE 8081

CMD [ "/bin/sh", "./docker/init.sh" ]
