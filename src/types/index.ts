// ISO 4217 Currency Codes - All major and minor world currencies
export type Currency =
  | 'AED' | 'AFN' | 'ALL' | 'AMD' | 'ANG' | 'AOA' | 'ARS' | 'AUD' | 'AWG' | 'AZN'
  | 'BAM' | 'BBD' | 'BDT' | 'BGN' | 'BHD' | 'BIF' | 'BMD' | 'BND' | 'BOB' | 'BRL' | 'BSD' | 'BTN' | 'BWP' | 'BZD'
  | 'CAD' | 'CDF' | 'CHE' | 'CHF' | 'CHW' | 'CLF' | 'CLP' | 'CNY' | 'COP' | 'COU' | 'CRC' | 'CUC' | 'CUP' | 'CVE' | 'CZK'
  | 'DJF' | 'DKK' | 'DOP' | 'DZD'
  | 'EGP' | 'ERN' | 'ETB' | 'EUR'
  | 'FJD' | 'FKP'
  | 'GBP' | 'GEL' | 'GHS' | 'GIP' | 'GMD' | 'GNF' | 'GTQ' | 'GYD'
  | 'HKD' | 'HNL' | 'HRK' | 'HTG' | 'HUF'
  | 'IDR' | 'ILS' | 'INR' | 'IQD' | 'IRR' | 'ISK'
  | 'JMD' | 'JOD' | 'JPY'
  | 'KES' | 'KGS' | 'KHR' | 'KMF' | 'KPW' | 'KRW' | 'KWD' | 'KYD' | 'KZT'
  | 'LAK' | 'LBP' | 'LKR' | 'LRD' | 'LSL' | 'LYD'
  | 'MAD' | 'MDL' | 'MGA' | 'MKD' | 'MMK' | 'MNT' | 'MOP' | 'MRU' | 'MUR' | 'MVR' | 'MWK' | 'MXN' | 'MXV' | 'MYR' | 'MZN'
  | 'NAD' | 'NGN' | 'NIO' | 'NOK' | 'NPR' | 'NZD'
  | 'OMR'
  | 'PAB' | 'PEN' | 'PGK' | 'PHP' | 'PKR' | 'PLN' | 'PYG'
  | 'QAR'
  | 'RON' | 'RSD' | 'RUB' | 'RWF'
  | 'SAR' | 'SBD' | 'SCR' | 'SDG' | 'SEK' | 'SGD' | 'SHP' | 'SLE' | 'SLL' | 'SOS' | 'SRD' | 'SSP' | 'STN' | 'SYP' | 'SZL'
  | 'THB' | 'TJS' | 'TMT' | 'TND' | 'TOP' | 'TRY' | 'TTD' | 'TWD' | 'TZS'
  | 'UAH' | 'UGX' | 'USD' | 'USN' | 'UYI' | 'UYU' | 'UYW' | 'UZS'
  | 'VED' | 'VES' | 'VND' | 'VUV'
  | 'WST'
  | 'XAF' | 'XAG' | 'XAU' | 'XBA' | 'XBB' | 'XBC' | 'XBD' | 'XCD' | 'XDR' | 'XOF' | 'XPD' | 'XPF' | 'XPT' | 'XSU' | 'XTS' | 'XUA' | 'XXX'
  | 'YER'
  | 'ZAR' | 'ZMW' | 'ZWL'

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  AED: 'د.إ', AFN: '؋', ALL: 'L', AMD: '֏', ANG: 'ƒ', AOA: 'Kz', ARS: '$', AUD: 'A$', AWG: 'ƒ', AZN: '₼',
  BAM: 'KM', BBD: 'Bds$', BDT: '৳', BGN: 'лв', BHD: '.د.ب', BIF: 'FBu', BMD: 'BD$', BND: 'B$', BOB: 'Bs.', BRL: 'R$', BSD: 'B$', BTN: 'Nu.', BWP: 'P', BZD: 'BZ$',
  CAD: 'C$', CDF: 'FC', CHE: '€', CHF: 'CHF', CHW: 'CHF', CLF: 'CLF', CLP: 'CLP$', CNY: '¥', COP: 'Col$', COU: 'COU', CRC: '₡', CUC: '$', CUP: '₱', CVE: '$', CZK: 'Kč',
  DJF: 'Fdj', DKK: 'kr', DOP: 'RD$', DZD: 'د.ج',
  EGP: '£', ERN: 'Nfk', ETB: 'Br', EUR: '€',
  FJD: 'FJ$', FKP: '£',
  GBP: '£', GEL: '₾', GHS: '₵', GIP: '£', GMD: 'D', GNF: 'FG', GTQ: 'Q', GYD: 'GY$',
  HKD: 'HK$', HNL: 'L', HRK: 'kn', HTG: 'G', HUF: 'Ft',
  IDR: 'Rp', ILS: '₪', INR: '₹', IQD: 'ع.د', IRR: '﷼', ISK: 'kr',
  JMD: 'J$', JOD: 'د.ا', JPY: '¥',
  KES: 'KSh', KGS: 'с', KHR: '៛', KMF: 'CF', KPW: '₩', KRW: '₩', KWD: 'د.ك', KYD: '$', KZT: '₸',
  LAK: '₭', LBP: '£', LKR: 'Rs', LRD: 'L$', LSL: 'L', LYD: 'ل.د',
  MAD: 'د.م.', MDL: 'MDL', MGA: 'Ar', MKD: 'ден', MMK: 'Ks', MNT: '₮', MOP: 'P', MRU: 'UM', MUR: '₨', MVR: 'Rf', MWK: 'MK', MXN: '$', MXV: 'MXV', MYR: 'RM', MZN: 'MT',
  NAD: '$', NGN: '₦', NIO: 'C$', NOK: 'kr', NPR: '₨', NZD: 'NZ$',
  OMR: 'ر.ع.',
  PAB: 'B/.', PEN: 'S/', PGK: 'K', PHP: '₱', PKR: '₨', PLN: 'zł', PYG: '₲',
  QAR: 'ر.ق',
  RON: 'lei', RSD: 'дин', RUB: '₽', RWF: 'FRw',
  SAR: 'ر.س', SBD: 'Si$', SCR: '₨', SDG: 'ج.س', SEK: 'kr', SGD: 'S$', SHP: '£', SLE: 'Le', SLL: 'Le', SOS: 'Sh', SRD: '$', SSP: '£', STN: 'Db', SYP: '£', SZL: 'L',
  THB: '฿', TJS: 'ЅМ', TMT: 'm', TND: 'د.ت', TOP: 'T$', TRY: '₺', TTD: 'TT$', TWD: 'NT$', TZS: 'TSh',
  UAH: '₴', UGX: 'USh', USD: '$', USN: '$', UYI: 'UYI', UYU: '$U', UYW: '$U', UZS: 'so\'m',
  VED: 'Bs.F', VES: 'Bs.S', VND: '₫', VUV: 'VT',
  WST: 'T',
  XAF: 'FCFA', XAG: 'XAG', XAU: 'XAU', XBA: 'XBA', XBB: 'XBB', XBC: 'XBC', XBD: 'XBD', XCD: 'EC$', XDR: 'SDR', XOF: 'CFA', XPD: 'XPD', XPF: '₣', XPT: 'XPT', XSU: 'XSU', XTS: 'XTS', XUA: 'XUA', XXX: 'XXX',
  YER: '﷼',
  ZAR: 'R', ZMW: 'ZK', ZWL: 'Z$'
}

