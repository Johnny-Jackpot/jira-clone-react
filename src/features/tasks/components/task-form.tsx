"use client";

import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon, ImageIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DottedSeparator } from "@/components/dotted-separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Project } from "@/features/projects/types";
import { taskSchema } from "@/features/tasks/schemas";
import { useCreateTask } from "@/features/tasks/api/use-create-task";

type TaskFormProps = {
  projectOptions: { id: string; name: string; imagePreview: string }[];
  memberOptions: { id: string; name: string }[];
  onCancel?: () => void;
  initialValues?: object;
};

type FormValues = z.infer<typeof taskSchema>;

export const TaskForm: React.FC<TaskFormProps> = ({
  projectOptions,
  memberOptions,
  initialValues,
  onCancel,
}) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);
  const createQuery = useCreateTask();
  const updateQuery = useCreateTask();
  const mutate = initialValues ? updateQuery.mutate : createQuery.mutate;
  const isPending = initialValues
    ? updateQuery.isLoading
    : createQuery.isLoading;

  const form = useForm<FormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: { workspaceId },
  });

  const onSubmit = (values: FormValues) => {
    mutate(
      {
        json: { ...values, workspaceId },
      },
      {
        onSuccess: ({ data }) => {
          form.reset();
          //TODO redirect to new task
        },
      },
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      {initialValues ? (
        <UpdateTaskHeader project={initialValues} />
      ) : (
        <CreateTaskHeader />
      )}
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter task name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DottedSeparator className="py-7" />
            <div className="flex items-center justify-between">
              <Button
                type="button"
                size="lg"
                variant="secondary"
                onClick={onCancel}
                disabled={isPending}
                className={cn(!onCancel && "invisible")}
              >
                Cancel
              </Button>
              <Button type="submit" size="lg" disabled={isPending}>
                {initialValues ? "Save changes" : "Create Task"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

const CreateTaskHeader: React.FC = () => {
  return (
    <CardHeader className="flex p-7">
      <CardTitle className="text-xl font-bold">Create a new Task</CardTitle>
    </CardHeader>
  );
};

const UpdateTaskHeader: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
      <Button size="sm" variant="secondary" asChild>
        <Link
          href={`/workspaces/${project.workspaceId}/projects/${project.$id}`}
        >
          <ArrowLeftIcon className="size-4 mr-2" />
          Back
        </Link>
      </Button>
      <CardTitle className="text-xl font-bold">{project.name}</CardTitle>
    </CardHeader>
  );
};
