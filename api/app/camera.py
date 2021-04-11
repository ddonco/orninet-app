import os
import cv2
from app.base_camera import BaseCamera
from app import app


def gstreamer_pipeline(
    capture_width=1920,
    capture_height=1080,
    display_width=640,
    display_height=360,
    framerate=30,
    flip_method=2,
):
    return (
        "nvarguscamerasrc ! "
        "video/x-raw(memory:NVMM), "
        "width=(int)%d, height=(int)%d, "
        "format=(string)NV12, framerate=(fraction)%d/1 ! "
        "nvvidconv flip-method=%d ! "
        "video/x-raw, width=(int)%d, height=(int)%d, format=(string)BGRx ! "
        "videoconvert ! "
        "video/x-raw, format=(string)BGR ! appsink"
        % (
            capture_width,
            capture_height,
            framerate,
            flip_method,
            display_width,
            display_height,
        )
    )

def gstreamer_pipeline2(
    capture_width=1920,
    capture_height=1080,
    display_width=640,
    display_height=360,
    framerate=30,
    flip_method=2,
):
    return (
        "nvarguscamerasrc ! "
        "video/x-raw(memory:NVMM), "
        "width=(int)%d, height=(int)%d, "
        "format=(string)NV12, framerate=(fraction)%d/1 ! "
        "nvvidconv flip-method=%d ! "
        "video/x-raw, width=(int)%d, height=(int)%d, format=(string)BGRx ! "
        "videoconvert ! "
        "video/x-raw, format=(string)BGR ! appsink wait-on-eos=false drop=true max-buffers=1"
        % (
            capture_width,
            capture_height,
            framerate,
            flip_method,
            display_width,
            display_height,
        )
    )

    # Pipeline worth trying:
    # "nvarguscamerasrc ! video/x-raw(memory:NVMM), width=1280, "
    #                                    "height=720, framerate=30/1, format=NV12 ! nvvidconv ! "
    #                                    "video/x-raw, format=BGRx, width=640, height=360 ! "
    #                                    "videoconvert ! video/x-raw, format=BGR ! appsink "
    #                                    "wait-on-eos=false drop=true max-buffers=60 -e -vvv"

def gstreamer_pipeline3(
    capture_width=1920,
    capture_height=1080,
    display_width=640,
    display_height=360,
    framerate=30,
    flip_method=2,
):
    return (
        "nvarguscamerasrc sensor-id=0 ! " 
        "video/x-raw(memory:NVMM), width=(int)%d, height=(int)%d, framerate=%d/1 ! " 
        "nvvidconv flip-method=%d ! "
        "video/x-raw, format=(string)I420, width=%d, height=%d ! "
        "xvimagesink -e"
        % (
            capture_width,
            capture_height,
            framerate,
            flip_method,
            display_width,
            display_height,
        )
    )

    # And another:
    # "nvarguscamerasrc sensor-id=0 ! " 
    # "video/x-raw(memory:NVMM), width=(int)3280, height=(int)2464 ! " 
    # "nvvidconv flip-method=0 ! "
    # "video/x-raw, format=(string)I420 ! "
    # "xvimagesink -e"

def gstreamer_pipeline4(
    capture_width=1920,
    capture_height=1080,
    display_width=640,
    display_height=360,
    framerate=30,
    flip_method=2,
):
    return (
        'nvarguscamerasrc ! '
        'video/x-raw(memory:NVMM), format=NV12, '
        'width=%d, height=%d, '
        'framerate=%d/1 ! '
        'nvvidconv flip-method=%d ! '
        'video/x-raw, format=I420, width=%d, height=%d ! '
        'appsink max-buffers=1 drop=True'
        % (
            capture_width,
            capture_height,
            framerate,
            flip_method,
            display_width,
            display_height,
        )
    )

    # One more:
    # 'nvarguscamerasrc ! '
    # 'video/x-raw(memory:NVMM), format=NV12, '
    # 'width=3280, height=2464, '
    # 'framerate=10/1 ! '
    # 'nvvidconv flip-method=2 ! '
    # 'video/x-raw, format=I420 ! '
    # 'appsink max-buffers=1 drop=True '


class Camera(BaseCamera):
    video_source = 0
    api_preference = cv2.CAP_ANY

    def __init__(self):
        if app.config['CSI_CAMERA'] == 'True':
            Camera.set_video_source(gstreamer_pipeline2(), cv2.CAP_GSTREAMER)
        else:
            Camera.set_video_source(0, cv2.CAP_ANY)
        super(Camera, self).__init__()

    @staticmethod
    def set_video_source(source, api):
        Camera.video_source = source
        Camera.api_preference = api

    @staticmethod
    def frames():
        camera = cv2.VideoCapture(Camera.video_source, Camera.api_preference)
        if not camera.isOpened():
            raise RuntimeError('Could not start camera.')

        while True:
            # read current frame
            _, img = camera.read()

            # encode as a jpeg image and return it
            yield cv2.imencode('.jpg', img)[1].tobytes()
