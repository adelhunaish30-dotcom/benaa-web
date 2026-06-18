import React, { useState, useEffect } from 'react';
import {
  Users, FileText, CheckCircle, XCircle, AlertTriangle,
  Search, Shield, ShieldAlert, DollarSign, ArrowUpRight,
  Settings, RefreshCw, BarChart2, Briefcase, Plus, Trash2, Edit2
} from 'lucide-react';

interface Consultant {
  id: string; // متوافق مع varchar(50) في الـ SQL
  name: string;
  title_ar: string;
  title_en: string;
  email: string | null;
  phone: string | null;
  status: string;
  avatar_url: string | null;
}

interface Project {
  id: number; // متوافق مع INT NOT NULL AUTO_INCREMENT
  user_id: string;
  title: string;
  description: string;
  status: string;
  consultants_id: string | null; // المفتاح الأجنبي المربوط
}

interface Receipt {
  id: number; // متوافق مع اسم الحقل الفعلي في الـ SQL لجدول payment_receipts
  order_id: string;
  amount_paid: number;
  payment_method: string;
  payment_status: 'pending' | 'approved' | 'rejected'; // الحقل المضاف بالتصحيح
  receipt_image: string | null;
  created_at: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'consultants' | 'projects' | 'payments' | 'settings'>('overview');
  const [actionAlert, setActionAlert] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [activeTab]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // المسار المحدث بناءً على مجلد مشروعك الفعلي my-pro/benaa-api
      if (activeTab === 'consultants') {
        const res = await fetch('http://localhost:8013/my-pro/benaa-api/get_consultants.php');
        const data = await res.json();
        if (Array.isArray(data)) setConsultants(data);
        else if (data.success) setConsultants(data.consultants);
      }
      if (activeTab === 'projects') {
        const res = await fetch('http://localhost:8013/my-pro/benaa-api/get_projects.php');
        const data = await res.json();
        if (Array.isArray(data)) setProjects(data);
        else if (data.success) setProjects(data.projects);
      }
      if (activeTab === 'payments') {
        const res = await fetch('http://localhost:8013/my-pro/benaa-api/get_receipts.php');
        const data = await res.json();
        if (Array.isArray(data)) setReceipts(data);
        else if (data.success) setReceipts(data.receipts);
      }
    } catch (error) {
      console.error("خطأ في جلب البيانات:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateConsultantStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch('http://localhost:8013/my-pro/benaa-api/update_consultant.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      const data = await response.json();
      if (data.status === 'success' || data.success) {
        setConsultants(consultants.map(c => c.id === id ? { ...c, status: newStatus } : c));
        setActionAlert({ type: 'success', text: "تم تحديث حالة الحساب بنجاح في قاعدة البيانات." });
      }
    } catch (err) {
      setActionAlert({ type: 'error', text: 'خطأ في الاتصال بالخادم' });
    }
  };

  const handleAssignConsultant = async (projectId: number, consultantId: string) => {
    try {
      const response = await fetch('http://localhost/my-pro/benaa-api/assign_consultant.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId, consultants_id: consultantId })
      });
      const data = await response.json();
      if (data.success) {
        setProjects(projects.map(p => p.id === projectId ? { ...p, consultants_id: consultantId } : p));
        setActionAlert({ type: 'success', text: 'تم ربط وإسناد المشروع للمستشار بنجاح تامة.' });
      } else {
        setActionAlert({ type: 'error', text: data.message });
      }
    } catch (err) {
      setActionAlert({ type: 'error', text: 'خطأ في معالجة طلب الربط.' });
    }
  };

  const handleUpdatePaymentStatus = async (receiptId: number, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch('http://localhost/my-pro/benaa-api/update_receipt_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receipt_id: receiptId, payment_status: status })
      });
      const data = await response.json();
      if (data.success) {
        setReceipts(receipts.map(r => r.id === receiptId ? { ...r, payment_status: status } : r));
        setActionAlert({ type: 'success', text: 'تم تحديث حالة اعتماد السند المالي بنجاح.' });
      }
    } catch (err) {
      setActionAlert({ type: 'error', text: 'خطأ في تحديث السند.' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans" dir="rtl">
      <aside className="fixed inset-y-0 right-0 w-64 bg-slate-950 border-l border-slate-800 z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-amber-500" />
            <span className="font-bold text-lg tracking-wider bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">بناء | لوحة التحكم</span>
          </div>
        </div>
        <nav className="p-4 space-y-1">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'}`}>
            <BarChart2 className="h-4 w-4" /> نظرة عامة
          </button>
          <button onClick={() => setActiveTab('consultants')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'consultants' ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'}`}>
            <Users className="h-4 w-4" /> المستشارين والاستشاريين
          </button>
          <button onClick={() => setActiveTab('projects')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'projects' ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'}`}>
            <Briefcase className="h-4 w-4" /> إدارة المشاريع
          </button>
          <button onClick={() => setActiveTab('payments')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'payments' ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'}`}>
            <DollarSign className="h-4 w-4" /> الدفع والسندات الماليّة
          </button>
        </nav>
      </aside>

      <main className="pr-64 min-h-screen pb-12">
        <header className="h-16 bg-slate-950/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-10 flex items-center justify-between px-8">
          <h1 className="font-bold text-xl">لوحة التحكم والنظام المركزي للبيانات</h1>
        </header>

        <div className="p-8">
          {actionAlert && (
            <div className={`mb-6 p-4 rounded-xl flex items-center justify-between border ${actionAlert.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
              <p className="text-sm font-medium">{actionAlert.text}</p>
              <button onClick={() => setActionAlert(null)} className="text-xs underline">إغلاق</button>
            </div>
          )}

          {loading && <div className="text-amber-500 font-bold mb-4">جاري تحميل وتحديث البيانات الحية...</div>}

          {activeTab === 'consultants' && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-slate-800 text-slate-400 text-xs font-semibold">
                    <th className="p-4">المستشار</th>
                    <th className="p-4">المسمى الوظيفي (عربي)</th>
                    <th className="p-4">البريد الإلكتروني</th>
                    <th className="p-4">الحالة</th>
                    <th className="p-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {consultants.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-900/40">
                      <td className="p-4 font-medium text-slate-200">{c.name}</td>
                      <td className="p-4 text-slate-400">{c.title_ar}</td>
                      <td className="p-4 font-mono text-xs text-slate-400">{c.email || 'لا يوجد'}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/10 text-emerald-400">{c.status}</span>
                      </td>
                      <td className="p-4 text-center">
                        <button onClick={() => handleUpdateConsultantStatus(c.id, 'active')} className="px-2 py-1 bg-emerald-600 text-white rounded text-xs ml-2">تفعيل</button>
                        <button onClick={() => handleUpdateConsultantStatus(c.id, 'suspended')} className="px-2 py-1 bg-rose-600/20 text-rose-400 rounded text-xs">تعليق</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-slate-800 text-slate-400 text-xs font-semibold">
                    <th className="p-4">عنوان المشروع</th>
                    <th className="p-4">المستشار المسؤول حالياً</th>
                    <th className="p-4">حالة التنفيذ</th>
                    <th className="p-4 text-center">تعيين / تغيير المستشار المتابع</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-slate-900/40">
                      <td className="p-4 font-bold text-amber-400">{project.title}</td>
                      <td className="p-4 text-slate-300">{project.consultants_id ? `مستشار معرف: ${project.consultants_id}` : 'لم يربط بمستشار بعد'}</td>
                      <td className="p-4"><span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs">{project.status}</span></td>
                      <td className="p-4 text-center">
                        <select
                          onChange={(e) => handleAssignConsultant(project.id, e.target.value)}
                          defaultValue=""
                          className="bg-slate-900 border border-slate-700 text-xs rounded p-1 text-slate-200"
                        >
                          <option value="" disabled>اختر مستشاراً لربطه بالمشروع...</option>
                          {consultants.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-slate-800 text-slate-400 text-xs font-semibold">
                    <th className="p-4">رقم السند</th>
                    <th className="p-4">رقم الطلب (Order ID)</th>
                    <th className="p-4">المبلغ</th>
                    <th className="p-4">طريقة الدفع</th>
                    <th className="p-4">الحالة الفردية</th>
                    <th className="p-4 text-center">الاعتماد</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {receipts.map((receipt) => (
                    <tr key={receipt.id} className="hover:bg-slate-900/40">
                      <td className="p-4 font-mono text-slate-300">#{receipt.id}</td>
                      <td className="p-4 font-mono text-slate-400">#{receipt.order_id}</td>
                      <td className="p-4 text-emerald-400 font-bold">{receipt.amount_paid} YER</td>
                      <td className="p-4 text-slate-400">{receipt.payment_method}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-xs ${receipt.payment_status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                          {receipt.payment_status}
                        </span>
                      </td>
                      <td className="p-4 flex gap-2 justify-center">
                        <button onClick={() => handleUpdatePaymentStatus(receipt.id, 'approved')} className="px-2 py-1 bg-emerald-600 text-white rounded text-xs">قبول واعتِماد</button>
                        <button onClick={() => handleUpdatePaymentStatus(receipt.id, 'rejected')} className="px-2 py-1 bg-rose-600/20 text-rose-400 rounded text-xs">رفض السند</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}