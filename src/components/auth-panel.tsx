"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useApp } from "@/context/app-context";
import { AuthError } from "@/lib/auth";
import { type Challenge, isCorrect, makeChallenge } from "@/lib/captcha";
import { Button, Field, Input, Segmented } from "@/components/ui";

type Mode = "login" | "signup";

export function AuthPanel() {
  const { t, signIn, signUp } = useApp();
  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [answer, setAnswer] = useState("");
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setChallenge(makeChallenge());
  }, []);

  function renewChallenge() {
    setChallenge(makeChallenge());
    setAnswer("");
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setInfo(null);
    if (!challenge || !isCorrect(challenge, answer)) {
      setError(t.errors.captcha);
      renewChallenge();
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        await signUp(username, password);
        setMode("login");
        setPassword("");
        setInfo(t.auth.created);
      } else {
        await signIn(username, password);
      }
    } catch (err) {
      setError(err instanceof AuthError ? t.errors[err.code] : t.errors.generic);
    } finally {
      setBusy(false);
      renewChallenge();
    }
  }

  return (
    <section className="cp-glass cp-auth" aria-labelledby="auth-title">
      <Segmented<Mode>
        label={t.auth.login}
        value={mode}
        onChange={(next) => {
          setMode(next);
          setError(null);
          setInfo(null);
        }}
        options={[
          { value: "login", label: t.auth.login },
          { value: "signup", label: t.auth.signup },
        ]}
      />
      <p className="cp-muted cp-small" id="auth-title">
        {mode === "login" ? t.auth.subLogin : t.auth.subSignup}
      </p>

      <form className="cp-stack" onSubmit={onSubmit}>
        <Field label={t.auth.username} hint={t.auth.usernameHint}>
          <Input
            value={username}
            autoComplete="username"
            maxLength={20}
            required
            onChange={(e) => setUsername(e.target.value)}
          />
        </Field>
        <Field label={t.auth.password} hint={t.auth.passwordHint}>
          <Input
            type="password"
            value={password}
            minLength={10}
            required
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Field label={challenge ? t.auth.captcha(challenge.a, challenge.b) : ""}>
          <Input
            inputMode="numeric"
            autoComplete="off"
            value={answer}
            required
            onChange={(e) => setAnswer(e.target.value)}
          />
        </Field>
        <div className="cp-err" role="alert">
          {error}
        </div>
        {info ? (
          <div className="cp-ok" role="status">
            {info}
          </div>
        ) : null}
        <Button type="submit" disabled={busy}>
          {mode === "login" ? t.auth.submitLogin : t.auth.submitSignup}
        </Button>
      </form>
    </section>
  );
}
