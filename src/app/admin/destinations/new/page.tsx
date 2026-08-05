"use client";
import * as React from "react";
import { DestinationForm } from "@/components/admin/DestinationForm";
import { createEmptyDestination } from "@/lib/admin/store/destinations-store";

export default function NewDestinationPage() {
  const [initial] = React.useState(createEmptyDestination);
  return <DestinationForm initial={initial} mode="create" />;
}
