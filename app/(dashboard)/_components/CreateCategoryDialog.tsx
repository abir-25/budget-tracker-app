"use client";
import React, { useCallback, useState } from "react";
import { TransactionType } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
} from "@/schema/categories";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { CircleOff, Loader2, PlusSquare } from "lucide-react";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateCategory } from "../_actions/categories";
import { Category } from "@prisma/client";
import { toast } from "sonner";
import { useTheme } from "next-themes";

interface Props {
  type: TransactionType;
  successCallback: (category: Category) => void;
}

const CreateCategoryDialog = ({ type, successCallback }: Props) => {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      type,
    },
  });

  const queryClient = useQueryClient();
  const theme = useTheme();

  const { mutate, isPending } = useMutation({
    mutationFn: CreateCategory,
    onSuccess: async (data: Category) => {
      form.reset({
        name: "",
        icon: "",
        type,
      });

      toast.success(`Category ${data.name} created successfully`, {
        id: "create-category",
      });

      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      successCallback(data);

      setOpen((prev) => !prev);
    },

    onError: () => {
      toast.error("Something went wrong", {
        id: "create-category",
      });
    },
  });

  const onSubmit = useCallback(
    (values: CreateCategorySchemaType) => {
      toast.loading("Creating category...", {
        id: "create-category",
      });

      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="flex border-separate items-center justify-start rounded-none broder-b px-3 py-3 text-mutes-foreground"
        >
          <PlusSquare className="mr-2 h-4 w-4" />
          Create New
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create
            <span
              className={cn(
                "m-1",
                type === "income" ? "text-emerald-500" : "text-red-500"
              )}
            >
              {type}
            </span>
            category
          </DialogTitle>
          <DialogDescription>
            Categories are used to group your transaction
          </DialogDescription>
          <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Category" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is how your category will appear in the app
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className="h-[100px] w-full"
                          >
                            {form.watch("icon") ? (
                              <div className="flex flex-col items-center gap-2">
                                <span className="text-5xl" role="img">
                                  {field.value}
                                </span>
                                <p className="text-xs text-muted-foreground">
                                  Click to select
                                </p>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-2">
                                <CircleOff className="h-[48px] w-[48px]" />
                                <p className="text-xs text-muted-foreground">
                                  Click to select
                                </p>
                              </div>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full">
                          <Picker
                            data={data}
                            theme={theme.resolvedTheme}
                            onEmojiSelect={(emoji: { native: string }) => {
                              field.onChange(emoji.native);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormDescription>
                      This is how your category will appear in the app
                    </FormDescription>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <>
              <Button
                type="button"
                variant={"secondary"}
                onClick={() => {
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isPending}
              >
                {!isPending && "Create"}
                {isPending && <Loader2 className="animate-spin" />}
              </Button>
            </>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryDialog;
