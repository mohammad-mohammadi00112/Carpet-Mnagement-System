

import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Ruler, Weight, Tag, MapPin } from "lucide-react";

const carpets = [
  {
    id: 1,
    code: "CRP-001",
    name: "Herat Handmade 3x4",
    category: "Afghan",
    country: "Afghanistan",
    width: 300,
    length: 400,
    material: "Wool",
    type: "Handmade",
    weight: 18,
    color: "Red",
    design: "Traditional",
    condition: "New",
    purchasePrice: 35000,
    salePrice: 42000,
    status: "Active"
  },
  {
    id: 2,
    code: "CRP-002",
    name: "Persian Floral 2x3",
    category: "Persian",
    country: "Iran",
    width: 200,
    length: 300,
    material: "Wool and silk",
    type: "Handmade",
    weight: 12,
    color: "Blue",
    design: "Floral",
    condition: "New",
    purchasePrice: 28000,
    salePrice: 34000,
    status: "Active"
  },
  {
    id: 3,
    code: "CRP-003",
    name: "Turkish Modern 2x3",
    category: "Turkish",
    country: "Turkey",
    width: 200,
    length: 300,
    material: "Synthetic",
    type: "Machine Made",
    weight: 8,
    color: "Grey",
    design: "Modern",
    condition: "New",
    purchasePrice: 9000,
    salePrice: 12500,
    status: "Active"
  }
];

const CarpetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const language = localStorage.getItem("language") || "en";
  const rtl = language !== "en";

  const labels = {
    en: {
      title: "Carpet Details", back: "Back to Carpets",
      code: "Carpet Code", name: "Name", category: "Category",
      country: "Country", width: "Width", length: "Length",
      material: "Material", type: "Type", weight: "Weight",
      color: "Color", design: "Design", condition: "Condition",
      purchase: "Purchase Price", sale: "Sale Price",
      status: "Status", new: "New", active: "Active",
      notFound: "Carpet not found"
    },
    fa: {
      title: "جزئیات فرش", back: "بازگشت به فرش‌ها",
      code: "کد فرش", name: "نام", category: "دسته‌بندی",
      country: "کشور سازنده", width: "عرض", length: "طول",
      material: "جنس", type: "نوع فرش", weight: "وزن",
      color: "رنگ", design: "طرح", condition: "وضعیت",
      purchase: "قیمت خرید", sale: "قیمت فروش",
      status: "حالت", new: "نو", active: "فعال",
      notFound: "فرش پیدا نشد"
    },
    ps: {
      title: "د غالۍ جزئیات", back: "بېرته غالیو ته",
      code: "د غالۍ کوډ", name: "نوم", category: "کټګوري",
      country: "د جوړېدو هېواد", width: "پلنوالی", length: "اوږدوالی",
      material: "جنس", type: "د غالۍ ډول", weight: "وزن",
      color: "رنګ", design: "ډیزاین", condition: "حالت",
      purchase: "د پېرود بیه", sale: "د پلور بیه",
      status: "وضعیت", new: "نوې", active: "فعاله",
      notFound: "غالۍ ونه موندل شوه"
    }
  };

  const t = labels[language] || labels.en;
  const carpet = carpets.find(item => item.id === Number(id));

  if (!carpet) {
    return <div className="p-6 text-center">{t.notFound}</div>;
  }

  const fields = [
    [t.code, carpet.code],
    [t.name, carpet.name],
    [t.category, carpet.category],
    [t.country, carpet.country],
    [t.width, `${carpet.width} cm`],
    [t.length, `${carpet.length} cm`],
    [t.material, carpet.material],
    [t.type, carpet.type],
    [t.weight, `${carpet.weight} kg`],
    [t.color, carpet.color],
    [t.design, carpet.design],
    [t.condition, carpet.condition],
    [t.purchase, `${carpet.purchasePrice.toLocaleString()} AFN`],
    [t.sale, `${carpet.salePrice.toLocaleString()} AFN`],
    [t.status, carpet.status]
  ];

  return (
    <div dir={rtl ? "rtl" : "ltr"} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            {t.title}
          </h1>
          <p className="text-sm text-slate-500 mt-1">{carpet.name}</p>
        </div>

        <button
          onClick={() => navigate("/carpets")}
          className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
        >
          <ArrowLeft size={17} />
          {t.back}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <Tag className="text-teal-600 mb-3" size={22} />
          <p className="text-sm text-slate-500">{t.code}</p>
          <h3 className="font-bold mt-1">{carpet.code}</h3>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <Ruler className="text-blue-500 mb-3" size={22} />
          <p className="text-sm text-slate-500">{t.width} × {t.length}</p>
          <h3 className="font-bold mt-1">{carpet.width} × {carpet.length} cm</h3>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <Weight className="text-purple-500 mb-3" size={22} />
          <p className="text-sm text-slate-500">{t.weight}</p>
          <h3 className="font-bold mt-1">{carpet.weight} kg</h3>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6">
        <h2 className="font-bold text-lg mb-5">{carpet.name}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {fields.map(([label, value]) => (
            <div key={label} className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <p className="text-xs text-slate-500 mb-1">{label}</p>
              <p className="font-medium text-slate-800 dark:text-slate-100">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarpetDetail;
