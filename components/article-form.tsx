"use client";

import { FormEvent, useEffect, useState } from "react";
import { useInventory } from "@/lib/inventory-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle2, Save } from "lucide-react";
import type { Article } from "@/lib/types";

interface ArticleFormProps {
  onBack: () => void;
  editArticle?: Article | null;
}

export function ArticleForm({ onBack, editArticle }: ArticleFormProps) {
  const { addArticle, updateArticle } = useInventory();

  const [saved, setSaved] = useState(false);
  const [values, setValues] = useState({
    code: "",
    name: "",
    description: "",
    cost: "",
  });

  useEffect(() => {
    if (!editArticle) return;

    setValues({
      code: editArticle.code ?? "",
      name: editArticle.name ?? "",
      description: editArticle.description ?? "",
      cost: String(editArticle.cost ?? ""),
    });
  }, [editArticle]);

  const updateField = (
    field: "code" | "name" | "description" | "cost",
    value: string,
  ) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      code: values.code,
      name: values.name,
      description: values.description,
      cost: Number(values.cost) || 0,
    };

    if (editArticle) {
      updateArticle(editArticle.id, payload);
    } else {
      addArticle(payload);
      setValues({
        code: "",
        name: "",
        description: "",
        cost: "",
      });
    }

    setSaved(true);
    window.setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-background px-4 py-4">
      <section className="mx-auto max-w-md space-y-4">
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div>
            <h1 className="text-xl font-bold">
              {editArticle ? "Editar artículo" : "Nuevo artículo"}
            </h1>
          </div>
        </div>

        {saved ? (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              {editArticle
                ? "Los datos del artículo fueron actualizados."
                : "El artículo fue registrado correctamente."}
            </AlertDescription>
          </Alert>
        ) : null}

        <Card>
          <CardContent className="p-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="code" className="text-sm font-medium">
                  Código
                </label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Ej. PROD-001"
                  value={values.code}
                  onChange={(e) => updateField("code", e.target.value)}
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nombre
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nombre del artículo"
                  value={values.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Descripción
                </label>
                <Textarea
                  id="description"
                  placeholder="Detalles del producto"
                  rows={3}
                  value={values.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="cost" className="text-sm font-medium">
                  Costo
                </label>
                <Input
                  id="cost"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={values.cost}
                  onChange={(e) => updateField("cost", e.target.value)}
                  className="h-11"
                  required
                />
              </div>

              <Button type="submit" className="w-full gap-2">
                <Save className="h-4 w-4" />
                {editArticle ? "Actualizar artículo" : "Guardar artículo"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
