
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./Features/auth/Login";
import Home from "./Features/layout/home/Home";

// Carpet Management
import Carpets from "./Features/carpets/Carpets";
import CarpetCategory from "./Features/carpets/Carpetcategory";
import CarpetDetail from "./Features/carpets/Carpetdetail";
import Locations from "./Features/carpets/Locations";
import Inventory from "./Features/carpets/Inventory";
import StockMovements from "./Features/carpets/Stockmovement";

// Sales Management
import Sale from "./Features/sales/Sale";
import SaleReturn from "./Features/sales/Salereturn";
import ReturnDetail from "./Features/sales/Returndetail";
import Invoice from "./Features/sales/Invoice";
import SaleDetails from "./Features/sales/Saledetail";

// Purchase Management
import Purchases from "./Features/purchases/Purchases";
import PurchaseDetail from "./Features/purchases/Purchasedetails";
import PurchasePayments from "./Features/purchases/Purchasepayments";
import Suppliers from "./Features/purchases/Suppliers";
// Contact Management
import Employee from "./Features/contacts/Employees";
import Customer from "./Features/contacts/Customers";

// Finance part Conponent
import Expenses from "./Features/finance/Expenses";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Dashboard Layout */}
      <Route element={<Home />}>
        <Route path="/dashboard" element={<div>Dashboard</div>} />

        {/* Carpet Management */}
        <Route path="/carpets" element={<Carpets />} />
        <Route path="/carpets/categories" element={<CarpetCategory />} />
        <Route path="/carpets/locations" element={<Locations />} />
        <Route path="/carpets/:id" element={<CarpetDetail />} />

        {/* Inventory */}
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/inventory/movements" element={<StockMovements />} />

        {/* Sales Management */}
        <Route path="/sales" element={<Sale />} />
        <Route path="/sales/details" element={<SaleDetails />} />
        <Route path="/sales/returns" element={<SaleReturn />} />
        <Route path="/sales/returns/details" element={<ReturnDetail />} />
        <Route path="/sales/invoices" element={<Invoice />} />

        {/* Purchase Management */}
        <Route path="/purchases" element={<Purchases />} />
        <Route path="/purchases/details" element={<PurchaseDetail />} />
        <Route path="/purchases/payments" element={<PurchasePayments />} />
        <Route path="/purchases/suppliers" element={<Suppliers />} />
        {/* Contact Management*/}
        <Route path="/employees" element={<Employee />}/>
        <Route path="/customers" element={<Customer />}/>
        {/* Finance part Component*/}
        <Route path="/finance/expenses" element={<Expenses />}/>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
