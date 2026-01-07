from app.extensions import ma
from app.models.saved_job import SavedJob
from app.schemas.job_schema import JobSchema


class SavedJobSchema(ma.SQLAlchemyAutoSchema):
    job = ma.Nested(JobSchema, dump_only=True)

    class Meta:
        model = SavedJob
        load_instance = True
        include_fk = True
        load_only = ("user_id",)
