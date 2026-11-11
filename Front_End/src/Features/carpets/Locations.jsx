import { useEffect, useState } from "react";
import { Search, MapPin, Plus, Pencil, Trash2 } from "lucide-react";
import {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation as deleteLocationAPI
} from "../services/locations/locationService";

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "warehouse",
    address: ""
  });

  const language = localStorage.getItem("language") || "en";
  const rtl = language !== "en";

  const labels = {
    en: {
      title: "Location Management",
      total: "Total Locations",
      add: "Add Location",
      edit: "Edit Location",
      search: "Search locations...",
      name: "Location Name",
      description: "Description",
      type: "Location Type",
      address: "Address",
      status: "Status",
      actions: "Actions",
      warehouse: "Warehouse",
      showroom: "Showroom",
      shelf: "Shelf",
      other: "Other",
      active: "Active",
      inactive: "Inactive",
      save: "Save",
      cancel: "Cancel",
      notFound: "No locations found",
      error: "Something went wrong!",
      deleteConfirm: "Are you sure you want to delete this location?"
    },

    fa: {
      title: "مدیریت موقعیت‌ها",
      total: "مجموع موقعیت‌ها",
      add: "افزودن موقعیت",
      edit: "ویرایش موقعیت",
      search: "جستجوی موقعیت‌ها...",
      name: "نام موقعیت",
      description: "توضیحات",
      type: "نوع موقعیت",
      address: "آدرس",
      status: "وضعیت",
      actions: "عملیات",
      warehouse: "گدام",
      showroom: "نمایشگاه",
      shelf: "قفسه",
      other: "سایر",
      active: "فعال",
      inactive: "غیرفعال",
      save: "ذخیره",
      cancel: "لغو",
      notFound: "موقعیتی پیدا نشد",
      error: "مشکلی رخ داده است!",
      deleteConfirm: "آیا مطمئن هستید که این موقعیت حذف شود؟"
    },

    ps: {
      title: "د ځایونو مدیریت",
      total: "ټول ځایونه",
      add: "نوی ځای اضافه کړئ",
      edit: "ځای سمول",
      search: "د ځایونو لټون...",
      name: "د ځای نوم",
      description: "تشریح",
      type: "د ځای ډول",
      address: "پته",
      status: "حالت",
      actions: "عملیات",
      warehouse: "ګودام",
      showroom: "نندارتون",
      shelf: "المارۍ",
      other: "نور",
      active: "فعال",
      inactive: "غیرفعال",
      save: "ثبت",
      cancel: "لغوه",
      notFound: "هیڅ ځای ونه موندل شو",
      error: "یوه ستونزه رامنځته شوه!",
      deleteConfirm: "ایا ډاډه یاست چې دا ځای حذف کړئ؟"
    }
  };

  const t = labels[language] || labels.en;

  // Load Locations
  const loadLocations = async () => {
    try {
      setLoading(true);
      const data = await getLocations();
      setLocations(data);
    } catch (error) {
      console.error("Load Locations Error:", error);
      alert(t.error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLocations();
  }, []);

  // Filter Locations
  const filtered = locations.filter(item =>
    `${item.name} ${item.description || ""} ${item.type} ${item.address || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Open Add Form
  const openAdd = () => {
    setEditing(null);
    setForm({
      name: "",
      description: "",
      type: "warehouse",
      address: ""
    });
    setShowForm(true);
  };

  // Open Edit Form
  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name || "",
      description: item.description || "",
      type: item.type || "warehouse",
      address: item.address || ""
    });
    setShowForm(true);
  };

  // Save Location
  const saveLocation = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return;

    try {
      setSaving(true);

      if (editing) {
        await updateLocation(editing.id, {
          ...form,
          is_active: editing.is_active
        });
      } else {
        await createLocation({
          ...form,
          is_active: true
        });
      }

      setShowForm(false);
      setEditing(null);
      await loadLocations();
    } catch (error) {
      console.error("Save Location Error:", error);
      alert(error.response?.data?.message || t.error);
    } finally {
      setSaving(false);
    }
  };

  // Delete Location
  const handleDelete = async (id) => {
    if (!window.confirm(t.deleteConfirm)) return;

    try {
      await deleteLocationAPI(id);
      await loadLocations();
    } catch (error) {
      console.error("Delete Location Error:", error);
      alert(error.response?.data?.message || t.error);
    }
  };

  // Location Type Labels
  const getLocationType = (type) => {
    switch (type) {
      case "showroom":
        return t.showroom;
      case "warehouse":
        return t.warehouse;
      case "shelf":
        return t.shelf;
      case "other":
        return t.other;
      default:
        return type;
    }
  };

  return (
    <div dir={rtl ? "rtl" : "ltr"} className="space-y-6">

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            {t.title}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {t.total}: {locations.length}
          </p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-lg"
        >
          <Plus size={17} />
          {t.add}
        </button>
      </div>

      {/* Search and Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">

        <div className="relative mb-4">
          <Search
            className="absolute top-3 left-3 text-slate-400"
            size={18}
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.search}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent py-2.5 pl-10 pr-3 outline-none focus:border-teal-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm text-start">

            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500">
              <tr>
                {[t.name, t.description, t.type, t.address, t.status, t.actions].map((label) => (
                  <th key={label} className="p-3 text-start font-semibold">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Loading...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map(function (item) {
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 dark:border-slate-800"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          {item.name}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        {item.description || "-"}
                      </td>

                      <td className="px-4 py-3">
                        {getLocationType(item.type)}
                      </td>

                      <td className="px-4 py-3">
                        {item.address || "-"}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs ${
                            item.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {item.is_active ? t.active : t.inactive}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(item)}
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500">
                    {t.notFound}
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={saveLocation}
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl p-5 space-y-4"
          >
            <h2 className="text-lg font-bold">
              {editing ? t.edit : t.add}
            </h2>

            <div>
              <label className="block text-sm mb-1">{t.name}</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">{t.description}</label>
              <input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">{t.type}</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
              >
                <option value="showroom">{t.showroom}</option>
                <option value="warehouse">{t.warehouse}</option>
                <option value="shelf">{t.shelf}</option>
                <option value="other">{t.other}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">{t.address}</label>
              <input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800"
              >
                {t.cancel}
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-teal-600 text-white disabled:opacity-60"
              >
                {saving ? "..." : t.save}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default Locations;