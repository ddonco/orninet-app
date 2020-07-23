from datetime import datetime
from app import db


class Image(db.Model):
    id = db.Column(db.Integer, primary_key=True, unique=True)
    name = db.Column(db.String(128), index=True, unique=True)
    categories = db.Column(db.String(256))
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)

    def __repr__(self):
        return f'<Image {self.id} - {self.name} - {self.timestamp} - {self.categories}>'