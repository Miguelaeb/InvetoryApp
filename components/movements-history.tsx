"use client";

import { useInventory } from "@/lib/inventory-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
} from "lucide-react";

interface MovementsHistoryProps {
  onBack: () => void;
}

export function MovementsHistory({ onBack }: MovementsHistoryProps) {
  const { movements } = useInventory();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">
            Historial de Movimientos
          </h1>
        </div>

        {movements.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <History className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No hay movimientos registrados.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {movements.map((movement) => (
              <Card key={movement.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        movement.type === "entrada"
                          ? "bg-[oklch(0.55_0.18_145/0.15)] text-[oklch(0.55_0.18_145)]"
                          : "bg-destructive/15 text-destructive"
                      }`}
                    >
                      {movement.type === "entrada" ? (
                        <ArrowDownToLine className="w-5 h-5" />
                      ) : (
                        <ArrowUpFromLine className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded ${
                            movement.type === "entrada"
                              ? "bg-[oklch(0.55_0.18_145/0.15)] text-[oklch(0.55_0.18_145)]"
                              : "bg-destructive/15 text-destructive"
                          }`}
                        >
                          {movement.type === "entrada" ? "ENTRADA" : "SALIDA"}
                        </span>
                        <span className="text-xs font-mono text-muted-foreground">
                          {movement.articleCode}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground mt-1 truncate">
                        {movement.articleName}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                        {movement.concept}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(movement.createdAt)}
                        </span>
                        <span
                          className={`text-sm font-bold ${
                            movement.type === "entrada"
                              ? "text-[oklch(0.55_0.18_145)]"
                              : "text-destructive"
                          }`}
                        >
                          {movement.type === "entrada" ? "+" : "-"}
                          {movement.quantity} uds
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
