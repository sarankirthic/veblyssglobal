"""add product page content fields (heroHeadline, whyChoose, guarantee, idealFor)

Revision ID: 13f4734db0a6
Revises: 71d71444c0d9
Create Date: 2026-08-09 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '13f4734db0a6'
down_revision = '71d71444c0d9'
branch_labels = None
depends_on = None

json_type = sa.JSON().with_variant(postgresql.JSONB(astext_type=sa.Text()), "postgresql")


def upgrade():
    with op.batch_alter_table('products', schema=None) as batch_op:
        batch_op.add_column(sa.Column('hero_headline', sa.String(length=200), nullable=True))
        batch_op.add_column(sa.Column('why_choose', json_type, nullable=False, server_default=sa.text("'[]'")))
        batch_op.add_column(sa.Column('guarantee', sa.Text(), nullable=True))
        batch_op.add_column(sa.Column('ideal_for', json_type, nullable=False, server_default=sa.text("'[]'")))


def downgrade():
    with op.batch_alter_table('products', schema=None) as batch_op:
        batch_op.drop_column('ideal_for')
        batch_op.drop_column('guarantee')
        batch_op.drop_column('why_choose')
        batch_op.drop_column('hero_headline')
