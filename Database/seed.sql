-- Carpet Management System sample data
-- Run schema.sql first, then run this file.
-- Five sample rows are inserted into each of the 28 tables.
-- Sample password hashes are placeholders; replace them with real hashes before use.

BEGIN;

INSERT INTO roles (id,name,description,is_system) VALUES
(1,'Owner','Full access',TRUE),(2,'Manager','Manage daily operations',TRUE),
(3,'Seller','Sales and invoices',FALSE),(4,'Storekeeper','Inventory management',FALSE),
(5,'Accountant','Payments and expenses',FALSE);

INSERT INTO permissions (id,code,description) VALUES
(1,'carpets.read','View carpets'),(2,'carpets.manage','Add and edit carpets'),
(3,'sales.manage','Create and manage sales'),(4,'purchases.manage','Manage purchases'),
(5,'reports.read','View reports');

INSERT INTO currencies (id,code,name,symbol,is_base,is_active) VALUES
(1,'AFN','Afghan Afghani','؋',TRUE,TRUE),(2,'USD','US Dollar','$',FALSE,TRUE),
(3,'EUR','Euro','€',FALSE,TRUE),(4,'IRR','Iranian Rial','﷼',FALSE,TRUE),
(5,'PKR','Pakistani Rupee','Rs',FALSE,TRUE);

INSERT INTO employees (id,first_name,last_name,phone,email,job_title,salary,hire_date,status,shift_start,shift_end) VALUES
(1,'Ahmad','Mohammadi','0700000001','ahmad@example.com','Manager',18000,'2025-01-10','hired','08:00','17:00'),
(2,'Ali','Ahmadi','0700000002','ali@example.com','Seller',12000,'2025-02-01','hired','08:00','17:00'),
(3,'Farid','Hosseini','0700000003','farid@example.com','Storekeeper',13000,'2025-03-12','hired','08:00','17:00'),
(4,'Hamid','Rahimi','0700000004','hamid@example.com','Accountant',16000,'2025-04-05','hired','08:00','16:00'),
(5,'Karim','Noori','0700000005','karim@example.com','Assistant',9000,'2025-05-20','hired','09:00','17:00');

INSERT INTO suppliers (id,first_name,last_name,company_name,phone,email,address,description,is_active) VALUES
(1,'Sami','Ahmadi','Herat Carpet Supply','0790000001','sami@example.com','Herat, Afghanistan','Local carpet supplier',TRUE),
(2,'Reza','Karimi','Mashhad Rugs','0790000002','reza@example.com','Mashhad, Iran','Iranian carpet supplier',TRUE),
(3,'Omar','Khan','Khan Trading','0790000003','omar@example.com','Peshawar, Pakistan','Wholesale supplier',TRUE),
(4,'Latif','Hosseini','Balkh Handmade','0790000004','latif@example.com','Mazar, Afghanistan','Handmade carpets',TRUE),
(5,'Nabi','Noori','Noori Textiles','0790000005','nabi@example.com','Kabul, Afghanistan','Machine-made carpets',TRUE);

INSERT INTO customers (id,first_name,last_name,phone,email,address,customer_type,credit_limit,notes,is_active) VALUES
(1,'Mahmood','Azizi','0780000001','mahmood@example.com','Herat','retail',5000,'Regular customer',TRUE),
(2,'Zahra','Ahmadi','0780000002','zahra@example.com','Herat','retail',3000,'',TRUE),
(3,'Bashir','Sediqi','0780000003','bashir@example.com','Kabul','wholesale',50000,'Wholesale buyer',TRUE),
(4,'Jamal','Noori','0780000004','jamal@example.com','Ghor','retail',2000,'',TRUE),
(5,'Nasir','Rahmani','0780000005','nasir@example.com','Farah','wholesale',30000,'Repeat buyer',TRUE);

INSERT INTO locations (id,name,type,address,description,is_active) VALUES
(1,'Main Showroom','showroom','Herat city','Front display area',TRUE),
(2,'Main Warehouse','warehouse','Herat industrial area','Main storage',TRUE),
(3,'Shelf A','shelf','Main showroom','Display shelf A',TRUE),
(4,'Shelf B','shelf','Main showroom','Display shelf B',TRUE),
(5,'Secondary Store','other','Herat','Additional storage',TRUE);

INSERT INTO carpet_categories (id,name,description) VALUES
(1,'Afghan','Traditional Afghan carpets'),(2,'Persian','Persian carpets'),
(3,'Turkish','Turkish carpets'),(4,'Machine Made','Factory-produced carpets'),
(5,'Modern','Modern design carpets');

