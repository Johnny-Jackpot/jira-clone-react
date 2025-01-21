"use client";

import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
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
import { projectSchema } from "@/features/projects/schemas";
import { useCreateProject } from "@/features/projects/api/use-create-project";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Project } from "@/features/projects/types";
import { useUpdateProject } from "@/features/projects/api/use-update-project";
import Link from "next/link";

type ProjectFormProps = {
  onCancel?: () => void;
  initialValues?: Project;
};

type FormValues = z.infer<typeof projectSchema>;

export const ProjectForm: React.FC<ProjectFormProps> = ({
  onCancel,
  initialValues,
}) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);
  const createQuery = useCreateProject();
  const updateQuery = useUpdateProject();
  const mutate = initialValues ? updateQuery.mutate : createQuery.mutate;
  const isPending = initialValues
    ? updateQuery.isLoading
    : createQuery.isLoading;

  const form = useForm<FormValues>({
    resolver: zodResolver(projectSchema.omit({ workspaceId: true })),
    defaultValues: initialValues
      ? {
          ...initialValues,
          image: initialValues.imagePreview ?? "",
        }
      : {
          name: "",
        },
  });

  const onSubmit = (values: FormValues) => {
    mutate(
      {
        form: { ...values, workspaceId },
        param: initialValues ? { projectId: initialValues.$id } : undefined,
      },
      {
        onSuccess: ({ data }) => {
          form.reset();
          router.push(`/workspaces/${data.workspaceId}/projects/${data.$id}`)
        },
      },
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      {initialValues ? (
        <UpdateProjectHeader project={initialValues} />
      ) : (
        <CreateProjectHeader />
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
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter project name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <div className="flex flex-col gap-y-2">
                    <div className="flex items-center gap-x-5">
                      {field.value ? (
                        <div className="size-[72px] relative rounded-md overflow-hidden">
                          <Image
                            alt="Logo"
                            fill
                            className="object-cover"
                            src={
                              field.value instanceof File
                                ? URL.createObjectURL(field.value)
                                : field.value
                            }
                          />
                        </div>
                      ) : (
                        <Avatar className="size-[72px]">
                          <AvatarFallback>
                            <ImageIcon className="size-[36px] text-neutral-400" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex flex-col">
                        <p className="text-sm">Project Icon</p>
                        <p className="text-sm text-muted-foreground">
                          JPG, PNG, SVG or JPEG, max 1MB
                        </p>
                        <input
                          type="file"
                          className="hidden"
                          accept=".jpg, .png, .jpeg, .svg"
                          ref={inputRef}
                          disabled={isPending}
                          onChange={handleImageChange}
                        />
                        {field.value ? (
                          <Button
                            type="button"
                            disabled={isPending}
                            variant="destructive"
                            size="xs"
                            className="w-fit mt-2"
                            onClick={() => {
                              field.onChange("");
                              if (inputRef.current) {
                                inputRef.current.value = "";
                              }
                            }}
                          >
                            Remove Image
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            disabled={isPending}
                            variant="teritary"
                            size="xs"
                            className="w-fit mt-2"
                            onClick={() => inputRef.current?.click()}
                          >
                            Upload Image
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
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
                {initialValues ? "Save changes" : "Create Project"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

const CreateProjectHeader: React.FC = () => {
  return (
    <CardHeader className="flex p-7">
      <CardTitle className="text-xl font-bold">Create a new project</CardTitle>
    </CardHeader>
  );
};

const UpdateProjectHeader: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
      <Button size="sm" variant="secondary" asChild>
        <Link href={`/workspaces/${project.workspaceId}/projects/${project.$id}`}>
          <ArrowLeftIcon className="size-4 mr-2" />
          Back
        </Link>
      </Button>
      <CardTitle className="text-xl font-bold">{project.name}</CardTitle>
    </CardHeader>
  );
};
