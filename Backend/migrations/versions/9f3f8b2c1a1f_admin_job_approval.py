"""add admin role and job approval

Revision ID: 9f3f8b2c1a1f
Revises: 282945fc3a7b
Create Date: 2026-01-07

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "9f3f8b2c1a1f"
down_revision = "282945fc3a7b"
branch_labels = None
depends_on = None


def _upgrade_user_role_enum() -> None:
    bind = op.get_bind()
    dialect = bind.dialect.name

    if dialect == "postgresql":
        # Enum values are stored as the *names* (JOB_SEEKER/EMPLOYER/ADMIN).
        op.execute("ALTER TYPE role ADD VALUE IF NOT EXISTS 'ADMIN'")
        return

    if dialect == "mysql":
        # MySQL needs the full enum list when modifying.
        op.execute(
            "ALTER TABLE users MODIFY COLUMN role "
            "ENUM('JOB_SEEKER','EMPLOYER','ADMIN') NOT NULL"
        )
        return

    # SQLite and others: use batch table rebuild.
    with op.batch_alter_table("users") as batch_op:
        batch_op.alter_column(
            "role",
            existing_type=sa.Enum("JOB_SEEKER", "EMPLOYER", name="role"),
            type_=sa.Enum("JOB_SEEKER", "EMPLOYER", "ADMIN", name="role"),
            existing_nullable=False,
        )


def upgrade():
    _upgrade_user_role_enum()

    with op.batch_alter_table("jobs") as batch_op:
        batch_op.add_column(
            sa.Column(
                "is_approved",
                sa.Boolean(),
                nullable=False,
                server_default=sa.text("0"),
            )
        )
        batch_op.add_column(
            sa.Column("approved_by", sa.Integer(), nullable=True))
        batch_op.add_column(
            sa.Column("approved_at", sa.DateTime(), nullable=True))
        batch_op.create_index(batch_op.f("ix_jobs_is_approved"), [
                              "is_approved"], unique=False)
        batch_op.create_foreign_key(
            "fk_jobs_approved_by_users",
            "users",
            ["approved_by"],
            ["id"],
            ondelete="SET NULL",
        )

    # Keep existing demo/prod data visible after upgrade.
    op.execute("UPDATE jobs SET is_approved = 1")


def downgrade():
    # Best-effort downgrade. (Postgres enum value removal is intentionally omitted.)
    with op.batch_alter_table("jobs") as batch_op:
        batch_op.drop_constraint(
            "fk_jobs_approved_by_users", type_="foreignkey")
        batch_op.drop_index(batch_op.f("ix_jobs_is_approved"))
        batch_op.drop_column("approved_at")
        batch_op.drop_column("approved_by")
        batch_op.drop_column("is_approved")