INSERT INTO expense_categories (id,name,description) VALUES
(1,'Rent','Shop and warehouse rent'),(2,'Transport','Carpet transportation'),
(3,'Salary','Employee salaries'),(4,'Utilities','Electricity and water'),
(5,'Repair','Shop and equipment repairs');

INSERT INTO users (id,employee_id,role_id,username,password_hash,is_active) VALUES
(1,1,1,'owner','REPLACE_WITH_REAL_HASH_1',TRUE),
(2,2,3,'seller1','REPLACE_WITH_REAL_HASH_2',TRUE),
(3,3,4,'storekeeper','REPLACE_WITH_REAL_HASH_3',TRUE),
(4,4,5,'accountant','REPLACE_WITH_REAL_HASH_4',TRUE),
(5,5,3,'seller2','REPLACE_WITH_REAL_HASH_5',TRUE);

INSERT INTO shop_settings (id,shop_name,phone,address,invoice_prefix,invoice_footer,tax_rate,base_currency_id) VALUES
(1,'Mohammadi Carpet Shop','0400000001','Herat, Afghanistan','INV-','Thank you for your purchase',0,1),
(2,'Mohammadi Carpet Shop - Branch 2','0400000002','Herat','INV2-','Thank you',0,1),
(3,'Mohammadi Carpet Shop - Store','0400000003','Herat','STR-','',0,1),
(4,'Mohammadi Carpet Shop - Demo 1','0400000004','Herat','D1-','',0,1),
(5,'Mohammadi Carpet Shop - Demo 2','0400000005','Herat','D2-','',0,1);

INSERT INTO role_permissions (role_id,permission_id) VALUES
(1,1),(1,2),(1,3),(2,4),(3,3);

INSERT INTO exchange_rates (id,currency_id,rate_to_base,rate_date,created_by) VALUES
(1,2,70.000000,'2026-10-01',1),(2,3,76.000000,'2026-10-01',1),
(3,4,0.001400,'2026-10-01',1),(4,5,0.250000,'2026-10-01',1),
(5,2,70.500000,'2026-10-10',1);

INSERT INTO carpets (id,code,barcode,name,category_id,country_of_origin,width_cm,length_cm,material,type,weight_kg,color,design,condition,currency_id,purchase_price,sale_price,is_active) VALUES
(1,'CRP-001','890000000001','Herat Handmade 3x4',1,'Afghanistan',300,400,'Wool','handmade',18,'Red','Traditional','new',1,35000,42000,TRUE),
(2,'CRP-002','890000000002','Persian Floral 2x3',2,'Iran',200,300,'Wool and silk','handmade',12,'Blue','Floral','new',1,28000,34000,TRUE),
(3,'CRP-003','890000000003','Turkish Modern 2x3',3,'Turkey',200,300,'Synthetic','machine_made',8,'Grey','Modern','new',1,9000,12500,TRUE),
(4,'CRP-004','890000000004','Afghan Used 3x4',1,'Afghanistan',300,400,'Wool','handmade',17,'Brown','Geometric','used',1,18000,24000,TRUE),
(5,'CRP-005','890000000005','Machine Carpet 1.5x2',4,'Iran',150,200,'Polypropylene','machine_made',4,'Cream','Plain','new',1,4000,6000,TRUE);

INSERT INTO purchases (id,supplier_id,employee_id,purchase_date,purchase_place,currency_id,exchange_rate,total_amount,payment_status,status,notes,created_by) VALUES
(1,1,1,'2026-09-01','Herat',1,1,35000,'paid','active','First purchase',1),
(2,2,1,'2026-09-03','Mashhad',2,70,28000,'partial','active','Imported carpets',1),
(3,3,3,'2026-09-05','Peshawar',1,1,9000,'unpaid','active','Wholesale order',1),
(4,4,1,'2026-09-08','Mazar',1,1,18000,'paid','active','Used carpet lot',1),
(5,5,3,'2026-09-10','Kabul',1,1,4000,'paid','active','Machine-made stock',1);

INSERT INTO purchase_details (id,purchase_id,carpet_id,location_id,quantity,purchase_price) VALUES
(1,1,1,2,1,35000),(2,2,2,2,1,28000),(3,3,3,2,1,9000),
(4,4,4,5,1,18000),(5,5,5,2,1,4000);

INSERT INTO purchase_payments (id,purchase_id,payment_date,payment_method,amount,currency_id,exchange_rate,notes,created_by) VALUES
(1,1,'2026-09-01 10:00','cash',35000,1,1,'Paid in full',1),
(2,2,'2026-09-03 11:00','bank_transfer',200,2,70,'Part payment',1),
(3,3,'2026-09-05 12:00','cash',0,1,1,'Not paid yet',1),
(4,4,'2026-09-08 09:30','card',18000,1,1,'Paid in full',1),
(5,5,'2026-09-10 14:00','cash',4000,1,1,'Paid in full',1);

