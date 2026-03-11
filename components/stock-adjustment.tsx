"use client";

import { FormEvent, useMemo, useState } from "react";
import { useInventory } from "@/lib/inventory-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Save,
  ArrowDownToLine,
  ArrowUpFromLine,
  Package,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { MovementType } from "@/lib/types";

interface StockAdjustmentProps {
  onBack: () => void;
}

export function StockAdjustment({ onBack }: StockAdjustmentProps) {
  const { articles, addMovement } = useInventory();

  const [articleId, setArticleId] = useState("");
  const [movementType, setMovementType] = useState<MovementType>("entrada");
  const [quantity, setQuantity] = useState("");
  const [concept, setConcept] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "">(
    "",
  );

  const currentArticle = useMemo(
    () => articles.find((item) => item.id === articleId),
    [articles, articleId],
  );

  const clearFeedback = () => {
    setFeedbackText("");
    setFeedbackType("");
  };

  const showFeedback = (type: "success" | "error", text: string) => {
    setFeedbackType(type);
    setFeedbackText(text);
  };

  const resetForm = () => {
    setArticleId("");
    setQuantity("");
    setConcept("");
    setMovementType("entrada");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearFeedback();

    if (!articleId || !quantity || !concept.trim()) {
      showFeedback("error", "Debes completar todos los campos.");
      return;
    }

    const parsedQuantity = Number(quantity);

    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      showFeedback(
        "error",
        "La cantidad debe ser un número entero mayor que cero.",
      );
      return;
    }

    const response = addMovement(
      articleId,
      movementType,
      parsedQuantity,
      concept.trim(),
    );

    if (!response.success) {
      showFeedback("error", response.message);
      return;
    }

    showFeedback("success", response.message);
    resetForm();
  };

  const isSuccess = feedbackType === "success";
  const hasArticles = articles.length > 0;

  return (
    <main className="min-h-screen bg-background px-4 py-4">
      <section className="mx-auto max-w-md space-y-4">
        <div className="flex items-center gap-3">
          <Button type="button" variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Registrar movimiento</h1>
        </div>

        {feedbackText ? (
          <Alert variant={isSuccess ? "default" : "destructive"}>
            {isSuccess ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>{feedbackText}</AlertDescription>
          </Alert>
        ) : null}

        {!hasArticles ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <Package className="mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No hay artículos registrados en este momento.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Debes crear un artículo antes de registrar movimientos.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-5">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="article" className="text-sm font-medium">
                    Artículo
                  </label>
                  <select
                    id="article"
                    value={articleId}
                    onChange={(e) => setArticleId(e.target.value)}
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  >
                    <option value="">Selecciona un artículo</option>
                    {articles.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.code} - {item.name} (Stock: {item.stock})
                      </option>
                    ))}
                  </select>
                </div>

                {currentArticle ? (
                  <div className="rounded-md border bg-muted/40 p-3 text-sm">
                    <span className="text-muted-foreground">
                      Existencia actual:{" "}
                    </span>
                    <span className="font-semibold">
                      {currentArticle.stock} unidades
                    </span>
                  </div>
                ) : null}

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Tipo de movimiento
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant={
                        movementType === "entrada" ? "default" : "outline"
                      }
                      className="h-12 gap-2"
                      onClick={() => setMovementType("entrada")}
                    >
                      <ArrowDownToLine className="h-4 w-4" />
                      Entrada
                    </Button>

                    <Button
                      type="button"
                      variant={
                        movementType === "salida" ? "destructive" : "outline"
                      }
                      className="h-12 gap-2"
                      onClick={() => setMovementType("salida")}
                    >
                      <ArrowUpFromLine className="h-4 w-4" />
                      Salida
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="quantity" className="text-sm font-medium">
                    Cantidad
                  </label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Digite la cantidad"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="concept" className="text-sm font-medium">
                    Concepto
                  </label>
                  <Textarea
                    id="concept"
                    placeholder="Describe el motivo del movimiento"
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                    rows={3}
                    className="resize-none"
                    required
                  />
                </div>

                <Button type="submit" className="w-full gap-2">
                  <Save className="h-4 w-4" />
                  Guardar movimiento
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
}
