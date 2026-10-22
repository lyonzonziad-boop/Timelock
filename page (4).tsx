"use client";

import { useApp } from "@/context/app-context";
import { PageHeader } from "@/components/shell";
import { CapsuleForm } from "@/components/capsule-form";

export default function NewCapsulePage() {
  const { t } = useApp();
  return (
    <div className="cp-stack-lg cp-narrow">
      <PageHeader title={t.form.title} />
      <CapsuleForm />
    </div>
  );
}