export const CURRENCY_LABELS: Record<Currency, string> = {
  AED: 'United Arab Emirates Dirham (AED)', AFN: 'Afghan Afghani (AFN)', ALL: 'Albanian Lek (ALL)', AMD: 'Armenian Dram (AMD)', ANG: 'Netherlands Antillean Guilder (ANG)', AOA: 'Angolan Kwanza (AOA)', ARS: 'Argentine Peso (ARS)', AUD: 'Australian Dollar (AUD)', AWG: 'Aruban Florin (AWG)', AZN: 'Azerbaijani Manat (AZN)',
  BAM: 'Bosnia and Herzegovina Convertible Mark (BAM)', BBD: 'Barbadian Dollar (BBD)', BDT: 'Bangladeshi Taka (BDT)', BGN: 'Bulgarian Lev (BGN)', BHD: 'Bahraini Dinar (BHD)', BIF: 'Burundian Franc (BIF)', BMD: 'Bermudian Dollar (BMD)', BND: 'Brunei Dollar (BND)', BOB: 'Bolivian Boliviano (BOB)', BRL: 'Brazilian Real (BRL)', BSD: 'Bahamian Dollar (BSD)', BTN: 'Bhutanese Ngultrum (BTN)', BWP: 'Botswanan Pula (BWP)', BZD: 'Belize Dollar (BZD)',
  CAD: 'Canadian Dollar (CAD)', CDF: 'Congolese Franc (CDF)', CHE: 'WIR Euro (CHE)', CHF: 'Swiss Franc (CHF)', CHW: 'WIR Franc (CHW)', CLF: 'Chilean Unit of Account (CLF)', CLP: 'Chilean Peso (CLP)', CNY: 'Chinese Yuan (CNY)', COP: 'Colombian Peso (COP)', COU: 'Colombian Real Value Unit (COU)', CRC: 'Costa Rican Colón (CRC)', CUC: 'Cuban Convertible Peso (CUC)', CUP: 'Cuban Peso (CUP)', CVE: 'Cape Verdean Escudo (CVE)', CZK: 'Czech Koruna (CZK)',
  DJF: 'Djiboutian Franc (DJF)', DKK: 'Danish Krone (DKK)', DOP: 'Dominican Peso (DOP)', DZD: 'Algerian Dinar (DZD)',
  EGP: 'Egyptian Pound (EGP)', ERN: 'Eritrean Nakfa (ERN)', ETB: 'Ethiopian Birr (ETB)', EUR: 'Euro (EUR)',
  FJD: 'Fijian Dollar (FJD)', FKP: 'Falkland Islands Pound (FKP)',
  GBP: 'British Pound Sterling (GBP)', GEL: 'Georgian Lari (GEL)', GHS: 'Ghanaian Cedi (GHS)', GIP: 'Gibraltar Pound (GIP)', GMD: 'Gambian Dalasi (GMD)', GNF: 'Guinean Franc (GNF)', GTQ: 'Guatemalan Quetzal (GTQ)', GYD: 'Guyanaese Dollar (GYD)',
  HKD: 'Hong Kong Dollar (HKD)', HNL: 'Honduran Lempira (HNL)', HRK: 'Croatian Kuna (HRK)', HTG: 'Haitian Gourde (HTG)', HUF: 'Hungarian Forint (HUF)',
  IDR: 'Indonesian Rupiah (IDR)', ILS: 'Israeli New Shekel (ILS)', INR: 'Indian Rupee (INR)', IQD: 'Iraqi Dinar (IQD)', IRR: 'Iranian Rial (IRR)', ISK: 'Icelandic Króna (ISK)',
  JMD: 'Jamaican Dollar (JMD)', JOD: 'Jordanian Dinar (JOD)', JPY: 'Japanese Yen (JPY)',
  KES: 'Kenyan Shilling (KES)', KGS: 'Kyrgystani Som (KGS)', KHR: 'Cambodian Riel (KHR)', KMF: 'Comorian Franc (KMF)', KPW: 'North Korean Won (KPW)', KRW: 'South Korean Won (KRW)', KWD: 'Kuwaiti Dinar (KWD)', KYD: 'Cayman Islands Dollar (KYD)', KZT: 'Kazakhstani Tenge (KZT)',
  LAK: 'Laotian Kip (LAK)', LBP: 'Lebanese Pound (LBP)', LKR: 'Sri Lankan Rupee (LKR)', LRD: 'Liberian Dollar (LRD)', LSL: 'Lesotho Loti (LSL)', LYD: 'Libyan Dinar (LYD)',
  MAD: 'Moroccan Dirham (MAD)', MDL: 'Moldovan Leu (MDL)', MGA: 'Malagasy Ariary (MGA)', MKD: 'Macedonian Denar (MKD)', MMK: 'Myanma Kyat (MMK)', MNT: 'Mongolian Tugrik (MNT)', MOP: 'Macanese Pataca (MOP)', MRU: 'Mauritanian Ouguiya (MRU)', MUR: 'Mauritian Rupee (MUR)', MVR: 'Maldivian Rufiyaa (MVR)', MWK: 'Malawian Kwacha (MWK)', MXN: 'Mexican Peso (MXN)', MXV: 'Mexican Silver Ounce (MXV)', MYR: 'Malaysian Ringgit (MYR)', MZN: 'Mozambican Metical (MZN)',
  NAD: 'Namibian Dollar (NAD)', NGN: 'Nigerian Naira (NGN)', NIO: 'Nicaraguan Córdoba (NIO)', NOK: 'Norwegian Krone (NOK)', NPR: 'Nepalese Rupee (NPR)', NZD: 'New Zealand Dollar (NZD)',
  OMR: 'Omani Rial (OMR)',
  PAB: 'Panamanian Balboa (PAB)', PEN: 'Peruvian Nuevo Sol (PEN)', PGK: 'Papua New Guinean Kina (PGK)', PHP: 'Philippine Peso (PHP)', PKR: 'Pakistani Rupee (PKR)', PLN: 'Polish Zloty (PLN)', PYG: 'Paraguayan Guarani (PYG)',
  QAR: 'Qatari Riyal (QAR)',
  RON: 'Romanian Leu (RON)', RSD: 'Serbian Dinar (RSD)', RUB: 'Russian Ruble (RUB)', RWF: 'Rwandan Franc (RWF)',
  SAR: 'Saudi Riyal (SAR)', SBD: 'Solomon Islands Dollar (SBD)', SCR: 'Seychellois Rupee (SCR)', SDG: 'Sudanese Pound (SDG)', SEK: 'Swedish Krona (SEK)', SGD: 'Singapore Dollar (SGD)', SHP: 'Saint Helena Pound (SHP)', SLE: 'Sierra Leonean Leone (SLE)', SLL: 'Sierra Leonean Leone (SLL)', SOS: 'Somali Shilling (SOS)', SRD: 'Surinamese Dollar (SRD)', SSP: 'South Sudanese Pound (SSP)', STN: 'São Tomé and Príncipe Dobra (STN)', SYP: 'Syrian Pound (SYP)', SZL: 'Swazi Lilangeni (SZL)',
  THB: 'Thai Baht (THB)', TJS: 'Tajikistani Somoni (TJS)', TMT: 'Turkmenistani Manat (TMT)', TND: 'Tunisian Dinar (TND)', TOP: 'Tongan Paʻanga (TOP)', TRY: 'Turkish Lira (TRY)', TTD: 'Trinidad and Tobago Dollar (TTD)', TWD: 'New Taiwan Dollar (TWD)', TZS: 'Tanzanian Shilling (TZS)',
  UAH: 'Ukrainian Hryvnia (UAH)', UGX: 'Ugandan Shilling (UGX)', USD: 'US Dollar (USD)', USN: 'US Dollar (Next day) (USN)', UYI: 'Uruguayan Peso (UYI)', UYU: 'Uruguayan Peso (UYU)', UYW: 'Uruguayan Nominal Wage Index (UYW)', UZS: 'Uzbekistani Som (UZS)',
  VED: 'Venezuelan Bolívar Soberano (VED)', VES: 'Venezuelan Bolívar Soberano (VES)', VND: 'Vietnamese Đồng (VND)', VUV: 'Vanuatu Vatu (VUV)',
  WST: 'Samoan Tala (WST)',
  XAF: 'Central African CFA Franc (XAF)', XAG: 'Silver (XAG)', XAU: 'Gold (XAU)', XBA: 'European Composite Unit (XBA)', XBB: 'European Monetary Unit (XBB)', XBC: 'European Unit of Account 9 (XBC)', XBD: 'European Unit of Account 17 (XBD)', XCD: 'East Caribbean Dollar (XCD)', XDR: 'Special Drawing Right (XDR)', XOF: 'West African CFA Franc (XOF)', XPD: 'Palladium (XPD)', XPF: 'CFP Franc (XPF)', XPT: 'Platinum (XPT)', XSU: 'Sucre (XSU)', XTS: 'Testing Code (XTS)', XUA: 'ADB Unit of Account (XUA)', XXX: 'No Currency (XXX)',
  YER: 'Yemeni Rial (YER)',
  ZAR: 'South African Rand (ZAR)', ZMW: 'Zambian Kwacha (ZMW)', ZWL: 'Zimbabwean Dollar (ZWL)'
}

