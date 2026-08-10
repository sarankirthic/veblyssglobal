"""`flask --app wsgi.py seed` — populates categories/products/settings with the
real D2C content from the current static site, so there's something to look
at besides empty states. Idempotent: safe to run more than once.
"""
import click
from flask import Flask

from app.extensions import db
from app.products.models import Category, Product
from app.settings.models import SiteSetting

CATEGORIES = [
    {
        "name": "Leather Goods",
        "slug": "leather-goods",
        "description": "Bags, wallets, belts, and everyday carry, hand-finished in Dharavi.",
        "originRegion": "Dharavi, Mumbai",
        "displayOrder": 1,
        "products": [
            {
                "name": "Leather Portfolio",
                "slug": "leather-portfolio",
                "shortDescription": "A5 portfolio, full-grain leather, optional embossing.",
                "materials": "Full-grain & vegetable-tanned leather",
                "dimensions": "24 × 32 cm (A5)",
                "packaging": "Recyclable, plastic-free wrap",
                "specs": [{"key": "Care", "value": "Wipe clean, condition every 6 months, keep out of direct sun"}],
                "featured": True,
            },
            {
                "name": "Leather Travel Duffel",
                "slug": "leather-travel-duffel",
                "shortDescription": "Weekender duffel, vegetable-tanned leather, brass hardware.",
                "materials": "Vegetable-tanned leather, brass hardware",
            },
            {
                "name": "Classic Bifold Wallet",
                "slug": "classic-bifold-wallet",
                "shortDescription": "Slim bifold, 6-card capacity, available in 4 finishes.",
                "materials": "Full-grain leather",
            },
        ],
    },
    {
        "name": "Copperware",
        "slug": "copperware",
        "description": "Food-safe kitchenware, wellness bottles and décor, hand-hammered in Moradabad.",
        "originRegion": "Moradabad, Uttar Pradesh",
        "displayOrder": 2,
        "products": [
            {
                "name": "Copper Water Bottle",
                "slug": "copper-water-bottle",
                "shortDescription": "1L food-safe copper bottle, hammered finish.",
                "materials": "Food-grade 99.9% copper",
                "dimensions": "1L, 26 cm height",
                "packaging": "Individual cloth pouch, plastic-free wrap",
                "specs": [{"key": "Care", "value": "Hand wash, let the finish darken naturally"}],
                "featured": True,
            },
            {
                "name": "Copper Serveware Set",
                "slug": "copper-serveware-set",
                "shortDescription": "4-piece serving set for everyday and entertaining.",
            },
            {
                "name": "Copper Décor Bowl",
                "slug": "copper-decor-bowl",
                "shortDescription": "Hand-hammered decorative bowl, 3 sizes.",
            },
        ],
    },
    {
        "name": "Jewellery",
        "slug": "jewellery",
        "description": "Necklaces, earrings, bangles and sets, handcrafted by Jaipur's jewellers.",
        "originRegion": "Jaipur, Rajasthan",
        "displayOrder": 3,
        "products": [
            {
                "name": "Kundan Necklace Set",
                "slug": "kundan-necklace-set",
                "shortDescription": "Necklace, earrings and maang tikka, matched set.",
                "materials": "Alloy base, kundan stones, hypoallergenic plating",
                "specs": [{"key": "Set contents", "value": "Necklace, earrings, maang tikka"}],
                "featured": True,
            },
            {
                "name": "Meenakari Bangles",
                "slug": "meenakari-bangles",
                "shortDescription": "Enamel-work bangle set, sold in sets of 6.",
            },
            {
                "name": "Statement Earrings",
                "slug": "statement-earrings",
                "shortDescription": "Chandbali-style drop earrings, hypoallergenic finish.",
            },
        ],
    },
    {
        "name": "Handcrafted Home Decor",
        "slug": "handcrafted-home-decor",
        "description": "Wooden crafts, pottery, textiles and décor from artisan clusters across India.",
        "originRegion": "Multi-region",
        "displayOrder": 4,
        "products": [
            {
                "name": "Carved Wooden Tray",
                "slug": "carved-wooden-tray",
                "shortDescription": "Hand-carved sheesham wood serving tray.",
                "materials": "Sheesham wood, natural finish",
                "dimensions": "40 × 28 cm",
                "packaging": "Bubble-wrapped, plastic-free outer",
                "featured": True,
            },
            {
                "name": "Blue Pottery Vase",
                "slug": "blue-pottery-vase",
                "shortDescription": "Jaipur blue pottery decorative vase, 3 sizes.",
            },
            {
                "name": "Block-Print Textile Runner",
                "slug": "block-print-textile-runner",
                "shortDescription": "Hand block-printed cotton table runner.",
            },
        ],
    },
    {
        "name": "Sustainable Lifestyle Products",
        "slug": "sustainable-lifestyle-products",
        "description": "Reusable, biodegradable and natural-material goods for considered living.",
        "originRegion": "Multi-region",
        "displayOrder": 5,
        "products": [
            {
                "name": "Jute Tote Bag",
                "slug": "jute-tote-bag",
                "shortDescription": "Reusable jute shopping tote, natural dye.",
                "materials": "100% natural jute fibre",
                "dimensions": "38 × 42 cm",
                "packaging": "Plastic-free bundle wrap",
                "featured": True,
            },
            {
                "name": "Bamboo Cutlery Set",
                "slug": "bamboo-cutlery-set",
                "shortDescription": "4-piece travel cutlery set with pouch.",
            },
            {
                "name": "Areca Leaf Plates",
                "slug": "areca-leaf-plates",
                "shortDescription": "Biodegradable disposable plates, pack of 25.",
            },
        ],
    },
    {
        "name": "Curated Indian Essentials",
        "slug": "curated-indian-essentials",
        "description": "Small-batch spices, teas & pantry favourites, sourced with care.",
        "originRegion": "Multi-region",
        "displayOrder": 6,
        "products": [
            {
                "name": "Basmati Rice",
                "slug": "basmati-rice",
                "shortDescription": "Long-grain, aged, graded and polished by hand.",
                "specs": [{"key": "Grade", "value": "Extra long grain, hand-graded"}],
                "featured": True,
            },
            {
                "name": "Whole Spices",
                "slug": "whole-spices",
                "shortDescription": "Cumin, turmeric, coriander, stone-ground in small batches.",
            },
            {
                "name": "Spice & Tea Gift Sets",
                "slug": "spice-tea-gift-sets",
                "shortDescription": "Curated pairings from different regions of India, ready to gift.",
            },
        ],
    },
]

