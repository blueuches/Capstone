// supabase/functions/fill-pdf/oscaPdfCoords.ts

export interface PdfFieldCoord {
  page: number;
  x: number;
  y: number;
  fontSize?: number;
}

/**
 * For simple text fields where we write the actual string answer.
 * Keys MUST exactly match FormFields.label.
 */
export const TEXT_COORDS: Record<string, PdfFieldCoord> = {
  // 1. Name of Senior Citizen
  "First Name":  { page: 0, x: 162.53, y: 158.29, fontSize: 10 },
  "Middle Name": { page: 0, x: 247.24, y: 159.35, fontSize: 10 },
  "Last Name":   { page: 0, x: 326.12, y: 157.76, fontSize: 10 },

  // 3. Age
  "Age": { page: 0, x: 246.00, y: 183.60, fontSize: 10 },

  // 4. Citizenship
  "Citizenship": { page: 0, x: 357.60, y: 184.80, fontSize: 10 },

  // 6. Date and Place of Birth
  "Date of Birth":  { page: 0, x: 118.80, y: 211.20, fontSize: 10 },
  "Place of Birth": { page: 0, x: 284.40, y: 210.60, fontSize: 10 },

  // 7. Address & Barangay
  "Home Address": { page: 0, x: 178.80, y: 235.20, fontSize: 10 },
  "Barangay":     { page: 0, x: 376.80, y: 235.20, fontSize: 10 },

  // 8. Applicant's contact details
  "Landline": { page: 0, x: 223.80, y: 248.40, fontSize: 10 },
  "Mobile No": { page: 0, x: 392.40, y: 248.40, fontSize: 10 },

  // 9. Educational Attainment/Occupation/Skills
  "Educational Attainment / Occupation / Skills": {
    page: 0,
    x: 249.60,
    y: 261.60,
    fontSize: 10,
  },

  // 11. Relative/Non-Relative Name & Contact
  "Relative/Non-Relative Name & Contact": {
    page: 0,
    x: 409.20,
    y: 315.60, // for Living with Relatives; you can change if you want
    fontSize: 10,
  },

  // 12. State Disability (text to the right of B checkbox)
  "State Disability": { page: 0, x: 449.40, y: 342.60, fontSize: 10 },

  // 13. Pensioner - "Others" specify
  "Specify Pension (Others)": { page: 0, x: 342.60, y: 355.80, fontSize: 10 },

  // 14. Beneficiary - "Others" specify
  "Specify Beneficiary (Others)": {
    page: 0,
    x: 487.20,
    y: 369.60,
    fontSize: 10,
  },

  // 15. Where and when Issued
  "Where and When Issued": { page: 0, x: 469.20, y: 396.60, fontSize: 10 },

  // 16. Emergency contact (NOTE: your FormFields has a group here)
  // If you later store these as separate answers/labels, use these:
  "Whom to notify in case of emergency": {
    page: 0,
    x: 231.00,
    y: 409.80,
    fontSize: 10,
  },
  "Address": {
    page: 0,
    x: 407.40,
    y: 409.80,
    fontSize: 10,
  },
  "Contact Number": {
    page: 0,
    x: 239.00,
    y: 409.80,
    fontSize: 10,
  },

  // 17. Blood Type
  "Blood Type": { page: 0, x: 117.00, y: 423.00, fontSize: 10 },

  // --- OSCA SECTION ---

  "Place Transferred (Transferee to Butuan From)": {
    page: 0,
    x: 393.60,
    y: 553.80,
    fontSize: 10,
  },

  "Authorized Representative (Full Name)": {
    page: 0,
    x: 246.00,
    y: 566.40,
    fontSize: 10,
  },
  "Representative Contact No.": {
    page: 0,
    x: 442.80,
    y: 566.40,
    fontSize: 10,
  },
  "Representative Address": {
    page: 0,
    x: 237.00,
    y: 580.80,
    fontSize: 10,
  },

  "Date Issued (old record)": {
    page: 0,
    x: 294.00,
    y: 594.60,
    fontSize: 10,
  },

  "OSCA ID Number": { page: 0, x: 156.00, y: 647.40, fontSize: 10 },
  "Issued On (Date)": { page: 0, x: 420.00, y: 646.80, fontSize: 10 },

  "Received By": { page: 0, x: 114.00, y: 672.00, fontSize: 10 },
  "Verified By": { page: 0, x: 112.20, y: 709.20, fontSize: 10 },
  "Date Accomplished": { page: 0, x: 465.00, y: 709.20, fontSize: 10 },

  "Remarks": { page: 0, x: 60.60, y: 761.40, fontSize: 10 },
};

/**
 * For radio/checkbox fields where each option has its own box.
 * Outer key = FormFields.label
 * Inner key = option string (from FormFields.options)
 * We draw a "✓" at those coordinates.
 */
