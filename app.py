#coding:utf-8
from flask import Flask
from flask import request
from flask import render_template
import ocr_Pytorch
import time
import shutil
import numpy as np
from PIL import Image
from glob import glob
import preprocessImages as pp
import logging
import json

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload():
    if request.method == 'POST':
        im = request.files['image']
        parameter = request.form['style']
        
        if(parameter == 'deploma'):
            img = np.array(pp.processImages(Image.open(im)).convert('RGB'))
        elif(parameter == 'general'):
            img = np.array(Image.open(im).convert('RGB'))

        t = time.time()
        result, image_framed = ocr_Pytorch.model(img)
        res = ''
        logging.debug('success')
        for key in result:
            res = res + " " + result[key][1]
        print res
        print ###############
        rst = {'res': res.encode('utf-8').replace('曰', '日')}
        json_rst = json.dumps(rst, ensure_ascii=False)
        print json_rst
        return json_rst

@app.route('/')
def hello():
    return 'hello world'

@app.route('/index')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug = True)