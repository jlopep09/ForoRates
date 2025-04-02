FROM python:3.9 AS builder


WORKDIR /app


COPY requirements.txt ./


RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir --upgrade -r ./requirements.txt

COPY ./ ./

CMD ["fastapi", "run", "./main.py", "--port", "8000"]