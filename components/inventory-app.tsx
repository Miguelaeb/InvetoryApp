"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { LoginForm } from "./login-form";
import { MainMenu } from "./main-menu";
import { ArticleForm } from "./article-form";
import { ArticlesList } from "./articles-list";
import { StockAdjustment } from "./stock-adjustment";
import { InventoryView } from "./inventory-view";
import { MovementsHistory } from "./movements-history";
import { Spinner } from "@/components/ui/spinner";
import type { Article } from "@/lib/types";

type View =
  | "menu"
  | "articles"
  | "new-article"
  | "edit-article"
  | "adjustment"
  | "inventory"
  | "history";

export function InventoryApp() {
  const { user, isLoading } = useAuth();

  const [activeView, setActiveView] = useState<View>("menu");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const goToView = (view: View) => {
    setActiveView(view);
    setSelectedArticle(null);
  };

  const openEditForm = (article: Article) => {
    setSelectedArticle(article);
    setActiveView("edit-article");
  };

  const returnToMenu = () => {
    setActiveView("menu");
    setSelectedArticle(null);
  };

  const returnToArticles = () => {
    setActiveView("articles");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  let content;

  switch (activeView) {
    case "new-article":
      content = <ArticleForm onBack={returnToMenu} />;
      break;

    case "edit-article":
      content = (
        <ArticleForm onBack={returnToArticles} editArticle={selectedArticle} />
      );
      break;

    case "articles":
      content = <ArticlesList onBack={returnToMenu} onEdit={openEditForm} />;
      break;

    case "adjustment":
      content = <StockAdjustment onBack={returnToMenu} />;
      break;

    case "inventory":
      content = <InventoryView onBack={returnToMenu} />;
      break;

    case "history":
      content = <MovementsHistory onBack={returnToMenu} />;
      break;

    default:
      content = <MainMenu onNavigate={goToView} />;
      break;
  }

  return content;
}
