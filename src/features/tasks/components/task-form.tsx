"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { taskSchema } from "@/features/tasks/schemas";
import { useCreateTask } from "@/features/tasks/api/use-create-task";
import { useUpdateTask } from "@/features/tasks/api/use-update-task";
import { DatePicker } from "@/components/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { Task, TaskStatus } from "@/features/tasks/types";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";

type TaskFormProps = {
  projectOptions: { id: string; name: string; imagePreview: string }[];
  memberOptions: { id: string; name: string }[];
  onCancel?: () => void;
  initialValues?: Task;
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

  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();
  const isPending = initialValues
    ? updateMutation.isPending
    : createMutation.isPending;

  const form = useForm<FormValues>({
    resolver: zodResolver(
      taskSchema.omit({ workspaceId: true, description: true })
    ),
    defaultValues: {
      workspaceId,
      ...(initialValues
        ? { ...initialValues, dueDate: new Date(initialValues.dueDate) }
        : {}),
    },
  });

  const onSubmitCreate = (values: FormValues) => {
    createMutation.mutate(
      {
        json: { ...values, workspaceId },
      },
      {
        onSuccess: ({ data }) => {
          form.reset();
          onCancel?.();
        },
      }
    );
  };

  const onSubmitUpdate = (values: FormValues) => {
    updateMutation.mutate(
      {
        json: { ...values, workspaceId },
        param: { taskId: (initialValues as Task).$id },
      },
      {
        onSuccess: ({ data }) => {
          form.reset();
          onCancel?.();
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      {initialValues ? (
        <UpdateTaskHeader task={initialValues} />
      ) : (
        <CreateTaskHeader />
      )}
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              initialValues ? onSubmitUpdate : onSubmitCreate
            )}
          >
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
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due date</FormLabel>
                    <FormControl>
                      <DatePicker {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign to</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        {memberOptions.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            <div className="flex items-center gap-x-2">
                              <MemberAvatar
                                className="size-6"
                                name={member.name}
                              />
                              {member.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        <SelectItem value={TaskStatus.BACKLOG}>
                          Backlog
                        </SelectItem>
                        <SelectItem value={TaskStatus.TODO}>To do</SelectItem>
                        <SelectItem value={TaskStatus.IN_PROGRESS}>
                          In progress
                        </SelectItem>
                        <SelectItem value={TaskStatus.IN_REVIEW}>
                          In review
                        </SelectItem>
                        <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        {projectOptions.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            <div className="flex items-center gap-x-2">
                              <ProjectAvatar
                                image={project.imagePreview}
                                className="size-6"
                                name={project.name}
                              />
                              {project.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

const UpdateTaskHeader: React.FC<{ task: Task }> = ({ task }) => {
  return (
    <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
      <Button size="sm" variant="secondary" asChild>
        <Link
          href={`/workspaces/${task.workspaceId}/projects/${task.projectId}`}
        >
          <ArrowLeftIcon className="size-4 mr-2" />
          Back
        </Link>
      </Button>
      <CardTitle className="text-xl font-bold">Edit a task</CardTitle>
    </CardHeader>
  );
};
