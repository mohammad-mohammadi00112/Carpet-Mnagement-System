
const schemas = {
    carpets: {
        required: ['code', 'name'],
        fields: {
            code: 'str', barcode: 'str', name: 'str',
            category_id: 'id', country_of_origin: 'str',
            width_cm: 'num0', length_cm: 'num0',
            material: 'str', type: 'enum:handmade,machine_made',
            weight_kg: 'num0', color: 'str', design: 'str',
            condition: 'enum:new,used,damaged,restored',
            currency_id: 'id', purchase_price: 'num0',
            sale_price: 'num0', is_active: 'bool'
        }
    },
    carpet_categ: {
        required: ['name'],
        fields: { name: 'str', description: 'str' }
    },
    currencies: {
        required: ['code', 'name'],
        fields: {
            code: 'str3', name: 'str', symbol: 'str',
            is_base: 'bool', is_active: 'bool'
        }
    },
    customers: {
        required: ['first_name'],
        fields: {
            first_name: 'str', last_name: 'str', phone: 'str',
            email: 'email', address: 'str',
            customer_type: 'enum:retail,wholesale',
            credit_limit: 'num0', notes: 'str', is_active: 'bool'
        }
    },
    employees: {
        required: ['first_name'],
        fields: {
            first_name: 'str', last_name: 'str', phone: 'str',
            email: 'email', national_id: 'str',
            emergency_phone: 'str', home_address: 'str',
            job_title: 'str', salary: 'num0', hire_date: 'date',
            status: 'enum:hired,fired',
            shift_start: 'time', shift_end: 'time', is_active: 'bool'
        }
    },
    exchange_rates: {
        required: ['currency_id', 'rate_to_base', 'rate_date'],
        fields: {
            currency_id: 'id!', rate_to_base: 'num+',
            rate_date: 'date!', created_by: 'id'
        }
    },
    expense_categories: {
        required: ['name'],
        fields: { name: 'str', description: 'str' }
    },
    expenses: {
        required: ['expense_date', 'amount', 'currency_id'],
        fields: {
            category_id: 'id', expense_date: 'date!',
            amount: 'num+', currency_id: 'id!',
            exchange_rate: 'num+', description: 'str', created_by: 'id'
        }
    },
    invoices: {
        required: ['sale_id', 'invoice_number', 'invoice_date', 'total_amount'],
        fields: {
            sale_id: 'id!', invoice_number: 'str',
            invoice_date: 'datetime!', currency_id: 'id',
            tax_amount: 'num0', total_amount: 'num0!'
        }
    },
    locations: {
        required: ['name', 'type'],
        fields: {
            name: 'str',
            type: 'enum:showroom,warehouse,shelf,other',
            address: 'str', description: 'str', is_active: 'bool'
        }
    },
    payments: {
        required: [
            'sale_id', 'payment_date', 'payment_method',
            'payment_type', 'amount', 'exchange_rate_to_sale'
        ],
        fields: {
            sale_id: 'id!', received_by: 'id',
            payment_date: 'datetime!',
            payment_method: 'enum:cash,card,bank_transfer,check',
            payment_type: 'enum:deposit,installment,full_payment,refund',
            amount: 'num+', currency_id: 'id',
            exchange_rate_to_sale: 'num+',
            amount_in_sale_currency: 'num0'
        }
    },
    permissions: {
        required: ['code'],
        fields: { code: 'str', description: 'str' }
    },
    purchases: {
        required: ['purchase_date'],
        fields: {
            supplier_id: 'id', employee_id: 'id',
            purchase_date: 'date!', purchase_place: 'str',
            currency_id: 'id', exchange_rate: 'num+',
            total_amount: 'num0',
            payment_status: 'enum:unpaid,partial,paid',
            status: 'enum:active,cancelled',
            notes: 'str', created_by: 'id'

        }
    },
    purchase_payments: {
        required: ['purchase_id', 'payment_date', 'payment_method', 'amount'],
        fields: {
            purchase_id: 'id!', payment_date: 'datetime!',
            payment_method: 'enum:cash,card,bank_transfer,check',
            amount: 'num+', currency_id: 'id',
            exchange_rate: 'num+', notes: 'str', created_by: 'id'
        }
    },
    purchase_details: {
        required: [
            'purchase_id', 'carpet_id', 'location_id',
            'quantity', 'purchase_price'
        ],
        fields: {
            purchase_id: 'id!', carpet_id: 'id!',
            location_id: 'id!', quantity: 'int+',
            purchase_price: 'num0!'
        }
    },
    roles: {
        required: ['name'],
        fields: { name: 'str', description: 'str', is_system: 'bool' }
    },
    role_permissions: {
        required: ['role_id', 'permission_id'],
        fields: { role_id: 'id!', permission_id: 'id!' }
    },
    sales: {
        required: ['sale_date'],
        fields: {
            customer_id: 'id', employee_id: 'id',
            sale_date: 'datetime!', currency_id: 'id',
            exchange_rate: 'num+', tax_amount: 'num0',
            payment_status: 'enum:unpaid,partial,paid',
            status: 'enum:active,cancelled',
            due_date: 'date', notes: 'str', created_by: 'id'
        }
    },
    sales_details: {
        required: [
            'sale_id', 'carpet_id', 'location_id',
            'quantity', 'sale_price'
        ],
        fields: {
            sale_id: 'id!', carpet_id: 'id!',
            location_id: 'id!', quantity: 'int+',
            sale_price: 'num0!', discount: 'num0'
        }
    },
    sale_returns: {
        required: ['sale_id', 'return_date'],
        fields: {
            sale_id: 'id!', return_date: 'datetime!',
            reason: 'str', refund_amount: 'num0', processed_by: 'id'
        }
    },
    sale_return_details: {
        required: [
            'return_id', 'sales_detail_id', 'location_id',
            'quantity', 'refund_price'
        ],
        fields: {
            return_id: 'id!', sales_detail_id: 'id!',
            location_id: 'id!', quantity: 'int+',
            refund_price: 'num0!'
        }
    },
    shop_settings: {
        required: [],
        fields: {
            shop_name: 'str', phone: 'str', address: 'str',
            invoice_prefix: 'str', invoice_footer: 'str',
            tax_rate: 'num100', base_currency_id: 'id'
        }
    },
    suppliers: {
        required: ['first_name'],
        fields: {
            first_name: 'str', last_name: 'str',
            company_name: 'str', phone: 'str',
            email: 'email', address: 'str',
            description: 'str', is_active: 'bool'
        }
    },
    users: {
        required: ['username', 'password_hash'],
        fields: {
            employee_id: 'id', role_id: 'id',
            username: 'str', password_hash: 'str', is_active: 'bool'
        }
    },
    login: {
        required: ['username', 'password'],
        fields: { username: 'str', password: 'str' }
    }
}

