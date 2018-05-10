from PIL import Image
import PIL.ImageOps
import numpy as np
import cv2
import os

def initTable(threshold=200):
    table = []
    for i in range(256):
        if i < threshold:
            table.append(0)
        else:
            table.append(255)

    return table
    
def reImage(img):
    im = img.convert('L')
    binaryImage = im.point(initTable() , '1')
    result = binaryImage.convert('L')
    return result
    
def padding(img):
    imgArray =  np.asarray(img)
    image = cv2.copyMakeBorder(imgArray, 100, 100, 160, 100, cv2.BORDER_REPLICATE)
    result = Image.fromarray(image)
    return result
    
def processImages(img):
    #img = reImage(img)
    result = padding(img)
    return result

        
        
        
        
