"use client";

import { useState } from "react";
import { useInventory } from "@/lib/inventory-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Search,
  Edit2,
  Trash2,
  Package,
  ArrowUpDown,
  AlertCircle,
} from "lucide-react";
import type { Article } from "@/lib/types";

interface ArticlesListProps {
  onBack: () => void;
  onEdit: (article: Article) => void;
}

type SortField = "name" | "code";

export function ArticlesList({ onBack, onEdit }: ArticlesListProps) {
  const { articles, deleteArticle } = useInventory();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentSort, setCurrentSort] = useState<SortField>("name");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const query = searchTerm.trim().toLowerCase();

  const visibleArticles = [...articles]
    .filter((item) => {
      if (!query) return true;

      return (
        item.name.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query)
      );
    })
    .sort((first, second) => {
      return currentSort === "name"
        ? first.name.localeCompare(second.name)
        : first.code.localeCompare(second.code);
    });

  const openDeleteDialog = (article: Article) => {
    setSelectedArticle(article);
    setErrorMessage("");
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedArticle) return;

    const removed = deleteArticle(selectedArticle.id);

    if (!removed) {
      setErrorMessage(
        "No es posible eliminar un artículo que tenga existencia.",
      );
      return;
    }

    setIsDeleteModalOpen(false);
    setSelectedArticle(null);
    setErrorMessage("");
  };

  const changeSortField = () => {
    setCurrentSort((prev) => (prev === "name" ? "code" : "name"));
  };

  return (
    <main className="min-h-screen bg-background px-4 py-4">
      <section className="mx-auto max-w-md space-y-4">
        <div className="flex items-center gap-3">
          <Button type="button" variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Artículos registrados</h1>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Escribe para buscar"
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
            onClick={changeSortField}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Criterio actual:{" "}
          <span className="font-medium">
            {currentSort === "name" ? "Nombre" : "Código"}
          </span>
        </p>

        {visibleArticles.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <Package className="mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {articles.length === 0
                  ? "Todavía no hay artículos registrados."
                  : "No hubo resultados para esa búsqueda."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {visibleArticles.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="inline-flex rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
                        {item.code}
                      </p>

                      <h3 className="mt-2 truncate text-sm font-semibold">
                        {item.name}
                      </h3>

                      {item.description ? (
                        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      ) : null}

                      <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
                        <span>
                          Costo:{" "}
                          <span className="font-medium text-foreground">
                            ${item.cost.toFixed(2)}
                          </span>
                        </span>
                        <span>
                          Stock:{" "}
                          <span className="font-medium text-foreground">
                            {item.stock}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => onEdit(item)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-destructive hover:text-destructive"
                        onClick={() => openDeleteDialog(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <AlertDialog
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Eliminar artículo</AlertDialogTitle>
              <AlertDialogDescription>
                Se eliminará el artículo "{selectedArticle?.name}". Esta acción
                no se puede revertir.
              </AlertDialogDescription>
            </AlertDialogHeader>

            {errorMessage ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            ) : null}

            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </main>
  );
}
