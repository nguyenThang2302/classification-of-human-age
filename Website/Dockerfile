FROM node:20-alpine AS development

WORKDIR /src

COPY package.json yarn.lock ./
RUN yarn

COPY . .

EXPOSE 3000

CMD ["yarn", "dev"]
