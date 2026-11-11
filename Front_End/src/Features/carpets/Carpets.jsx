
import { useEffect } from "react";
import {
  getCarpets,
  getCarpetCategories,
  createCarpet,
  updateCarpet,
  deleteCarpet
} from "../services/carpets/carpetService";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Search, Plus, Filter, Eye, Edit, Trash2,
  X, Layers, Package, DollarSign, AlertCircle
} from "lucide-react";


const initialForm = {
  code: "", barcode: "", name: "", category_id: "",
  country_of_origin: "", width_cm: "", length_cm: "",
  material: "", type: "handmade", weight_kg: "",
  color: "", design: "", condition: "new",
  currency_id: "1", purchase_price: "", sale_price: "",
  is_active: true
};

export default function Carpets() {
  const { t, i18n } = useTranslation();
  const rtl = i18n.language !== "en";

  const [carpets, setCarpets] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const loadCarpets = async () => {
      try {
        const [carpetsData, categoriesData] = await Promise.all([
          getCarpets(),
          getCarpetCategories()
        ]);

        setCarpets(
          carpetsData.map((carpet) => ({
            ...carpet,
            category:
              categoriesData.find(
                (category) => category.id === carpet.category_id
              )?.name || "Unknown",
            size: `${carpet.width_cm || 0} × ${carpet.length_cm || 0}`,
          }))
        );
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to load carpets:", error);
      }
    };

    loadCarpets();
  }, []);


  const tr = (key) => t(`carpets.${key}`);

  const filtered = carpets.filter((carpet) => {
    const matchesSearch =
      `${carpet.name} ${carpet.code} ${carpet.category}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      category === "all" || carpet.category === category;

    return matchesSearch && matchesCategory;
  });

  const openAdd = () => {
    setEditing(null);
    setForm(initialForm);
    setShowForm(true);
  };

  const openEdit = (carpet) => {
    setEditing(carpet.id);
    
    setForm({
      ...initialForm,
      ...carpet,
      width_cm: carpet.width_cm || "",
      length_cm: carpet.length_cm || "",
      category_id: carpet.category_id || ""
    });
    setShowForm(true);
  };
  const handleSave = async (e) => {
    e.preventDefault();

    const {
      id, created_at, updated_at, deleted_at, category, size,
      ...formData
    } = form;

    const data = {
      ...formData,
      category_id: Number(formData.category_id),
      width_cm: Number(formData.width_cm),
      length_cm: Number(formData.length_cm),
      weight_kg: Number(formData.weight_kg),
      currency_id: Number(formData.currency_id),
      purchase_price: Number(formData.purchase_price),
      sale_price: Number(formData.sale_price)
    };
    try {
      if (editing) {
        await updateCarpet(editing, data);
      } else {
        await createCarpet(data);
      }

      const carpetsData = await getCarpets();

      setCarpets(
        carpetsData.map(carpet => ({
          ...carpet,
          category: categories.find(
            c => Number(c.id) === Number(carpet.category_id)
          )?.name || "Unknown",
          size: `${carpet.width_cm || 0} × ${carpet.length_cm || 0}`
        }))
      );

      setShowForm(false);
      setForm(initialForm);
      setEditing(null);

    } catch (error) {
     
      console.error("Carpet save error:", error);
      alert(error.response?.data?.message || "Failed to save carpet");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(tr("confirmDelete"))) {
      try {
        await deleteCarpet(id);

        const carpetsData = await getCarpets();

        setCarpets(
          carpetsData.map(carpet => ({
            ...carpet,
            category: categories.find(
              c => Number(c.id) === Number(carpet.category_id)
            )?.name || "Unknown",
            size: `${carpet.width_cm || 0} × ${carpet.length_cm || 0}`
          }))
        );

      } catch (error) {
        console.error("Carpet delete error:", error);
        alert(error.response?.data?.message || "Failed to delete carpet");
      }
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-900";

  const stats = [
    {
      label: tr("totalCarpets"),
      value: carpets.length,
      icon: Package,
      color: "blue"
    },
    {
      label: tr("categories"),
      value: categories.length,
      icon: Layers,
      color: "purple"
    },
    {
      label: tr("activeCarpets"),
      value: carpets.filter(c => c.is_active).length,
      icon: DollarSign,
      color: "green"
    },
    {
      label: tr("usedCarpets"),
      value: carpets.filter(c => c.condition === "used").length,
      icon: AlertCircle,
      color: "orange"
    }
  ];

  return (
    <div dir={rtl ? "rtl" : "ltr"} className="space-y-6 p-3 sm:p-5 lg:p-7 text-gray-800 dark:text-gray-100">

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">{tr("title")}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {tr("subtitle")}
          </p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          {tr("addCarpet")}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colors = {
            blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
            purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400",
            green: "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400",
            orange: "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400"
          };

          return (
            <div key={index} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <h2 className="mt-2 text-2xl font-bold">{stat.value}</h2>
                </div>
                <div className={`rounded-xl p-3 ${colors[stat.color]}`}>
                  <Icon size={23} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">

        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 dark:border-gray-700 md:flex-row md:items-center md:justify-between">
          <h2 className="font-semibold">{tr("carpetList")}</h2>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search className={`absolute top-3 text-gray-400 ${rtl ? "right-3" : "left-3"}`} size={17} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={tr("search")}
                className={`${inputClass} ${rtl ? "pr-10" : "pl-10"}`}
              />
            </div>

            <div className="relative">
              <Filter className={`absolute top-3 text-gray-400 ${rtl ? "right-3" : "left-3"}`} size={17} />
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className={`${inputClass} ${rtl ? "pr-10" : "pl-10"}`}
              >
                <option value="all">{tr("allCategories")}</option>
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-sm">
            <thead className="bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              <tr>
                {["code", "name", "category", "size", "material", "type", "purchasePrice", "salePrice", "condition", "status", "actions"].map(key => (
                  <th key={key} className="whitespace-nowrap px-4 py-4 text-start font-semibold">
                    {tr(key)}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map(carpet => (
                <tr key={carpet.id} className="transition hover:bg-gray-50 dark:hover:bg-gray-800/60">
                  <td className="px-4 py-4 font-medium text-blue-600">{carpet.code}</td>
                  <td className="px-4 py-4 font-medium">{carpet.name}</td>
                  <td className="px-4 py-4">{carpet.category}</td>
                  <td className="px-4 py-4">{carpet.size}</td>
                  <td className="px-4 py-4">{carpet.material}</td>
                  <td className="px-4 py-4">{tr(carpet.type)}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{carpet.purchase_price.toLocaleString()}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{carpet.sale_price.toLocaleString()}</td>
                  <td className="px-4 py-4">{tr(carpet.condition)}</td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${carpet.is_active ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" : "bg-gray-100 text-gray-600"}`}>
                      {carpet.is_active ? tr("active") : tr("inactive")}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSelected(carpet)} title={tr("view")} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30">
                        <Eye size={17} />
                      </button>
                      <button onClick={() => openEdit(carpet)} title={tr("edit")} className="rounded-lg p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30">
                        <Edit size={17} />
                      </button>
                      <button onClick={() => handleDelete(carpet.id)} title={tr("delete")} className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30">
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="11" className="p-10 text-center text-gray-500">
                    {tr("noCarpets")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-200 p-4 text-sm text-gray-500 dark:border-gray-700">
          {tr("showing")} {filtered.length} {tr("of")} {carpets.length}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl dark:bg-gray-900 sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editing ? tr("editCarpet") : tr("addCarpet")}
              </h2>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              {[
                ["code", "code"],
                ["barcode", "barcode"],
                ["name", "name"],
                ["country_of_origin", "country"],
                ["width_cm", "width"],
                ["length_cm", "length"],
                ["material", "material"],
                ["weight_kg", "weight"],
                ["color", "color"],
                ["design", "design"],
                ["purchase_price", "purchasePrice"],
                ["sale_price", "salePrice"]
              ].map(([field, label]) => (
                <div key={field}>
                  <label className="mb-1.5 block text-sm font-medium">{tr(label)}</label>
                  <input
                    required={["code", "name", "purchase_price", "sale_price"].includes(field)}
                    type={["width_cm", "length_cm", "weight_kg", "purchase_price", "sale_price"].includes(field) ? "number" : "text"}
                    step="any"
                    value={form[field]}
                    onChange={e => setForm({ ...form, [field]: e.target.value })}
                    className={inputClass}
                  />
                </div>
              ))}

              {[
                ["category_id", "category", categories.map(c => [c.id, c.name])],
                ["type", "type", [["handmade", tr("handmade")], ["machine_made", tr("machine_made")]]],
                ["condition", "condition", [["new", tr("new")], ["used", tr("used")]]]
              ].map(([field, label, options]) => (
                <div key={field}>
                  <label className="mb-1.5 block text-sm font-medium">{tr(label)}</label>
                  <select
                    value={form[field]}
                    onChange={e => setForm({ ...form, [field]: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">{tr("selectOption")}</option>
                    {options.map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              ))}

              <div>
                <label className="mb-1.5 block text-sm font-medium">{tr("active")}</label>
                <select
                  value={String(form.is_active)}
                  onChange={e => setForm({ ...form, is_active: e.target.value === "true" })}
                  className={inputClass}
                >
                  <option value="true">{tr("active")}</option>
                  <option value="false">{tr("inactive")}</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 sm:col-span-2">
                <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm dark:border-gray-600">
                  {tr("cancel")}
                </button>
                <button type="submit" className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                  {tr("save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">{tr("details")}</h2>
              <button onClick={() => setSelected(null)}><X /></button>
            </div>
            <div className="space-y-3 text-sm">
              {Object.entries({
                code: selected.code,
                name: selected.name,
                category: selected.category,
                size: selected.size,
                material: selected.material,
                purchasePrice: selected.purchase_price.toLocaleString(),
                salePrice: selected.sale_price.toLocaleString()
              }).map(([key, value]) => (
                <div key={key} className="flex justify-between gap-4 border-b border-gray-100 pb-2 dark:border-gray-800">
                  <span className="text-gray-500">{tr(key)}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