INSERT INTO sales (id,customer_id,employee_id,sale_date,currency_id,exchange_rate,discount,tax_amount,total_amount,payment_status,status,due_date,notes,created_by) VALUES
(1,1,2,'2026-10-01 10:00',1,1,0,0,42000,'paid','active',NULL,'Cash sale',2),
(2,2,2,'2026-10-02 11:00',1,1,1000,0,33000,'partial','active','2026-10-20','Partly on credit',2),
(3,3,5,'2026-10-03 12:00',1,1,500,0,12000,'unpaid','active','2026-10-25','Wholesale sale',5),
(4,4,5,'2026-10-04 13:00',1,1,0,0,24000,'paid','active',NULL,'Paid in full',5),
(5,5,2,'2026-10-05 15:00',1,1,0,0,6000,'partial','active','2026-10-18','Balance due',2);
 
INSERT INTO sales_details (id,sale_id,carpet_id,location_id,quantity,sale_price,discount) VALUES
(1,1,1,1,1,42000,0),(2,2,2,1,1,34000,1000),(3,3,3,3,1,12500,500),
(4,4,4,5,1,24000,0),(5,5,5,4,1,6000,0);

INSERT INTO payments (id,sale_id,received_by,payment_date,payment_method,payment_type,amount,currency_id,exchange_rate_to_sale,amount_in_sale_currency) VALUES
(1,1,2,'2026-10-01 10:10','cash','full_payment',42000,1,1,42000),
(2,2,2,'2026-10-02 11:10','cash','deposit',15000,1,1,15000),
(3,3,5,'2026-10-03 12:10','bank_transfer','deposit',5000,1,1,5000),
(4,4,5,'2026-10-04 13:10','card','full_payment',24000,1,1,24000),
(5,5,2,'2026-10-05 15:10','cash','deposit',3000,1,1,3000);

INSERT INTO invoices (id,sale_id,invoice_number,invoice_date,currency_id,tax_amount,total_amount) VALUES
(1,1,'INV-0001','2026-10-01 10:05',1,0,42000),
(2,2,'INV-0002','2026-10-02 11:05',1,0,33000),
(3,3,'INV-0003','2026-10-03 12:05',1,0,12000),
(4,4,'INV-0004','2026-10-04 13:05',1,0,24000),
(5,5,'INV-0005','2026-10-05 15:05',1,0,6000);

INSERT INTO sale_returns (id,sale_id,return_date,reason,refund_amount,processed_by) VALUES
(1,1,'2026-10-06 09:00','Wrong color selected',2000,1),
(2,2,'2026-10-07 09:30','Customer changed mind',1000,1),
(3,3,'2026-10-08 10:00','Minor defect',500,1),
(4,4,'2026-10-09 11:00','Size issue',1500,1),
(5,5,'2026-10-10 12:00','Exchange requested',300,1);

INSERT INTO sale_return_details (id,return_id,sales_detail_id,location_id,quantity,refund_price) VALUES
(1,1,1,1,1,2000),(2,2,2,1,1,1000),(3,3,3,3,1,500),
(4,4,4,5,1,1500),(5,5,5,4,1,300);

INSERT INTO expenses (id,category_id,expense_date,amount,currency_id,exchange_rate,description,created_by) VALUES
(1,1,'2026-10-01',12000,1,1,'Monthly shop rent',1),
(2,2,'2026-10-02',2500,1,1,'Carpet transport',1),
(3,3,'2026-10-03',16000,1,1,'Employee salary payment',1),
(4,4,'2026-10-04',900,1,1,'Electricity and water',1),
(5,5,'2026-10-05',700,1,1,'Repair work',1);

INSERT INTO carpet_images (id,carpet_id,image_url,is_primary,sort_order) VALUES
(1,1,'images/carpets/carpet-001-main.jpg',TRUE,1),
(2,2,'images/carpets/carpet-002-main.jpg',TRUE,1),
(3,3,'images/carpets/carpet-003-main.jpg',TRUE,1),
(4,4,'images/carpets/carpet-004-main.jpg',TRUE,1),
(5,5,'images/carpets/carpet-005-main.jpg',TRUE,1);

INSERT INTO inventory (id,carpet_id,location_id,quantity) VALUES
(1,1,2,0),(2,2,2,0),(3,3,2,0),(4,4,5,0),(5,5,2,0);

INSERT INTO stock_movements (id,carpet_id,location_id,movement_type,quantity_change,purchase_detail_id,sale_detail_id,sale_return_detail_id,note,created_by) VALUES
(1,1,2,'purchase',1,1,NULL,NULL,'Carpet received from supplier',1),
(2,2,2,'purchase',1,2,NULL,NULL,'Carpet received from supplier',1),
(3,1,1,'sale',-1,NULL,1,NULL,'Carpet sold',2),
(4,2,1,'sale_return',1,NULL,NULL,2,'Carpet returned by customer',1),
(5,3,3,'adjustment',-1,NULL,NULL,NULL,'Stock count adjustment',1);

