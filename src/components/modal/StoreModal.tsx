"use client";

import { useStoreModal } from "@/hooks/useModalStore";
import React, { useState } from "react";
import Modal from "./Modal";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import prismadb from "@/database/db";
import { redirect } from "next/navigation";

const formSchema = z.object({
    name: z.string().min(1),
});

export default function StoreModal() {
    const modalStore = useStoreModal();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await fetch("/api/stores", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });
            const data = await response.json();
            toast("Store created successfully");
            window.location.assign(`/${data.id}`);
        } catch (error: any) {
            console.log("Error in creating store", error);
            toast(error?.message);
        }
    };

    return (
        <Modal
            isOpen={modalStore.isOpen}
            onClose={modalStore.onClose}
            title="Create Store"
            description="Add a new store to manage products and categories">
            <div>
                <div className="space-y-4 py-2 pb-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={
                                                    form.formState.isSubmitting
                                                }
                                                placeholder="E-Commerce"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                                <Button
                                    variant="outline"
                                    disabled={form.formState.isSubmitting}
                                    onClick={modalStore.onClose}>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={form.formState.isSubmitting}>
                                    Continue
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    );
}
