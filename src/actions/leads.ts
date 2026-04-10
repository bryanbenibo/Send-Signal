"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { parsePhoneNumberWithError, ParseError } from 'libphonenumber-js'
import Papa from 'papaparse'

export async function importLeadsFromCSV(csvText: string, defaultSource: string = "CSV Import") {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  const userId = session.user.id

  try {
    // 1. Parse CSV
    const result = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    })

    if (result.errors.length > 0) {
      return { error: "Failed to parse CSV file." }
    }

    const rows = result.data as Record<string, string>[]
    let validLeads = 0
    let invalidPhones = 0
    let duplicatesSkipped = 0

    // 2. Fetch existing phone numbers for duplicate detection
    const existingLeads = await prisma.lead.findMany({
      where: { user_id: userId },
      select: { phone_number: true }
    })
    const existingPhones = new Set(existingLeads.map(l => l.phone_number))

    const leadsToInsert = []

    // 3. Process each row
    for (const row of rows) {
      // Find possible phone number column
      const phoneRaw = row['Phone Number'] || row['phone'] || row['phone_number'] || row['PhoneNumber'] || row['Phone']
      if (!phoneRaw) {
        invalidPhones++
        continue
      }

      try {
        const phoneNumber = parsePhoneNumberWithError(phoneRaw, 'US') // Default to US or detect dynamically
        const e164Phone = phoneNumber.format('E.164')

        if (existingPhones.has(e164Phone)) {
          duplicatesSkipped++
          continue
        }

        // Prevent duplicate inside the same CSV
        existingPhones.add(e164Phone)

        // Find possible name columns
        const firstName = row['First Name'] || row['first_name'] || row['firstName'] || row['Name']?.split(' ')[0] || ""
        const lastName = row['Last Name'] || row['last_name'] || row['lastName'] || row['Name']?.split(' ').slice(1).join(' ') || ""
        const email = row['Email'] || row['email'] || ""
        
        // Capture leftover columns as custom fields
        const customFields = { ...row }
        delete customFields['Phone Number']; delete customFields['phone']
        delete customFields['First Name']; delete customFields['first_name']
        delete customFields['Last Name']; delete customFields['last_name']
        delete customFields['Email']; delete customFields['email']

        leadsToInsert.push({
          user_id: userId,
          phone_number: e164Phone,
          first_name: firstName || undefined,
          last_name: lastName || undefined,
          email: email || undefined,
          source: row['Source'] || row['source'] || defaultSource,
          custom_fields_json: customFields,
          status: "NEW" as any,
          opt_in: true, // Assuming opt in provided from standard CSV forms
        })

      } catch (err) {
        if (err instanceof ParseError) {
          invalidPhones++
        }
        continue
      }
    }

    // 4. Batch insert
    if (leadsToInsert.length > 0) {
      // Prisma bulk insert (uses transactions under the hood for Postgres)
      await prisma.lead.createMany({
        data: leadsToInsert,
        skipDuplicates: true // Redundant but safe
      })
      validLeads = leadsToInsert.length
      
      // Log event
      await prisma.activityLog.create({
        data: {
          user_id: userId,
          event_type: "LEAD_IMPORTED",
          description: `Imported ${validLeads} new leads via CSV`
        }
      })
    }

    return {
      success: true,
      message: `Imported ${validLeads} leads. Skipped ${duplicatesSkipped} duplicates. Found ${invalidPhones} invalid phones.`
    }

  } catch (error) {
    console.error("CSV Import Error:", error)
    return { error: "An unexpected error occurred during import." }
  }
}
