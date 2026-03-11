"use client";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Package,
  PackagePlus,
  ArrowLeftRight,
  ClipboardList,
  History,
  LogOut,
  User,
} from "lucide-react";

type View =
  | "menu"
  | "articles"
  | "new-article"
  | "adjustment"
  | "inventory"
  | "history";

interface MainMenuProps {
  onNavigate: (view: View) => void;
}

export function MainMenu({ onNavigate }: MainMenuProps) {
  const { user, logout } = useAuth();

  const options: {
    id: View;
    label: string;
    detail: string;
    icon: React.ElementType;
  }[] = [
    {
      id: "new-article",
      label: "Registrar artículo",
      detail: "Agregar un nuevo producto",
      icon: PackagePlus,
    },
    {
      id: "articles",
      label: "Lista de artículos",
      detail: "Consultar y administrar productos",
      icon: Package,
    },
    {
      id: "adjustment",
      label: "Ajuste de existencia",
      detail: "Registrar entradas o salidas",
      icon: ArrowLeftRight,
    },
    {
      id: "inventory",
      label: "Ver inventario",
      detail: "Revisar existencias disponibles",
      icon: ClipboardList,
    },
    {
      id: "history",
      label: "Historial",
      detail: "Consultar movimientos registrados",
      icon: History,
    },
  ];

  return (
    <main className="min-h-screen bg-background px-4 py-5">
      <section className="mx-auto max-w-md">
        <header className="mb-6 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary">
              <Package className="h-5 w-5 text-primary-foreground" />
            </div>

            <div>
              <h1 className="text-xl font-bold">Inventario</h1>
              <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                <span>{user?.username ?? "Usuario"}</span>
              </div>
            </div>
          </div>

          <Button type="button" variant="outline" size="sm" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Salir
          </Button>
        </header>

        <div className="mb-3">
          <p className="text-sm font-semibold tracking-wide text-muted-foreground">
            Opciones disponibles
          </p>
        </div>

        <div className="space-y-3">
          {options.map(({ id, label, detail, icon: Icon }) => (
            <Card
              key={id}
              onClick={() => onNavigate(id)}
              className="cursor-pointer border border-border hover:shadow-sm"
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {label}
                  </p>
                  <p className="text-sm text-muted-foreground">{detail}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
