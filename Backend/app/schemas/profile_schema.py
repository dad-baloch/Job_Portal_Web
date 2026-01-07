from app.extensions import ma
from app.models.profile import JobSeekerProfile


class JobSeekerProfileSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = JobSeekerProfile
        load_instance = True
        include_fk = True
        load_only = ("user_id",)

    skills = ma.Dict()
