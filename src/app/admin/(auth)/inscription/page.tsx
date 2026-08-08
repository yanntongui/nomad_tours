"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminSignupPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    setLoading(false);
    if (error) {
      setError(error.message === "User already registered" ? "Un compte existe déjà avec cet email." : "Impossible de créer le compte.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="space-y-4 text-center">
        <h1 className="text-lg font-semibold text-stone-800 dark:text-stone-100">Compte créé</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Votre compte a bien été créé et est en attente d&apos;activation par un administrateur. Vous pourrez vous connecter une fois votre accès activé.
        </p>
        <Button variant="outline" className="w-full" onClick={() => router.push("/admin/login")}>
          Retour à la connexion
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h1 className="text-lg font-semibold text-stone-800 dark:text-stone-100">Créer un compte</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nom complet</Label>
          <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@nomadtours.bj"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="8 caractères minimum"
          />
        </div>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Création…" : "Créer mon compte"}
        </Button>
      </form>
      <p className="text-center text-xs text-stone-500 dark:text-stone-400">
        Déjà un compte ?{" "}
        <Link href="/admin/login" className="font-medium text-luxe-terracotta hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
