FROM node:12.18-alpine
ENV NODE_ENV production
ENV MONGO mongodb+srv://pllovera:W8ty1Rmr7ghDEVSn@cluster0.gumb3.mongodb.net/mystore?retryWrites=true&w=majority
ENV PORT 4000
ENV JWT_SECRET ADFJJJE<ASDFPE!@#$KKDFJJ@NCM@
WORKDIR /app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
