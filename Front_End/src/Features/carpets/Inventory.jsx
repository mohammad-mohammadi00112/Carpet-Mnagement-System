import { useEffect, useState } from "react";
import { Search, Package, Warehouse, Store } from "lucide-react";
import { getInventory } from "../services/inventory/inventoryService";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const language = localStorage.getItem("language") || "en";
  const rtl = language !== "en";

  const labels = {
    en: {
      title: "Inventory Management",
      search: "Search inventory...",
      total: "Total Items",
      products: "Different Carpets",
      locations: "Locations",
      code: "Carpet Code",
      name: "Carpet Name",
      location: "Location",
      quantity: "Quantity",
      warehouse: "Warehouse",
      shop: "Shop",
      noResults: "No inventory found",
      loading: "Loading inventory...",
      error: "Failed to load inventory"
    },
    fa: {
      title: "مدیریت موجودی",
      search: "جستجوی موجودی...",
      total: "مجموع موجودی",
      products: "تعداد انواع فرش",
      locations: "موقعیت‌ها",
      code: "کد فرش",
      name: "نام فرش",
      location: "محل نگهداری",
      quantity: "تعداد",
      warehouse: "گدام",
      shop: "فروشگاه",
      noResults: "موجودی پیدا نشد",
      loading: "در حال دریافت موجودی...",
      error: "دریافت موجودی ناموفق بود"
    },
    ps: {
      title: "د موجودۍ مدیریت",
      search: "د موجودۍ لټون...",
      total: "ټوله موجودي",
      products: "د غالیو ډولونه",
      locations: "ځایونه",
      code: "د غالۍ کوډ",
      name: "د غالۍ نوم",
      location: "د ساتلو ځای",
      quantity: "شمېر",
      warehouse: "ګودام",
      shop: "هټۍ",
      noResults: "موجودي ونه موندل شوه",
      loading: "موجودي ترلاسه کېږي...",
      error: "د موجودۍ ترلاسه کول ناکام شول"
    }
  };

  const t = labels[language] || labels.en;

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getInventory();
        setInventory(data);
      } catch (err) {
        console.error("Inventory Error:", err);
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const filtered = inventory.filter(item =>
    `${item.code} ${item.name} ${item.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalQuantity = inventory.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  const totalCarpets = new Set(
    inventory.map(item => item.code)
  ).size;

  const totalLocations = new Set(
    inventory.map(item => item.location)
  ).size;

  return (
    <div dir={rtl ? "rtl" : "ltr"} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          {t.title}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Stock overview by carpet and location
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <Package className="text-teal-600 mb-3" size={23} />
          <p className="text-sm text-slate-500">{t.total}</p>
          <h2 className="text-2xl font-bold mt-1">{totalQuantity}</h2>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <Warehouse className="text-blue-500 mb-3" size={23} />
          <p className="text-sm text-slate-500">{t.products}</p>
          <h2 className="text-2xl font-bold mt-1">{totalCarpets}</h2>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <Store className="text-purple-500 mb-3" size={23} />
          <p className="text-sm text-slate-500">{t.locations}</p>
          <h2 className="text-2xl font-bold mt-1">{totalLocations}</h2>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
        <div className="relative mb-4">
          <Search
            className={`absolute top-3 ${
              rtl ? "right-3" : "left-3"
            } text-slate-400`}
            size={18}
          />

          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t.search}
            className={`w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent py-2.5 ${
              rtl ? "pr-10 pl-3" : "pl-10 pr-3"
            } outline-none focus:border-teal-500`}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500">
              <tr>
                {[t.code, t.name, t.location, t.quantity].map(label => (
                  <th
                    key={label}
                    className="p-3 text-start font-semibold"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    {t.loading}
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : (
                <>
                  {filtered.map(item => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 dark:border-slate-800"
                    >
                      <td className="p-3 font-medium">{item.code}</td>
                      <td className="p-3">{item.name}</td>
                      <td className="p-3">{item.location}</td>
                      <td className="p-3">
                        <span className="inline-flex px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 font-semibold">
                          {item.quantity}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-8 text-center text-slate-500"
                      >
                        {t.noResults}
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;