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
from app.camera import VideoCamera

CORS(app)


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

    response = {'response': response_msg}
    return response, 200


def generate(camera):
    # loop over frames from the output stream
    while True:
        # get camera frame
        frame = camera.get_frame()

        # yield the output frame in the byte format
        yield(b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + 
            bytearray(frame) + b'\r\n')


@app.route('/api/video_feed')
def video_feed():
    # return the response generated along with the specific media
    # type (mime type)
    return Response(generate(VideoCamera()),
        mimetype = "multipart/x-mixed-replace; boundary=frame")