const NON_COUNTRY_CURRENCY_CODES = new Set<Currency>([
  // Fund, unit-of-account, commodity, testing, supranational, and regional-only codes.
  'CHE', 'CHW', 'CLF', 'COU', 'MXV', 'USN', 'UYI', 'UYW', 'VED',
  'XAF', 'XAG', 'XAU', 'XBA', 'XBB', 'XBC', 'XBD', 'XCD', 'XDR', 'XOF', 'XPD', 'XPF', 'XPT', 'XSU', 'XTS', 'XUA', 'XXX',
  // Not tied to a single country.
  'EUR',
])

export const CURRENCY_OPTIONS = (Object.entries(CURRENCY_LABELS) as [Currency, string][])
  .filter(([code]) => !NON_COUNTRY_CURRENCY_CODES.has(code))
  .sort(([codeA, labelA], [codeB, labelB]) => {
    const countryA = labelA.replace(/\s*\([A-Z]{3}\)$/, '').toLowerCase()
    const countryB = labelB.replace(/\s*\([A-Z]{3}\)$/, '').toLowerCase()
    return countryA.localeCompare(countryB) || codeA.localeCompare(codeB)
  })

export type Plan = 'free' | 'pro'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  currency: Currency
  plan: Plan
  avatar_url: string | null
  created_at: string
}

export interface IncomeEntry {
  id: string
  user_id: string
  month: string
  name: string
  payday: string | null
  expected: number
  actual: number
  start_day: string | null
  created_at: string
}

export interface BillEntry {
  id: string
  user_id: string
  month: string
  name: string
  due_day: string | null
  budget: number
  actual: number
  created_at: string
}

export interface ExpenseEntry {
  id: string
  user_id: string
  month: string
  name: string
  budget: number
  actual: number
  created_at: string
}

export interface SavingEntry {
  id: string
  user_id: string
  month: string
  name: string
  budget: number
  actual: number
  created_at: string
}

export interface DebtEntry {
  id: string
  user_id: string
  month: string
  name: string
  budget: number
  actual: number
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  month: string
  date: string
  amount: number
  category: string
  description: string | null
  created_at: string
}

export type BudgetSection = 'bills' | 'expenses' | 'savings' | 'debt'
