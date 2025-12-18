"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Share2, Printer, Check } from "lucide-react";
import { useState } from "react";

export function ShareButtons() {
    const [copied, setCopied] = useState(false);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            toast.success("تم نسخ الرابط بنجاح");

            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("فشل نسخ الرابط");
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex gap-2">
            <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleCopyLink}
            >
                {copied ? <Check className="ml-2 h-4 w-4" /> : <Share2 className="ml-2 h-4 w-4" />}
                {copied ? "تم النسخ" : "نسخ الرابط"}
            </Button>
            <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handlePrint}
            >
                <Printer className="ml-2 h-4 w-4" />
                طباعة
            </Button>
        </div>
    );
}
