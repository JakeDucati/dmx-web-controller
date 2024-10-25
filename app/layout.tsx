import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import NavHeader from "@/components/navHeader";
import Fixtures from "@/components/fixtures";
import Functions from "@/components/functions";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import useSocket from "@/hooks/useSocket";

export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.description,
    icons: {
        icon: "/favicon.ico",
    },
};

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html suppressHydrationWarning lang="en">
            <head />
            <body
                className={clsx(
                    "min-h-screen bg-background font-sans antialiased",
                    fontSans.variable,
                )}
            >
                <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
                    <div className="relative flex flex-col h-screen">
                        <NavHeader />
                        <Fixtures />
                        <Functions />
                        <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
                            <ToastContainer closeOnClick theme='dark' autoClose={2400} closeButton={false} />

                            {children}
                        </main>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
