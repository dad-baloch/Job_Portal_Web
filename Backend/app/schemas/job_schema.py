from app.extensions import ma
from app.models.job import Job
from app.schemas.company_schema import CompanySchema


class JobSchema(ma.SQLAlchemyAutoSchema):
    company = ma.Nested(CompanySchema, dump_only=True)

    class Meta:
        model = Job
        load_instance = True
        include_fk = True
        dump_only = ("created_by",)

    skills = ma.Dict()
