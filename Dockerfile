FROM node:carbon AS build-env
WORKDIR /usr/src/app/frontend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx
COPY site.conf /etc/nginx/conf.d/default.conf
COPY --from=build-env /usr/src/app/frontend/dist /www/data/
