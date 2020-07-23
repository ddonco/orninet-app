from app import ma
from app.models import Image


class ImageSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Image

    id = ma.auto_field()
    name = ma.auto_field()
    categories = ma.auto_field()
    timestamp = ma.auto_field()