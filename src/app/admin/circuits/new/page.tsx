"use client";
import * as React from "react";
import { CircuitForm } from "@/components/admin/CircuitForm";
import { createEmptyCircuit } from "@/lib/admin/store/circuits-store";

export default function NewCircuitPage() {
  const [initial] = React.useState(createEmptyCircuit);
  return <CircuitForm initial={initial} mode="create" />;
}
