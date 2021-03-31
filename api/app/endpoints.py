import json
import os
import sys
from datetime import datetime
from flask import request
from flask import Response
from flask_cors import CORS

from app import app, db
from app.models import Image
from app.schemas import ImageSchema
from app.camera import Camera

CORS(app)

dbus = None
yolo_unit = None
yolo_version = app.config['YOLO_VERSION']
if app.config['JETSON_PLATFORM'] == 'True':
    from pystemd.systemd1 import Unit
    from pystemd.dbuslib import DBus

    dbus = DBus(user_mode=True)
    dbus.open()

    yolo_unit = Unit(b'orninet-yolov5.service', bus=dbus, _autoload=True)
    # yolo_unit = Unit(bytes(f'orninet-yolov{yolo_version}.service', 'utf-8'), bus=dbus, _autoload=True)


@app.route('/api/home', methods=['GET'])
def get_home_data():
    images = Image.query.order_by(Image.timestamp.desc()).limit(6)
    image_schema = ImageSchema(many=True)

    payload = {'payload':
        {
            'images': image_schema.dump(images, many=True),
            'image_path': app.config['IMAGE_SRC']
        }
    }
    return payload


@app.route('/api/archive', methods=['GET'])
def get_archive_data():
    page = request.args.get('page', 1, type=int)
    images = Image.query.order_by(Image.timestamp.desc()).paginate(page,
        app.config['IMAGES_PER_PAGE'], False)
    image_schema = ImageSchema(many=True)

    payload = {'payload':
        {
            'images': image_schema.dump(images.items, many=True),
            'image_path': app.config['IMAGE_SRC'],
            'has_next_page': images.has_next,
            'has_prev_page': images.has_prev
        }
    }
    return payload


@app.route('/api/search', methods=['GET'])
def get_search_data():
    error = ''
    payload = {'payload':
        {
            'images': [],
            'image_path': '',
            'has_next_page': False,
            'has_prev_page': False
        }
    }

    try:
        search_query = request.args.get('query')
        page = request.args.get('page', 1, type=int)

        images = Image.query.filter(Image.categories.contains(search_query)).paginate(page,
            app.config['IMAGES_PER_PAGE'], False)
        image_schema = ImageSchema(many=True)

        payload = {'payload':
            {
                'images': image_schema.dump(images.items, many=True),
                'image_path': app.config['IMAGE_SRC'],
                'has_next_page': images.has_next,
                'has_prev_page': images.has_prev
            }
        }

    except Exception as e:
        print(e, file=sys.stderr)

    return payload


@app.route('/api/post-detection', methods=['POST'])
def put_detection_data():
    response_msg = 'success'
    if request.is_json:
        payload = request.get_json(force=True)
        detections = json.loads(payload)

        try:
            assert 'name' in detections, 'POST request missing required property: name'
            assert 'timestamp' in detections, 'POST request missing required property: timestamp'
            assert 'categories' in detections, 'POST request missing required property: categories'

            image = Image(
                name=detections['name'],
                categories=json.dumps(detections['categories']),
                timestamp=datetime.strptime(
                    detections['timestamp'], '%Y-%m-%d %H:%M:%S.%f')
            )
            db.session.add(image)
            db.session.commit()

        except AssertionError as err:
            print(f"Decection POST request error:\n{err}")
            response_msg = err

    resp = {'response': response_msg}
    return resp, 200


def gen(camera):
    """Video streaming generator function."""
    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


@app.route('/api/video_feed')
def video_feed():
    """Video streaming route. Put this in the src attribute of an img tag."""
    return Response(gen(Camera()),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/api/start_yolo', methods=['GET'])
def start_yolo():
    """Start orninet-yolo systemd service"""
    global yolo_unit
    if yolo_unit.Unit.ActiveState == b'inactive':
        yolo_unit.Unit.Start(b'replace')

    resp = {'status': yolo_unit.Unit.ActiveState}
    return resp


@app.route('/api/stop_yolo', methods=['GET'])
def stop_yolo():
    global yolo_unit
    if yolo_unit.Unit.ActiveState == b'active':
        yolo_unit.Unit.Stop(b'replace')
    
    resp = {'status': yolo_unit.Unit.ActiveState}
    return resp

@app.route('/api/yolo_status', methods=['GET'])
def get_yolo_status():
    global yolo_unit
    resp = {'status': yolo_unit.Unit.ActiveState}
    return resp