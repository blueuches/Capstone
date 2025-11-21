// supabase/functions/fill-pdf/oscaPdfCoords.ts

export interface PdfFieldCoord {
  page: number;
  x: number;
  y: number;
  fontSize?: number;
}

/**
 * OSCA_PDF_COORDS
 *
 * Keys here should match the "field_key" (or whatever you use) when you
 * build your answer map in index.ts (e.g., "first_name", "gender_male", etc.).
 *
 * All coordinates are in points, page index is 0-based.
 */
export const OSCA_PDF_COORDS: Record<string, PdfFieldCoord> = {
  // 1. Name of Senior Citizen
  first_name: { page: 0, x: 162.53, y: 158.29, fontSize: 10 },
  middle_name: { page: 0, x: 247.24, y: 159.35, fontSize: 10 },
  last_name: { page: 0, x: 326.12, y: 157.76, fontSize: 10 },

  // 2. Gender
  gender_male: { page: 0, x: 100.40, y: 185.60, fontSize: 10 },
  gender_female: { page: 0, x: 143.60, y: 186.00, fontSize: 10 },

  // 3. Age
  age: { page: 0, x: 246.00, y: 183.60, fontSize: 10 },

  // 4. Citizenship
  citizenship: { page: 0, x: 357.60, y: 184.80, fontSize: 10 },

  // 5. Civil Status
  civil_single: { page: 0, x: 119.40, y: 197.40, fontSize: 10 },
  civil_married: { page: 0, x: 177.00, y: 197.40, fontSize: 10 },
  civil_widowed: { page: 0, x: 247.20, y: 196.80, fontSize: 10 },
  civil_separated: { page: 0, x: 319.20, y: 196.20, fontSize: 10 },

  // 6. Date and Place of Birth
  date_of_birth: { page: 0, x: 118.80, y: 211.20, fontSize: 10 },
  place_of_birth: { page: 0, x: 284.40, y: 210.60, fontSize: 10 },

  // 7. Applicant’s Home Address & Barangay
  home_address: { page: 0, x: 178.80, y: 235.20, fontSize: 10 }, // A.H.D.
  home_barangay: { page: 0, x: 376.80, y: 235.20, fontSize: 10 },

  // 8. Contact Details
  contact_landline: { page: 0, x: 223.80, y: 248.40, fontSize: 10 }, // ACD.L
  contact_mobile: { page: 0, x: 392.40, y: 248.40, fontSize: 10 }, // M.#

  // 9. Educational Attainment / Occupation / Skills
  educ_occupation_skills: { page: 0, x: 249.60, y: 261.60, fontSize: 10 }, // ED/O/S

  // 10. Philhealth Membership
  philhealth_member: { page: 0, x: 175.80, y: 276.00, fontSize: 10 }, // M
  philhealth_non_member: { page: 0, x: 261.00, y: 276.60, fontSize: 10 }, // N/M
  philhealth_dependent: { page: 0, x: 356.40, y: 277.20, fontSize: 10 }, // DPM

  // 11. Living Arrangements
  living_alone: { page: 0, x: 67.20, y: 300.60, fontSize: 10 }, // L/A

  // Living with Relatives/Children
  living_with_relatives: { page: 0, x: 67.80, y: 315.00, fontSize: 10 }, // checkbox
  living_with_relatives_contact: {
    page: 0,
    x: 409.20,
    y: 315.60,
    fontSize: 10,
  }, // name & contact #

  // Living with Non-Relatives
  living_with_non_relatives: { page: 0, x: 68.40, y: 328.80, fontSize: 10 }, // checkbox
  living_with_non_relatives_contact: {
    page: 0,
    x: 369.00,
    y: 328.80,
    fontSize: 10,
  }, // name & contact #

  // 12. Health Condition
  health_healthy: { page: 0, x: 145.20, y: 342.60, fontSize: 10 }, // H
  health_sickly_frail: { page: 0, x: 198.60, y: 343.80, fontSize: 10 }, // S/F

  health_bedridden_checkbox: {
    page: 0,
    x: 270.00,
    y: 344.40,
    fontSize: 10,
  }, // B checkbox
  health_bedridden_disability: {
    page: 0,
    x: 449.40,
    y: 342.60,
    fontSize: 10,
  }, // state disability

  // 13. Pensioner?
  pensioner_yes: { page: 0, x: 116.40, y: 355.20, fontSize: 10 },
  pensioner_no: { page: 0, x: 155.40, y: 355.20, fontSize: 10 },
  pensioner_sss: { page: 0, x: 186.00, y: 357.00, fontSize: 10 },
  pensioner_gsis: { page: 0, x: 216.60, y: 357.00, fontSize: 10 },
  pensioner_pvao: { page: 0, x: 250.80, y: 356.40, fontSize: 10 },
  pensioner_others: { page: 0, x: 342.60, y: 355.80, fontSize: 10 },

  // 14. Beneficiary
  beneficiary_pantawid: { page: 0, x: 120.60, y: 369.00, fontSize: 10 }, // P
  beneficiary_non_pantawid: {
    page: 0,
    x: 186.00,
    y: 369.60,
    fontSize: 10,
  }, // N/P
  beneficiary_social_pension: {
    page: 0,
    x: 276.00,
    y: 369.00,
    fontSize: 10,
  }, // SB
  beneficiary_other: { page: 0, x: 487.20, y: 369.60, fontSize: 10 }, // Others (specify)

  beneficiary_sss: { page: 0, x: 121.80, y: 382.80, fontSize: 10 },
  beneficiary_gsis: { page: 0, x: 187.20, y: 384.00, fontSize: 10 },
  beneficiary_military: { page: 0, x: 276.00, y: 382.20, fontSize: 10 },

  // 15. Previous OSCA ID?
  prev_osca_yes: { page: 0, x: 281.40, y: 397.80, fontSize: 10 },
  prev_osca_no: { page: 0, x: 317.40, y: 397.20, fontSize: 10 },
  prev_osca_where_when: { page: 0, x: 469.20, y: 396.60, fontSize: 10 }, // Where & when issued

  // 16. Emergency Contact
  emergency_whom_to_notify: {
    page: 0,
    x: 231.00,
    y: 409.80,
    fontSize: 10,
  }, // WN
  emergency_address: {
    page: 0,
    x: 407.40,
    y: 409.80,
    fontSize: 10,
  }, // Add

  // 17. Blood Type
  blood_type: { page: 0, x: 117.00, y: 423.00, fontSize: 10 }, // B/T

  // ============================
  // TO BE FILLED UP BY OSCA PERSONNEL
  // ============================

  // New / Replacement / Authorized Rep
  ofc_new_id: { page: 0, x: 57.00, y: 539.40, fontSize: 10 }, // NewId
  ofc_replacement: { page: 0, x: 57.60, y: 553.80, fontSize: 10 }, // Replacement
  ofc_authorized_rep: { page: 0, x: 57.00, y: 567.60, fontSize: 10 }, // Authorized rep checkbox

  ofc_authorized_rep_fullname: {
    page: 0,
    x: 246.00,
    y: 566.40,
    fontSize: 10,
  }, // Fullname
  ofc_authorized_rep_address: {
    page: 0,
    x: 237.00,
    y: 580.80,
    fontSize: 10,
  }, // Address
  ofc_authorized_rep_contact: {
    page: 0,
    x: 442.80,
    y: 566.40,
    fontSize: 10,
  }, // Contact number

  // Checklists
  ofc_barangay_cert: { page: 0, x: 222.60, y: 540.00, fontSize: 10 },
  ofc_old_id_surrendered: { page: 0, x: 222.00, y: 553.20, fontSize: 10 },
  ofc_affidavit_of_loss: { page: 0, x: 392.40, y: 539.40, fontSize: 10 },
  ofc_transferee: { page: 0, x: 393.60, y: 553.80, fontSize: 10 },

  ofc_old_record_attached: {
    page: 0,
    x: 165.60,
    y: 593.40,
    fontSize: 10,
  },
  ofc_date_issued: { page: 0, x: 294.00, y: 594.60, fontSize: 10 },
  ofc_no_record_found: { page: 0, x: 468.60, y: 593.40, fontSize: 10 },

  // Proof of Birth
  ofc_proof_birth_certificate: {
    page: 0,
    x: 57.60,
    y: 620.40,
    fontSize: 10,
  },
  ofc_proof_gov_id: { page: 0, x: 57.00, y: 633.60, fontSize: 10 },
  ofc_proof_marriage_cert: {
    page: 0,
    x: 378.00,
    y: 621.00,
    fontSize: 10,
  },
  ofc_proof_others: { page: 0, x: 397.20, y: 634.20, fontSize: 10 },
  ofc_proof_others_attached: {
    page: 0,
    x: 469.80,
    y: 633.60,
    fontSize: 10,
  },
  ofc_proof_others_specify: {
    page: 0,
    x: 559.20,
    y: 633.60,
    fontSize: 10,
  },

  // OSCA ID No / Issued On
  ofc_osca_id_number: { page: 0, x: 156.00, y: 647.40, fontSize: 10 },
  ofc_osca_issued_on: { page: 0, x: 420.00, y: 646.80, fontSize: 10 },

  // Received / Verified / Date Accomplished
  ofc_received_by: { page: 0, x: 114.00, y: 672.00, fontSize: 10 },
  ofc_verified_by: { page: 0, x: 112.20, y: 709.20, fontSize: 10 },
  ofc_date_accomplished: { page: 0, x: 465.00, y: 709.20, fontSize: 10 },

  // Remarks (first line)
  ofc_remarks: { page: 0, x: 60.60, y: 761.40, fontSize: 10 },
};