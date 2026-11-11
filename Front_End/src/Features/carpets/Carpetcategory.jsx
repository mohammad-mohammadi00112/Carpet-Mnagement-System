

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Search, Plus, Edit, Trash2, X, Layers, Tag
} from "lucide-react";
import {
  getCarpetCategories,
  createCarpetCategory,
  updateCarpetCategory,
  deleteCarpetCategory
} from "../services/carpets/carpetService";

export default function CarpetCategory() {
  const { t, i18n } = useTranslation();
  const rtl = i18n.language !== "en";

  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCarpetCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    loadCategories();
  }, []);

  const tr = (key) => t(`categories.${key}`);

  const filtered = categories.filter(category =>
    `${category.name} ${category.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", description: "" });
    setShowForm(true);
  };

  const openEdit = (category) => {
    setEditing(category.id);
    setForm({
      name: category.name,
      description: category.description
    });
    setShowForm(true);
  };
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      if (editing) {
        await updateCarpetCategory(editing, form);
      } else {
        await createCarpetCategory(form);
      }

      const data = await getCarpetCategories();
      setCategories(data);

      setShowForm(false);
      setForm({ name: "", description: "" });
      setEditing(null);
    } catch (error) {
      console.log("CATEGORY SAVE ERROR:", error.response?.data);
      console.error(error);
      alert("Failed to save category. Please try again.");
    }
  };
  const handleDelete = async (id) => {


    if (window.confirm(tr("confirmDelete"))) {
      try {
        await deleteCarpetCategory(id);

        const data = await getCarpetCategories();
        setCategories(data);
      } catch (error) {
        console.log("CATEGORY DELETE ERROR:", error.response?.data);
        console.error(error);
        alert("Failed to delete category. Please try again.");
      }
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-900";

  return (
   
    <div dir={rtl ? "rtl" : "ltr"} className="space-y-6 p-3 text-gray-800 dark:text-gray-100 sm:p-5 lg:p-7">
       
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">{tr("title")}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {tr("subtitle")}
          </p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          {tr("addCategory")}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{tr("totalCategories")}</p>
              <h2 className="mt-2 text-2xl font-bold">{categories.length}</h2>
            </div>
            <div className="rounded-xl bg-purple-100 p-3 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400">
              <Layers size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{tr("registeredCategories")}</p>
              <h2 className="mt-2 text-2xl font-bold">{categories.length}</h2>
            </div>
            <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
              <Tag size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">

        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-semibold">{tr("categoryList")}</h2>

          <div className="relative w-full sm:max-w-xs">
            <Search className={`absolute top-3 text-gray-400 ${rtl ? "right-3" : "left-3"}`} size={17} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={tr("search")}
              className={`${inputClass} ${rtl ? "pr-10" : "pl-10"}`}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead className="bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              <tr>
                {["id", "name", "description", "actions"].map(key => (
                  <th key={key} className="px-5 py-4 text-start font-semibold">
                    {tr(key)}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map(category => (
                <tr key={category.id} className="transition hover:bg-gray-50 dark:hover:bg-gray-800/60">
                  <td className="px-5 py-4 text-gray-500">{category.id}</td>
                  <td className="px-5 py-4 font-semibold">{category.name}</td>
                  <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{category.description}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(category)} title={tr("edit")} className="rounded-lg p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30">
                        <Edit size={17} />
                      </button>
                      <button onClick={() => handleDelete(category.id)} title={tr("delete")} className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30">
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-gray-500">
                    {tr("noCategories")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-200 p-4 text-sm text-gray-500 dark:border-gray-700">
          {tr("showing")} {filtered.length} {tr("of")} {categories.length}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editing ? tr("editCategory") : tr("addCategory")}
              </h2>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4" >

              <div>
                <label className="mb-1.5 block text-sm font-medium">{tr("name")}</label>
                <input
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                  placeholder={tr("namePlaceholder")}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">{tr("description")}</label>
                <textarea
                  rows="4"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className={inputClass}
                  placeholder={tr("descriptionPlaceholder")}
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm dark:border-gray-600"
                >
                  {tr("cancel")}
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {tr("save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
