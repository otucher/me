FROM python:3.10-slim
WORKDIR /src
COPY . .
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*
RUN python3 -m pip install poetry && poetry install
ARG PORT 8000
EXPOSE $PORT
ENV PORT ${PORT}
ENTRYPOINT ["poetry", "run", "server"]
