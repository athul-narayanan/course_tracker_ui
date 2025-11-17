FROM node:20-alpine AS builder

WORKDIR /app

ARG REACT_APP_COURSE_TRACKER_API_URL
ENV REACT_APP_COURSE_TRACKER_API_URL=$REACT_APP_COURSE_TRACKER_API_URL

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]