INSERT INTO audit_log (id,user_id,action,table_name,record_id,old_data,new_data,ip_address) VALUES
(1,1,'insert','carpets',1,NULL,'{"code":"CRP-001"}','127.0.0.1'),
(2,1,'update','carpets',2,'{"sale_price":33000}','{"sale_price":34000}','127.0.0.1'),
(3,2,'insert','sales',1,NULL,'{"total_amount":42000}','127.0.0.1'),
(4,3,'update','inventory',1,'{"quantity":1}','{"quantity":0}','127.0.0.1'),
(5,1,'delete','customers',5,'{"first_name":"Nasir"}',NULL,'127.0.0.1');

-- Keep SERIAL/BIGSERIAL sequences ready after inserting explicit IDs.
SELECT setval(pg_get_serial_sequence('roles','id'), COALESCE((SELECT MAX(id) FROM roles),1));
SELECT setval(pg_get_serial_sequence('permissions','id'), COALESCE((SELECT MAX(id) FROM permissions),1));
SELECT setval(pg_get_serial_sequence('currencies','id'), COALESCE((SELECT MAX(id) FROM currencies),1));
SELECT setval(pg_get_serial_sequence('employees','id'), COALESCE((SELECT MAX(id) FROM employees),1));
SELECT setval(pg_get_serial_sequence('suppliers','id'), COALESCE((SELECT MAX(id) FROM suppliers),1));
SELECT setval(pg_get_serial_sequence('customers','id'), COALESCE((SELECT MAX(id) FROM customers),1));
SELECT setval(pg_get_serial_sequence('locations','id'), COALESCE((SELECT MAX(id) FROM locations),1));
SELECT setval(pg_get_serial_sequence('carpet_categories','id'), COALESCE((SELECT MAX(id) FROM carpet_categories),1));
SELECT setval(pg_get_serial_sequence('expense_categories','id'), COALESCE((SELECT MAX(id) FROM expense_categories),1));
SELECT setval(pg_get_serial_sequence('users','id'), COALESCE((SELECT MAX(id) FROM users),1));
SELECT setval(pg_get_serial_sequence('shop_settings','id'), COALESCE((SELECT MAX(id) FROM shop_settings),1));
SELECT setval(pg_get_serial_sequence('exchange_rates','id'), COALESCE((SELECT MAX(id) FROM exchange_rates),1));
SELECT setval(pg_get_serial_sequence('carpets','id'), COALESCE((SELECT MAX(id) FROM carpets),1));
SELECT setval(pg_get_serial_sequence('purchases','id'), COALESCE((SELECT MAX(id) FROM purchases),1));
SELECT setval(pg_get_serial_sequence('purchase_details','id'), COALESCE((SELECT MAX(id) FROM purchase_details),1));
SELECT setval(pg_get_serial_sequence('purchase_payments','id'), COALESCE((SELECT MAX(id) FROM purchase_payments),1));
SELECT setval(pg_get_serial_sequence('sales','id'), COALESCE((SELECT MAX(id) FROM sales),1));
SELECT setval(pg_get_serial_sequence('sales_details','id'), COALESCE((SELECT MAX(id) FROM sales_details),1));
SELECT setval(pg_get_serial_sequence('payments','id'), COALESCE((SELECT MAX(id) FROM payments),1));
SELECT setval(pg_get_serial_sequence('invoices','id'), COALESCE((SELECT MAX(id) FROM invoices),1));
SELECT setval(pg_get_serial_sequence('sale_returns','id'), COALESCE((SELECT MAX(id) FROM sale_returns),1));
SELECT setval(pg_get_serial_sequence('sale_return_details','id'), COALESCE((SELECT MAX(id) FROM sale_return_details),1));
SELECT setval(pg_get_serial_sequence('expenses','id'), COALESCE((SELECT MAX(id) FROM expenses),1));
SELECT setval(pg_get_serial_sequence('carpet_images','id'), COALESCE((SELECT MAX(id) FROM carpet_images),1));
SELECT setval(pg_get_serial_sequence('inventory','id'), COALESCE((SELECT MAX(id) FROM inventory),1));
SELECT setval(pg_get_serial_sequence('stock_movements','id'), COALESCE((SELECT MAX(id) FROM stock_movements),1));
SELECT setval(pg_get_serial_sequence('audit_log','id'), COALESCE((SELECT MAX(id) FROM audit_log),1));

COMMIT;
