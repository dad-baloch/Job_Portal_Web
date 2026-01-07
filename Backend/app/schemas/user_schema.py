from app.extensions import ma
from app.models.user import User


class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        include_fk = True
        exclude = ("password_hash",)

    id = ma.auto_field()
    email = ma.auto_field()
    role = ma.auto_field()