export const OPTION_COORDS: Record<string, Record<string, PdfFieldCoord>> = {
  // 2. Gender
  Gender: {
    Male:   { page: 0, x: 100.40, y: 185.60, fontSize: 10 },
    Female: { page: 0, x: 143.60, y: 186.00, fontSize: 10 },
  },

  // 5. Civil Status
  "Civil Status": {
    Single:    { page: 0, x: 119.40, y: 197.40, fontSize: 10 },
    Married:   { page: 0, x: 177.00, y: 197.40, fontSize: 10 },
    Widowed:   { page: 0, x: 247.20, y: 196.80, fontSize: 10 },
    Separated: { page: 0, x: 319.20, y: 196.20, fontSize: 10 },
  },

  // 10. PhilHealth Membership
  "PhilHealth Membership": {
    Member: {
      page: 0,
      x: 175.80,
      y: 276.00,
      fontSize: 10,
    },
    "Non-Member": {
      page: 0,
      x: 261.00,
      y: 276.60,
      fontSize: 10,
    },
    "Dependent of PhilHealth Member": {
      page: 0,
      x: 356.40,
      y: 277.20,
      fontSize: 10,
    },
  },

  // 11. Living Arrangements
  "Living Arrangements": {
    "Living Alone": {
      page: 0,
      x: 67.20,
      y: 300.60,
      fontSize: 10,
    },
    "Living with Relatives/Children": {
      page: 0,
      x: 67.80,
      y: 315.00,
      fontSize: 10,
    },
    "Living with Non-Relatives": {
      page: 0,
      x: 68.40,
      y: 328.80,
      fontSize: 10,
    },
  },

  // 12. Health Condition
  "Health Condition": {
    Healthy: {
      page: 0,
      x: 145.20,
      y: 342.60,
      fontSize: 10,
    },
    "Sickly/Frail": {
      page: 0,
      x: 198.60,
      y: 343.80,
      fontSize: 10,
    },
    "Bedridden/Disabled": {
      page: 0,
      x: 270.00,
      y: 344.40,
      fontSize: 10,
    },
  },

  // 13. Pensioner
  Pensioner: {
    Yes:    { page: 0, x: 116.40, y: 355.20, fontSize: 10 },
    No:     { page: 0, x: 155.40, y: 355.20, fontSize: 10 },
    SSS:    { page: 0, x: 186.00, y: 357.00, fontSize: 10 },
    GSIS:   { page: 0, x: 216.60, y: 357.00, fontSize: 10 },
    PVAO:   { page: 0, x: 250.80, y: 356.40, fontSize: 10 },
    Others: { page: 0, x: 342.60, y: 355.80, fontSize: 10 },
  },

  // 14. Beneficiary
  Beneficiary: {
    Pantawid: {
      page: 0,
      x: 120.60,
      y: 369.00,
      fontSize: 10,
    },
    "Non-Pantawid": {
      page: 0,
      x: 186.00,
      y: 369.60,
      fontSize: 10,
    },
    "Social Pension Beneficiary": {
      page: 0,
      x: 276.00,
      y: 369.00,
      fontSize: 10,
    },
    SSS: {
      page: 0,
      x: 121.80,
      y: 382.80,
      fontSize: 10,
    },
    GSIS: {
      page: 0,
      x: 187.20,
      y: 384.00,
      fontSize: 10,
    },
    Military: {
      page: 0,
      x: 276.00,
      y: 382.20,
      fontSize: 10,
    },
    Others: {
      page: 0,
      x: 487.20,
      y: 369.60,
      fontSize: 10,
    },
  },

  // 15. Have you been issued an OSCA ID Card before?
  "Have you been issued an OSCA ID Card before?": {
    Yes: { page: 0, x: 281.40, y: 397.80, fontSize: 10 },
    No:  { page: 0, x: 317.40, y: 397.20, fontSize: 10 },
  },

  // --- OSCA SECTION ---

  // 66. Check ID
  "Check ID": {
    "New ID": {
      page: 0,
      x: 57.00,
      y: 539.40,
      fontSize: 10,
    },
    "Replacement of Lost ID": {
      page: 0,
      x: 57.60,
      y: 553.80,
      fontSize: 10,
    },
    "Barangay Certification": {
      page: 0,
      x: 222.60,
      y: 540.00,
      fontSize: 10,
    },
    "Old ID surrendered/attached": {
      page: 0,
      x: 222.00,
      y: 553.20,
      fontSize: 10,
    },
    "Affidavit of Loss": {
      page: 0,
      x: 392.40,
      y: 539.40,
      fontSize: 10,
    },
  },

  // 71. Old Record Attached (radio)
  "Old Record Attached": {
    Yes: { page: 0, x: 165.60, y: 593.40, fontSize: 10 },
    // If you want to mark "No", add it here when you know the coord
  },

  // 73. No Record Found (radio)
  "No Record Found": {
    Yes: { page: 0, x: 468.60, y: 593.40, fontSize: 10 },
  },

  // 74. Proof of Birth (checkbox)
  "Proof of Birth": {
    "Birth Certificate": {
      page: 0,
      x: 57.60,
      y: 620.40,
      fontSize: 10,
    },
    "Government-issued Photo ID": {
      page: 0,
      x: 57.00,
      y: 633.60,
      fontSize: 10,
    },
    "Marriage Certificate": {
      page: 0,
      x: 378.00,
      y: 621.00,
      fontSize: 10,
    },
    Others: {
      page: 0,
      x: 397.20,
      y: 634.20,
      fontSize: 10,
    },
    // "Attached" & "Specify" don't have separate FormFields labels,
    // so they'll likely be handwritten or from a future field.
  },
};
