from app.extensions import ma
from app.models.application import Application
from app.schemas.job_schema import JobSchema
from app.schemas.user_schema import UserSchema
from app.schemas.profile_schema import JobSeekerProfileSchema


class ApplicationSchema(ma.SQLAlchemyAutoSchema):
    job = ma.Nested(JobSchema, dump_only=True)
    applicant = ma.Nested(UserSchema, dump_only=True)
    applicant_profile = ma.Method("get_applicant_profile", dump_only=True)

    class Meta:
        model = Application
        load_instance = True
        include_fk = True
        load_only = ("user_id",)

    def get_applicant_profile(self, obj: Application):
        user = getattr(obj, "applicant", None)
        profile = getattr(user, "profile", None) if user else None
        return JobSeekerProfileSchema().dump(profile) if profile else None
