FROM node:12.16.1-alpine

# Define working directory
WORKDIR /home/node/app

# Install dependencies
COPY package*.json ./
RUN npm ci

# copy source and start script
COPY . .
COPY ./docker/run.sh /usr/bin/run.sh
RUN chmod +x /usr/bin/run.sh

EXPOSE 5000
# execute start script
CMD /usr/bin/run.sh
