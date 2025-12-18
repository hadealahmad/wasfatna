"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Flag, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface ReportModalProps {
    reportableId: number;
    reportableType: "recipe" | "list";
    trigger?: React.ReactNode;
}

export function ReportModal({ reportableId, reportableType, trigger }: ReportModalProps) {
    const { isAuthenticated, token } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [type, setType] = useState<"content_issue" | "feedback">("content_issue");
    const [message, setMessage] = useState("");

    const handleGoogleLogin = async () => {
        try {
            const response = await api.auth.getGoogleUrl() as { url: string };
            window.location.href = response.url;
        } catch (error) {
            console.error("Login failed:", error);
            toast.error("فشل تسجيل الدخول");
        }
    };

    const handleSubmit = async () => {
        if (!message.trim()) {
            toast.error("الرجاء كتابة رسالة");
            return;
        }

        if (message.length > 1000) {
            toast.error("الرسالة تجاوزت الحد المسموح (1000 حرف)");
            return;
        }

        setIsLoading(true);
        try {
            if (!token) throw new Error("No token");

            await api.reports.create(token, {
                reportable_id: reportableId,
                reportable_type: reportableType,
                type,
                message,
            });
            toast.success("تم إرسال بلاغك بنجاح");
            setIsOpen(false);
            setMessage("");
            setType("content_issue");
        } catch (error) {
            console.error("Report failed:", error);
            toast.error("حدث خطأ أثناء إرسال البلاغ");
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-destructive">
                        <Flag className="h-4 w-4" />
                        <span>إبلاغ</span>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                {!isAuthenticated ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                        <div className="bg-muted p-3 rounded-full">
                            <Flag className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <DialogHeader>
                            <DialogTitle className="text-center">تسجيل الدخول مطلوب</DialogTitle>
                            <DialogDescription className="text-center">
                                يرجى تسجيل الدخول للتمكن من إرسال البلاغات والملاحظات.
                            </DialogDescription>
                        </DialogHeader>
                        <Button onClick={handleGoogleLogin} className="gap-2 w-full sm:w-auto">
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            تسجيل الدخول باستخدام Google
                        </Button>
                    </div>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>إبلاغ أو تعليق</DialogTitle>
                            <DialogDescription>
                                ساعدنا في تحسين المحتوى من خلال إرسال ملاحظاتك.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">نوع الرسالة</label>
                                <Select
                                    value={type}
                                    onValueChange={(val: "content_issue" | "feedback") => setType(val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="content_issue">تبليغ عن محتوى</SelectItem>
                                        <SelectItem value="feedback">تعليق وتحسين على الوصفة</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">الرسالة</label>
                                <Textarea
                                    placeholder="اكتب تفاصيل بلاغك هنا..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    maxLength={1000}
                                    className="min-h-[100px] resize-none"
                                />
                                <div className="text-xs text-muted-foreground text-left">
                                    {message.length}/1000
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
                                إلغاء
                            </Button>
                            <Button onClick={handleSubmit} disabled={isLoading || !message.trim()}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                إرسال
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
