FROM node

LABEL name git-webfont-service

# Change working directory
WORKDIR /usr/src/app

# Install all dependencies
COPY . /usr/src/app
RUN npm install
RUN npm run build

# Expose port (expose different port if you change the PORT env)
EXPOSE 3000

# Command to start app
CMD ["npm", "start"]
