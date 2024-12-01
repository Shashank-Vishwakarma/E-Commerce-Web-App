import prismadb from "@/database/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import SettingsForm from "./components/SettingsForm";

interface SettingsPageProps {
    params: { storeId: string };
}

export default async function SettingsPage({ params }: SettingsPageProps) {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId,
        },
    });

    if (!store) {
        redirect("/");
    }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SettingsForm initialData={store} />
            </div>
        </div>
    );
}
