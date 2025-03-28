"use client";

import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { ArrowLeftIcon, ImageIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { workspaceSchema } from "@/features/workspaces/schemas";
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
import { useCreateWorkspace } from "@/features/workspaces/api/use-create-workspace";
import { cn } from "@/lib/utils";
import { Workspace } from "@/features/workspaces/types";
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace";

type CreateWorkspaceFormProps = {
  onCancel?: () => void;
  initialValues?: Workspace;
};

type FormValues = z.infer<typeof workspaceSchema>;

export const WorkspaceForm: React.FC<CreateWorkspaceFormProps> = ({
  onCancel,
  initialValues,
}) => {
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);
  const createQuery = useCreateWorkspace();
  const updateQuery = useUpdateWorkspace();
  const mutate = initialValues ? updateQuery.mutate : createQuery.mutate;
  const isPending = initialValues
    ? updateQuery.isLoading
    : createQuery.isLoading;

  const form = useForm<FormValues>({
    resolver: zodResolver(workspaceSchema),
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
        form: values,
        param: initialValues ? { workspaceId: initialValues.$id } : undefined,
      },
      {
        onSuccess: ({ data }) => {
          form.reset();
          router.push(`/workspaces/${data.$id}`);
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
        <UpdateWorkspaceHeader workspace={initialValues} />
      ) : (
        <CreateWorkspaceHeader />
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
                    <FormLabel>Workspace Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter workspace name" />
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
                        <p className="text-sm">Workspace Icon</p>
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
                {initialValues ? "Save changes" : "Create Workspace"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

const CreateWorkspaceHeader: React.FC = () => {
  return (
    <CardHeader className="flex p-7">
      <CardTitle className="text-xl font-bold">
        Create a new workspace
      </CardTitle>
    </CardHeader>
  );
};

const UpdateWorkspaceHeader: React.FC<{ workspace: Workspace }> = ({
  workspace,
}) => {
  const router = useRouter();
  const onClick = () => {
    router.push(`/workspaces/${workspace.$id}`);
  };

  return (
    <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
      <Button size="sm" variant="secondary" onClick={onClick}>
        <ArrowLeftIcon className="size-4 mr-2" />
        Back
      </Button>
      <CardTitle className="text-xl font-bold">{workspace.name}</CardTitle>
    </CardHeader>
  );
};
