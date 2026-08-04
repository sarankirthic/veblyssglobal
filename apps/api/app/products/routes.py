from flask import jsonify
from flask_openapi3 import APIBlueprint
from sqlalchemy.exc import IntegrityError

from app.common.activity import log_activity
from app.common.auth_guards import load_current_user, require_role
from app.common.errors import ApiError
from app.extensions import db
from app.models.category import Category
from app.models.product import Product
from app.models.user import Role
from app.schemas.product import (
    CategoryBody,
    CategoryPath,
    ProductBody,
    ProductPath,
    ProductQuery,
)

categories_bp = APIBlueprint("categories", __name__, url_prefix="/api/v1/categories")
products_bp = APIBlueprint("products", __name__, url_prefix="/api/v1/products")


# ---- Categories ------------------------------------------------------------

@categories_bp.get("")
def list_categories():
    cats = Category.query.order_by(Category.display_order.asc()).all()
    return jsonify({"data": [c.to_dict() for c in cats]})


@categories_bp.get("/<category_id>")
def get_category(path: CategoryPath):
    cat = db.session.get(Category, path.category_id)
    if cat is None:
        raise ApiError("Category not found.", status_code=404, code="not_found")
    return jsonify({"data": cat.to_dict()})


@categories_bp.post("")
@require_role(Role.ADMIN, Role.EDITOR)
def create_category(body: CategoryBody):
    cat = Category(
        name=body.name,
        slug=body.slug,
        description=body.description,
        origin_region=body.originRegion,
        display_order=body.displayOrder,
    )
    db.session.add(cat)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        raise ApiError("A category with that slug already exists.", status_code=409, code="conflict")

    log_activity("create", "category", cat.id, load_current_user().id)
    return jsonify({"data": cat.to_dict()}), 201


@categories_bp.put("/<category_id>")
@require_role(Role.ADMIN, Role.EDITOR)
def update_category(path: CategoryPath, body: CategoryBody):
    cat = db.session.get(Category, path.category_id)
    if cat is None:
        raise ApiError("Category not found.", status_code=404, code="not_found")

    cat.name = body.name
    cat.slug = body.slug
    cat.description = body.description
    cat.origin_region = body.originRegion
    cat.display_order = body.displayOrder

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        raise ApiError("A category with that slug already exists.", status_code=409, code="conflict")

    log_activity("update", "category", cat.id, load_current_user().id)
    return jsonify({"data": cat.to_dict()})


@categories_bp.delete("/<category_id>")
@require_role(Role.ADMIN)
def delete_category(path: CategoryPath):
    cat = db.session.get(Category, path.category_id)
    if cat is None:
        raise ApiError("Category not found.", status_code=404, code="not_found")
    if cat.products:
        raise ApiError(
            "Can't delete a category that still has products in it.", status_code=409, code="conflict"
        )

    db.session.delete(cat)
    db.session.commit()
    log_activity("delete", "category", path.category_id, load_current_user().id)
    return jsonify({"ok": True})


# ---- Products ---------------------------------------------------------------

@products_bp.get("")
def list_products(query: ProductQuery):
    q = Product.query
    if query.published_only:
        q = q.filter_by(is_published=True)
    if query.category:
        q = q.join(Category).filter(Category.slug == query.category)
    if query.featured is not None:
        q = q.filter_by(featured=query.featured)

    total = q.count()
    items = (
        q.order_by(Product.created_at.desc())
        .offset((query.page - 1) * query.per_page)
        .limit(query.per_page)
        .all()
    )
    return jsonify(
        {
            "data": [p.to_dict() for p in items],
            "meta": {"page": query.page, "perPage": query.per_page, "total": total},
        }
    )


@products_bp.get("/<product_id>")
def get_product(path: ProductPath):
    product = db.session.get(Product, path.product_id)
    if product is None or not product.is_published:
        raise ApiError("Product not found.", status_code=404, code="not_found")
    return jsonify({"data": product.to_dict()})


@products_bp.post("")
@require_role(Role.ADMIN, Role.EDITOR)
def create_product(body: ProductBody):
    if db.session.get(Category, body.categoryId) is None:
        raise ApiError("Unknown categoryId.", status_code=422, code="validation_error")

    product = Product(
        category_id=body.categoryId,
        name=body.name,
        slug=body.slug,
        short_description=body.shortDescription,
        description=body.description,
        materials=body.materials,
        dimensions=body.dimensions,
        moq=body.moq,
        packaging=body.packaging,
        lead_time=body.leadTime,
        price_range=body.priceRange,
        specs=[s.model_dump() for s in body.specs],
        images=body.images,
        featured=body.featured,
        is_published=body.isPublished,
    )
    db.session.add(product)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        raise ApiError("A product with that slug already exists.", status_code=409, code="conflict")

    log_activity("create", "product", product.id, load_current_user().id)
    return jsonify({"data": product.to_dict()}), 201


@products_bp.put("/<product_id>")
@require_role(Role.ADMIN, Role.EDITOR)
def update_product(path: ProductPath, body: ProductBody):
    product = db.session.get(Product, path.product_id)
    if product is None:
        raise ApiError("Product not found.", status_code=404, code="not_found")
    if db.session.get(Category, body.categoryId) is None:
        raise ApiError("Unknown categoryId.", status_code=422, code="validation_error")

    product.category_id = body.categoryId
    product.name = body.name
    product.slug = body.slug
    product.short_description = body.shortDescription
    product.description = body.description
    product.materials = body.materials
    product.dimensions = body.dimensions
    product.moq = body.moq
    product.packaging = body.packaging
    product.lead_time = body.leadTime
    product.price_range = body.priceRange
    product.specs = [s.model_dump() for s in body.specs]
    product.images = body.images
    product.featured = body.featured
    product.is_published = body.isPublished

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        raise ApiError("A product with that slug already exists.", status_code=409, code="conflict")

    log_activity("update", "product", product.id, load_current_user().id)
    return jsonify({"data": product.to_dict()})


@products_bp.delete("/<product_id>")
@require_role(Role.ADMIN, Role.EDITOR)
def delete_product(path: ProductPath):
    product = db.session.get(Product, path.product_id)
    if product is None:
        raise ApiError("Product not found.", status_code=404, code="not_found")

    db.session.delete(product)
    db.session.commit()
    log_activity("delete", "product", path.product_id, load_current_user().id)
    return jsonify({"ok": True})
