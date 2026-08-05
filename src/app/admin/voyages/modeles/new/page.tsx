"use client";
import * as React from "react";
import { TaskTemplateForm } from "@/components/admin/TaskTemplateForm";
import { createEmptyTaskTemplate } from "@/lib/admin/store/task-templates-store";

export default function NewTaskTemplatePage() {
  const [initial] = React.useState(createEmptyTaskTemplate);
  return <TaskTemplateForm initial={initial} mode="create" />;
}
