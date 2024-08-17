# Use Debian as the base image
FROM debian:bullseye-slim

# Update and install system packages
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    nginx \
    && rm -rf /var/lib/apt/lists/*

RUN pip3 install pipenv && pipenv install django

WORKDIR /home

CMD ["nginx", "-g", "daemon off;"]
