# Base image
FROM python:3.12-slim

# Cài đặt các gói cần thiết cho hệ thống
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && apt-get clean

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy các file cần thiết
COPY pyproject.toml poetry.lock /app/

# Cài đặt Poetry và các gói Python
RUN pip install --no-cache-dir poetry \
    && poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

# Copy mã nguồn
COPY . /app

# Mở cổng
EXPOSE 8000

# Lệnh mặc định
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
