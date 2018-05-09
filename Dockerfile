FROM python:2

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . . 
RUN cd ./ctpn/lib/utils \
	&& sh make_cpu.sh
CMD ["gunicorn", "app:app", "-c", "./gunicorn.conf.py"]