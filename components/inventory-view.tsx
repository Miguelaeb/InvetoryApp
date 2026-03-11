"use client";

import { useState } from "react";
import { useInventory } from "@/lib/inventory-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Search, Package, ArrowUpDown } from "lucide-react";

interface InventoryViewProps {
  onBack: () => void;
}

type OrderField = "name" | "code";

export function InventoryView({ onBack }: InventoryViewProps) {
  const { articles } = useInventory();

  const [searchTerm, setSearchTerm] = useState("");
  const [orderField, setOrderField] = useState<OrderField>("name");

  const query = searchTerm.trim().toLowerCase();

  const visibleItems = [...articles]
    .filter((item) => {
      if (!query) return true;

      return (
        item.name.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query)
      );
    })
    .sort((first, second) => {
      return orderField === "name"
        ? first.name.localeCompare(second.name)
        : first.code.localeCompare(second.code);
    });

  const unitsCount = articles.reduce((total, item) => total + item.stock, 0);
  const inventoryAmount = articles.reduce(
    (total, item) => total + item.stock * item.cost,
    0,
  );

  const changeOrder = () => {
    setOrderField((prev) => (prev === "name" ? "code" : "name"));
  };

  return (
    <main className="min-h-screen bg-background px-4 py-4">
      <section className="mx-auto max-w-md space-y-4">
        <div className="flex items-center gap-3">
          <Button type="button" variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Resumen de inventario</h1>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Unidades totales</p>
              <p className="text-2xl font-bold">{unitsCount}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Valor acumulado</p>
              <p className="text-2xl font-bold">
                ${inventoryAmount.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nombre o código"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 pl-10"
            />
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-12 w-12"
            onClick={changeOrder}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Vista ordenada por{" "}
          <span className="font-medium">
            {orderField === "name" ? "nombre" : "código"}
          </span>
        </p>

        {visibleItems.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <Package className="mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {articles.length === 0
                  ? "No hay productos cargados en el inventario."
                  : "No se encontraron coincidencias."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {visibleItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="inline-flex rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
                        {item.code}
                      </p>

                      <h3 className="mt-2 truncate text-sm font-semibold">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Costo unitario: ${item.cost.toFixed(2)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p
                        className={`text-2xl font-bold ${
                          item.stock === 0
                            ? "text-destructive"
                            : item.stock < 10
                              ? "text-amber-600"
                              : "text-green-600"
                        }`}
                      >
                        {item.stock}
                      </p>
                      <p className="text-xs text-muted-foreground">unidades</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