SETTINGS = {
    "differentiators": [
        {"title": "Ethical & Sustainable Sourcing", "description": "Every piece traces back to a named artisan community — so you know exactly whose hands made it, and how."},
        {"title": "Honest Materials", "description": "Full-grain leather, food-safe copper, natural dyes — we tell you exactly what something is made of, and why it was chosen."},
        {"title": "Made in Small Batches", "description": "Handmade in small batches, not mass-produced on a line — expect natural variation, not a copy-paste finish."},
        {"title": "Plastic-Free Packaging", "description": "Every order arrives in recyclable, plastic-reduced packaging — considered from workshop to doorstep."},
        {"title": "Quality You Can Feel", "description": "Every piece is inspected by hand before it's packed — so what you see in the photos is what arrives at your door."},
        {"title": "Here When You Need Us", "description": "Real people in Bengaluru and London, ready to help with sizing, care, or a gift that needs to arrive on time."},
    ],
    "contact_details": {
        "email": "info@veblyssglobal.com",
        "phone": "+91 80 2658 2427 / +91 98448 44225",
        "whatsapp": "+44 7722 184477",
        "locations": [
            {
                "id": "bengaluru",
                "city": "Bengaluru",
                "companyName": "VeBlyss Global Pvt Ltd",
                "address": "2619, 36th A Cross, 26th Main\n4th T Block, 9th Block Post, Jayanagar\nBengaluru, Karnataka - 560041",
                "phone": "+91 80 2658 2427 / +91 98448 44225",
            },
            {
                "id": "london",
                "city": "London",
                "companyName": "VeBlyss Limited",
                "address": "71–75 Shelton Street\nCovent Garden\nLondon, WC2H 9JQ, United Kingdom",
                "phone": "+44 7722 184477",
            },
        ],
    },
    "social_links": {
        "linkedin": "",
        "facebook": "",
        "instagram": "",
    },
}


def run_seed():
    for cat_data in CATEGORIES:
        products = cat_data.pop("products")
        category = Category.query.filter_by(slug=cat_data["slug"]).first()
        if category is None:
            category = Category(
                name=cat_data["name"],
                slug=cat_data["slug"],
                description=cat_data["description"],
                origin_region=cat_data["originRegion"],
                display_order=cat_data["displayOrder"],
            )
            db.session.add(category)
            db.session.flush()
            click.echo(f"+ category: {category.name}")
        else:
            click.echo(f"= category exists: {category.name}")

        for p in products:
            existing = Product.query.filter_by(slug=p["slug"]).first()
            if existing is not None:
                click.echo(f"  = product exists: {p['name']}")
                continue
            product = Product(
                category_id=category.id,
                name=p["name"],
                slug=p["slug"],
                short_description=p.get("shortDescription"),
                materials=p.get("materials"),
                dimensions=p.get("dimensions"),
                packaging=p.get("packaging"),
                specs=p.get("specs", []),
                images=[],
                featured=p.get("featured", False),
                is_published=True,
            )
            db.session.add(product)
            click.echo(f"  + product: {product.name}")

        cat_data["products"] = products  # restore, in case run_seed is called twice in-process

    for key, value in SETTINGS.items():
        row = db.session.get(SiteSetting, key)
        if row is None:
            db.session.add(SiteSetting(key=key, value=value))
            click.echo(f"+ setting: {key}")
        else:
            click.echo(f"= setting exists: {key}")

    db.session.commit()
    click.echo("Seed complete.")


def register_seed_command(app: Flask) -> None:
    @app.cli.command("seed")
    def seed():
        """Populate categories/products/settings with real starter content."""
        run_seed()
