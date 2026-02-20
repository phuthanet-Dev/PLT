import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "นโยบายความเป็นส่วนตัว | PalangTas",
    description: "นโยบายความเป็นส่วนตัว (Privacy Policy) สำหรับผู้ใช้งานแพลตฟอร์ม PalangTas",
};

export default function PrivacyPolicyPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
                <div className="mb-10 border-b pb-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        นโยบายความเป็นส่วนตัว (Privacy Policy)
                    </h1>
                    <p className="text-gray-500">ปรับปรุงล่าสุดเมื่อ: {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                <div className="space-y-8 text-gray-700 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">1. บทนำ</h2>
                        <p>
                            ยินดีต้อนรับสู่ <strong>PalangTas (พลังทาส)</strong> เราให้ความสำคัญอย่างยิ่งกับการคุ้มครองข้อมูลส่วนบุคคลของท่าน
                            นโยบายความเป็นส่วนตัวนี้จัดทำขึ้นเพื่อแจ้งให้ท่านทราบถึงวิธีการที่เรารวบรวม ใช้ เปิดเผย และปกป้องข้อมูลส่วนบุคคลของท่าน
                            เมื่อท่านใช้งานเว็บไซต์และบริการของเรา
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">2. ข้อมูลที่เรารวบรวม</h2>
                        <p className="mb-3">เมื่อท่านสมัครสมาชิกผ่านระบบของเรา (เช่น การใช้อีเมล, Google หรือ Facebook) เราจะเก็บรวบรวมข้อมูลดังต่อไปนี้:</p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600">
                            <li><strong>ข้อมูลโปรไฟล์พื้นฐาน:</strong> ชื่อ-นามสกุล, รูปโปรไฟล์ ที่ได้จากการสมัครสมาชิกหรือดึงจากบัญชีโซเชียลมีเดียที่ท่านเชื่อมต่อ</li>
                            <li><strong>ช่องทางการติดต่อ:</strong> ที่อยู่อีเมล หรือ เบอร์โทรศัพท์ (หากท่านระบุ)</li>
                            <li><strong>ข้อมูลการใช้งาน:</strong> ประวัติการลงประกาศหาบ้านให้สัตว์เลี้ยง ข้อมูลสัตว์เลี้ยงที่ท่านสนใจ หรือการติดต่อต่างๆ ภายในแพลตฟอร์ม</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">3. วัตถุประสงค์ในการเก็บรวบรวมข้อมูล</h2>
                        <p className="mb-3">เราจะนำข้อมูลของท่านไปใช้เพื่อวัตถุประสงค์ดังต่อไปนี้:</p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600">
                            <li>เพื่อสร้างและจัดการบัญชีผู้ใช้งานของท่าน</li>
                            <li>เพื่อยืนยันตัวตนและป้องกันการสแปม หรือการใช้งานที่ไม่เหมาะสมบนแพลตฟอร์ม</li>
                            <li>เพื่อให้ผู้ใช้งานท่านอื่นสามารถติดต่อท่านได้ในกรณีที่มีการขอรับเลี้ยงสัตว์ หรือเกี่ยวข้องกับประกาศของท่าน</li>
                            <li>เพื่อปรับปรุงบริการและประสบการณ์การใช้งานเว็บไซต์ของเราให้ดียิ่งขึ้น</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">4. การเปิดเผยข้อมูล</h2>
                        <p>
                            เราจะไม่นำข้อมูลส่วนบุคคลของท่านไปขาย แลกเปลี่ยน หรือส่งต่อให้บุคคลภายนอกเด็ดขาด เว้นแต่ในกรณีที่จำเป็นเพื่อการให้บริการบนแพลตฟอร์ม
                            (เช่น การแสดงชื่อและช่องทางติดต่อในประกาศหาบ้านให้สัตว์เลี้ยงของท่าน) หรือเมื่อได้รับความยินยอมจากท่าน
                            หรือเมื่อมีความจำเป็นต้องปฏิบัติตามกฎหมาย
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">5. สิทธิของเจ้าของข้อมูล (การขอลบข้อมูล)</h2>
                        <p className="mb-3">ท่านมีสิทธิในการเข้าถึง แก้ไข หรือขอลบข้อมูลส่วนบุคคลของท่านออกจากระบบของเราได้ตลอดเวลา</p>
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-5 mt-4">
                            <h3 className="font-semibold text-blue-900 mb-2">หากท่านต้องการลบข้อมูลบัญชี:</h3>
                            <p className="text-blue-800 text-sm mb-3">
                                ท่านสามารถดำเนินการลบข้อมูลที่เชื่อมต่อกับระบบของเรา หรือยกเลิกการเชื่อมต่อผ่านบัญชี Facebook ได้ด้วยตนเอง
                            </p>
                            <Link
                                href="/deletion-instructions"
                                className="inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-900 underline underline-offset-4"
                            >
                                ดูขั้นตอนการขอลบข้อมูลผู้ใช้ (Data Deletion Instructions) &rarr;
                            </Link>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">6. การรักษาความปลอดภัยของข้อมูล</h2>
                        <p>
                            เราใช้มาตรการทางเทคนิคและการจัดการที่เหมาะสมเพื่อปกป้องข้อมูลส่วนบุคคลของท่านจากการเข้าถึง
                            การใช้งาน หรือการเปิดเผยที่ไม่ได้รับอนุญาต ข้อมูลรหัสผ่านของท่านจะถูกเข้ารหัสและเก็บรักษาอย่างปลอดภัยผ่านระบบมาตรฐานระดับสากล
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">7. การอัปเดตนโยบายความเป็นส่วนตัว</h2>
                        <p>
                            เราอาจปรับปรุงหรือแก้ไขนโยบายความเป็นส่วนตัวนี้เป็นครั้งคราวเพื่อความเหมาะสม
                            เราจะแจ้งให้ท่านทราบถึงการเปลี่ยนแปลงที่สำคัญผ่านทางหน้าเว็บไซต์นี้
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">8. ติดต่อเรา</h2>
                        <p>
                            หากท่านมีคำถาม ข้อเสนอแนะ หรือข้อกังวลใดๆ เกี่ยวกับนโยบายความเป็นส่วนตัวนี้ หรือต้องการใช้สิทธิที่เกี่ยวข้องกับข้อมูลส่วนบุคคลของท่าน
                            โปรดติดต่อเราได้ที่:
                        </p>
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg inline-block">
                            <p className="font-medium text-gray-900">อีเมลติดต่อ: <a href="mailto:support@example.com" className="text-primary hover:underline font-normal">support@example.com</a></p>
                        </div>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t flex justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        กลับสู่หน้าหลัก
                    </Link>
                </div>
            </div>
        </div>
    );
}