const validateValue = (value, rule) => {
    if (value === null) return !rule.endsWith('!')
    if (value === undefined) return false
    if (typeof value === 'boolean' && ['id', 'id!', 'int+', 'num0', 'num0!', 'num100', 'num+'].includes(rule)) return false
    if (rule.startsWith('enum:')) {
        return rule.slice(5).split(',').includes(value)
    }

    if (rule === 'str' || rule === 'str3') {
        return typeof value === 'string' &&
            (rule !== 'str3' || (value.length > 0 && value.length <= 3))
    }

    if (rule === 'email') {
        return typeof value === 'string' &&
            (value === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    }

    if (rule === 'bool') return typeof value === 'boolean'

    if (rule === 'id' || rule === 'id!') {
        return Number.isInteger(Number(value)) && Number(value) > 0
    }

    if (rule === 'int+') {
        return Number.isInteger(Number(value)) && Number(value) > 0
    }

    if (rule === 'num0' || rule === 'num0!') {
        return value !== '' &&
            Number.isFinite(Number(value)) && Number(value) >= 0
    }
    if (rule === 'num100') {
        return value !== '' &&
            Number.isFinite(Number(value)) &&
            Number(value) >= 0 && Number(value) <= 100
    }

    if (rule === 'num+') {
        return value !== '' &&
            Number.isFinite(Number(value)) && Number(value) > 0
    }

    if (rule === 'date' || rule === 'date!') {
        if (typeof value !== 'string' ||
            !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false

        const parsed = new Date(`${value}T00:00:00.000Z`)

        return !Number.isNaN(parsed.getTime()) &&
            parsed.toISOString().slice(0, 10) === value
    }

    if (rule === 'datetime!') {
        return typeof value === 'string' &&
            !Number.isNaN(Date.parse(value))
    }

    if (rule === 'time') {
        return typeof value === 'string' &&
            /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(value)
    }

    return true
}

const validateRequest = (req, res, next) => {
    const method = req.method
    const segments = req.path.split('/').filter(Boolean)

    if (['GET', 'PUT', 'PATCH', 'DELETE'].includes(method) &&
        segments.length > 1) {

        const lastSegment = segments[segments.length - 1]

        if (!/^[1-9]\d*$/.test(lastSegment)) {
            return res.status(400).json({
                message: 'ID must be a positive integer.'
            })
        }
    }

    if (!['POST', 'PUT', 'PATCH'].includes(method)) return next()

    const resource = segments[0]
    const schema = schemas[resource]

    if (!schema) return next()

    const body = req.body

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return res.status(400).json({
            message: 'Request body must be a JSON object.'
        })
    }

    const entries = Object.entries(body)

    if (!entries.length) {
        return res.status(400).json({
            message: 'Request body cannot be empty.'
        })
    }

    const invalidFields = entries
        .filter(([key]) =>
            !Object.prototype.hasOwnProperty.call(schema.fields, key)
        )
        .map(([key]) => key)

    if (invalidFields.length) {
        return res.status(400).json({
            message: 'Invalid field(s).',
            fields: invalidFields
        })
    }

    const missingFields = schema.required.filter(key =>
        method !== 'PATCH' &&
        (body[key] === undefined || body[key] === null || body[key] === '')
    )

    const emptyRequiredFields = schema.required.filter(key =>
        method === 'PATCH' &&
        Object.prototype.hasOwnProperty.call(body, key) &&
        (body[key] === undefined || body[key] === null || body[key] === '')
    )

    if (missingFields.length || emptyRequiredFields.length) {
        return res.status(400).json({
            message: method === 'PATCH'
                ? 'Required fields cannot be empty.'
                : 'Required field(s) missing.',
            fields: [...missingFields, ...emptyRequiredFields]
        })
    }

    const invalidValues = entries
        .filter(([key, value]) =>
            !validateValue(value, schema.fields[key])
        )
        .map(([key]) => key)

    if (invalidValues.length) {
        return res.status(400).json({
            message: 'Invalid value(s).',
            fields: invalidValues
        })
    }

    next()
}

module.exports = validateRequest