import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'data/orninet.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    IMAGE_SRC = os.environ.get('IMAGE_SRC')
    IMAGES_PER_PAGE = 2
    CSI_CAMERA = os.environ.get('CSI_CAMERA') or 'False'
    JETSON_PLATFORM = os.environ.get('JETSON_PLATFORM') or 'False'
    YOLO_VERSION = os.environ.get('YOLO_VERSION')