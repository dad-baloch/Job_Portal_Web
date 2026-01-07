from marshmallow import Schema, fields, validate


class RegisterSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True, validate=validate.Length(min=8))
    role = fields.String(required=True, validate=validate.OneOf(
        ["job_seeker", "employer"]))
    full_name = fields.String(load_default=None)
    location = fields.String(load_default=None)


class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True)
