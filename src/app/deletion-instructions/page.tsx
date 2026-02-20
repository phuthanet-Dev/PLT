import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "คำแนะนำในการขอลบข้อมูลผู้ใช้ | PalangTas",
    description: "ขั้นตอนและวิธีการขอลบข้อมูลผู้ใช้ออกจากระบบของเรา",
};

export default function DeletionInstructionsPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-3xl">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
                <h1 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900 border-b pb-4">
                    คำแนะนำในการขอลบข้อมูลผู้ใช้ (Data Deletion Instructions)
                </h1>

                <div className="space-y-8 text-gray-700">
                    <section>
                        <p className="mb-4 text-lg">
                            หากท่านต้องการลบข้อมูลบัญชีที่เชื่อมต่อกับ <strong>PalangTas</strong> ท่านสามารถดำเนินการได้ตามขั้นตอนดังนี้:
                        </p>

                        <div className="bg-gray-50 rounded-xl p-6">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                วิธียกเลิกการเชื่อมต่อผ่าน Facebook
                            </h2>
                            <ol className="list-decimal pl-6 space-y-3 marker:text-gray-500 marker:font-medium">
                                <li>ไปที่เมนู <strong>"การตั้งค่าและความเป็นส่วนตัว"</strong> (Settings & Privacy) ในบัญชี Facebook ของท่าน</li>
                                <li>เลือกเมนู <strong>"แอปและเว็บไซต์"</strong> (Apps and Websites)</li>
                                <li>ค้นหาแอป <strong>PaLangTas-พลังทาส</strong> แล้วกดปุ่ม <strong>"ลบออก"</strong> (Remove)</li>
                            </ol>
                        </div>
                    </section>

                    <section>
                        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                            <h2 className="text-lg font-semibold mb-3 text-blue-900 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                การขอลบข้อมูลในระบบของเรา
                            </h2>
                            <p className="mb-4 leading-relaxed text-blue-800">
                                หากท่านต้องการให้เราลบข้อมูลทั้งหมดที่บันทึกไว้ในระบบของเราด้วย โปรดส่งอีเมลแจ้งมาที่{" "}
                                <a href="mailto:support@example.com" className="font-semibold text-blue-700 hover:text-blue-900 underline underline-offset-2">
                                    [อีเมลของคุณ]
                                </a>{" "}
                                โดยระบุหัวข้อว่า <strong>"ขอลบข้อมูลผู้ใช้"</strong>
                            </p>
                            <div className="flex items-start gap-2 text-sm text-blue-700 mt-4 bg-white/50 p-3 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p>ทางเราจะดำเนินการลบข้อมูลของท่านภายใน <strong>30 วัน</strong> นับจากวันที่ได้รับคำร้อง และจะแจ้งผลการดำเนินการกลับทางอีเมล</p>
                            </div>
                        </div>
                    </section>

                    <div className="pt-6 flex justify-center">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/Form/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            กลับสู่หน้าหลัก
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
