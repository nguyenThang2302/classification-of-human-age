FROM node:20-alpine AS development

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn

COPY . .
COPY .env.example.qa .env

EXPOSE 6996

CMD ["yarn", "start"]
