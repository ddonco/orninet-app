import os
import cv2
from app.base_camera import BaseCamera
from app import app


def gstreamer_pipeline(
    capture_width=1920,
    capture_height=1080,
    display_width=608,
    display_height=342,
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


class Camera(BaseCamera):
    video_source = 0
    api_preference = cv2.CAP_ANY

    def __init__(self):
        if app.config['CSI_CAMERA'] == 'True':
            Camera.set_video_source(gstreamer_pipeline(), cv2.CAP_GSTREAMER)
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
