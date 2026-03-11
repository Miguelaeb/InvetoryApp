"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Package2, TriangleAlert } from "lucide-react";

export function LoginForm() {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (field: "username" | "password", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");
    setSubmitting(true);

    try {
      const isValidUser = login(formData.username, formData.password);

      if (!isValidUser) {
        setErrorMessage("El usuario o la contraseña no son válidos.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm shadow-sm">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
            <Package2 className="h-7 w-7 text-primary-foreground" />
          </div>

          <div className="space-y-1">
            <CardTitle className="text-2xl">Control de Inventario</CardTitle>
            <p className="text-sm text-muted-foreground">
              Inicia sesión para continuar
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMessage ? (
              <Alert variant="destructive">
                <TriangleAlert className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            ) : null}

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Usuario
                </label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  placeholder="Escribe tu usuario"
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Contraseña
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  placeholder="Escribe tu contraseña"
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className="h-11"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="h-11 w-full" disabled={submitting}>
              {submitting ? "Validando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
