from app.extensions import ma
from app.models.company import Company


class CompanySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Company
        load_instance = True
        include_fk = True

    id = ma.auto_field()
    name = ma.auto_field()
    description = ma.auto_field()
    website = ma.auto_field()
    location = ma.auto_field()
