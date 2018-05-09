conda create -n chinese-ocr1 python=2.7 pip scipy numpy Pillow jupyter numpy scipy matplotlib pillow
source activate chinese-ocr1
pip install easydict opencv-python keras h5py PyYAML
pip install cython==0.24
pip install tensorflow==1.3.0
chmod +x ./ctpn/lib/utils/make_cpu.sh
cd ./ctpn/lib/utils/ && ./make_cpu.sh

