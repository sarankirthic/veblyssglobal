"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  useCategories,
  useCreateCategory,
  useCreateProduct,
  useDeleteCategory,
  useDeleteProduct,
  useProducts,
  useUpdateCategory,
  useUpdateProduct,
} from "@/lib/admin/queries/products";
import type { Category, Product } from "@/lib/types";
import { RoleGate } from "@/components/admin/RoleGate";
import { Button } from "@/components/admin/ui/Button";
import { Badge } from "@/components/admin/ui/Badge";
import { ConfirmButton } from "@/components/admin/ui/ConfirmButton";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { Table, Thead, Th, Tr, Td } from "@/components/admin/ui/Table";
import { CategoryForm } from "@/components/admin/products/CategoryForm";
import { ProductForm } from "@/components/admin/products/ProductForm";

type Tab = "categories" | "products";

export default function ProductsPage() {
  const [tab, setTab] = useState<Tab>("categories");

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-[28px] tracking-tight">Products</h1>
        <div className="flex gap-1 rounded-full bg-white p-1 shadow-adm-sm">
          {(["categories", "products"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-1.5 text-sm capitalize transition-colors ${
                tab === t ? "bg-adm-primary text-white" : "text-adm-muted hover:text-adm-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {tab === "categories" ? <CategoriesPanel /> : <ProductsPanel />}
    </div>
  );
}

function CategoriesPanel() {
  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const [editing, setEditing] = useState<Category | "new" | null>(null);

  if (isLoading) return <p className="text-sm text-adm-muted">Loading…</p>;

  return (
    <div>
      {editing ? (
        <div className="mb-6">
          <CategoryForm
            initial={editing === "new" ? undefined : editing}
            onCancel={() => setEditing(null)}
            onSubmit={async (values) => {
              if (editing === "new") await createCategory.mutateAsync(values);
              else await updateCategory.mutateAsync({ id: editing.id, body: values });
              setEditing(null);
            }}
          />
        </div>
      ) : (
        <RoleGate allow={["admin", "editor"]}>
          <Button size="sm" className="mb-4" onClick={() => setEditing("new")}>
            <Plus size={14} /> Add Category
          </Button>
        </RoleGate>
      )}

      {!categories || categories.length === 0 ? (
        <EmptyState title="No categories yet" description="Add the first category to start building the catalogue." />
      ) : (
        <Table>
          <Thead>
            <tr>
              <Th>Name</Th>
              <Th>Slug</Th>
              <Th>Origin</Th>
              <Th>Order</Th>
              <Th />
            </tr>
          </Thead>
          <tbody>
            {categories.map((c) => (
              <Tr key={c.id}>
                <Td className="font-medium">{c.name}</Td>
                <Td className="font-mono text-xs text-adm-muted">{c.slug}</Td>
                <Td>{c.originRegion ?? "—"}</Td>
                <Td>{c.displayOrder}</Td>
                <Td>
                  <div className="flex justify-end gap-2">
                    <RoleGate allow={["admin", "editor"]}>
                      <Button size="sm" variant="outline" onClick={() => setEditing(c)}>
                        Edit
                      </Button>
                    </RoleGate>
                    <RoleGate allow={["admin"]}>
                      <ConfirmButton
                        confirmMessage={`Delete category "${c.name}"? This can't be undone.`}
                        onConfirm={() => deleteCategory.mutate(c.id)}
                      >
                        Delete
                      </ConfirmButton>
                    </RoleGate>
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

function ProductsPanel() {
  const { data: categories } = useCategories();
  const { data: products, isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const [editing, setEditing] = useState<Product | "new" | null>(null);

  if (isLoading || !categories) return <p className="text-sm text-adm-muted">Loading…</p>;

  return (
    <div>
      {editing ? (
        <div className="mb-6">
          <ProductForm
            initial={editing === "new" ? undefined : editing}
            categories={categories}
            onCancel={() => setEditing(null)}
            onSubmit={async (values) => {
              if (editing === "new") await createProduct.mutateAsync(values);
              else await updateProduct.mutateAsync({ id: editing.id, body: values });
              setEditing(null);
            }}
          />
        </div>
      ) : (
        <RoleGate allow={["admin", "editor"]}>
          <Button
            size="sm"
            className="mb-4"
            onClick={() => setEditing("new")}
            disabled={categories.length === 0}
          >
            <Plus size={14} /> Add Product
          </Button>
        </RoleGate>
      )}

      {categories.length === 0 ? (
        <EmptyState title="Add a category first" description="Products need a category to belong to." />
      ) : !products || products.length === 0 ? (
        <EmptyState title="No products yet" description="Add the first product to this catalogue." />
      ) : (
        <Table>
          <Thead>
            <tr>
              <Th>Name</Th>
              <Th>Category</Th>
              <Th>Status</Th>
              <Th />
            </tr>
          </Thead>
          <tbody>
            {products.map((p) => (
              <Tr key={p.id}>
                <Td className="font-medium">
                  {p.name}
                  {p.featured ? (
                    <span className="ml-2">
                      <Badge tone="gold">Featured</Badge>
                    </span>
                  ) : null}
                </Td>
                <Td>{p.category ?? "—"}</Td>
                <Td>
                  <Badge tone={p.isPublished ? "success" : "neutral"}>
                    {p.isPublished ? "Published" : "Draft"}
                  </Badge>
                </Td>
                <Td>
                  <div className="flex justify-end gap-2">
                    <RoleGate allow={["admin", "editor"]}>
                      <Button size="sm" variant="outline" onClick={() => setEditing(p)}>
                        Edit
                      </Button>
                    </RoleGate>
                    <RoleGate allow={["admin", "editor"]}>
                      <ConfirmButton
                        confirmMessage={`Delete product "${p.name}"? This can't be undone.`}
                        onConfirm={() => deleteProduct.mutate(p.id)}
                      >
                        Delete
                      </ConfirmButton>
                    </RoleGate>
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
