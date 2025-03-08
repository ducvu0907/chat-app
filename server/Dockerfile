FROM node:20.17.0
WORKDIR /app
COPY package.json ./
RUN npm install
ENV JWT_SECRET=changethis
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
