from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from app.extensions import db
from app.models import Company
from app.schemas.company_schema import CompanySchema
from app.routes.utils import get_current_user, require_role

companies_bp = Blueprint("companies", __name__)
company_schema = CompanySchema()
companies_schema = CompanySchema(many=True)


@companies_bp.get("/")
def list_companies():
    companies = Company.query.order_by(Company.name).all()
    return jsonify(companies_schema.dump(companies))


@companies_bp.post("/")
@jwt_required()
def create_company():
    user = get_current_user()
    error = require_role(user, {"admin", "employer"})
    if error:
        return error

    data = request.get_json()

    # Check if name exists
    if Company.query.filter_by(name=data.get("name")).first():
        return jsonify({"message": "Company with this name already exists"}), 400

    try:
        new_company = company_schema.load(data, session=db.session)
        # If user is employer, maybe assign them as owner?
        # But for now, just create it.
        if user.role.value == "employer" and not new_company.owner_id:
            new_company.owner_id = user.id

        db.session.add(new_company)
        db.session.commit()
        return jsonify(company_schema.dump(new_company)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400
