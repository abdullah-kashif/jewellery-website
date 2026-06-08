import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

type QuoteFields = Record<string, string | undefined>;

const quoteImageBucket = "quote-reference-images";
const maxImageSize = 5 * 1024 * 1024;

function createReference() {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `LXQ-${random}`;
}

function cleanText(value?: string | null) {
  return String(value || "").trim();
}

function pick(fields: QuoteFields, keys: string[]) {
  for (const key of keys) {
    const value = cleanText(fields[key]);

    if (value) {
      return value;
    }
  }

  return "";
}

function createSafeFileName(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase() || "jpg";
  const baseName =
    fileName
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") || "reference-image";

  return `${baseName}.${extension}`;
}

async function readQuoteRequestBody(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const fields: QuoteFields = {};
    let referenceImageFile: File | null = null;
    let referenceImageName = "";

    formData.forEach((value, key) => {
      if (typeof value === "string") {
        fields[key] = value;
      } else if (!referenceImageFile && value.size > 0) {
        referenceImageFile = value;
        referenceImageName = value.name || "";
      }
    });

    return {
      fields,
      referenceImageFile,
      referenceImageName,
    };
  }

  const json = (await request.json()) as QuoteFields;

  return {
    fields: json || {},
    referenceImageFile: null,
    referenceImageName: cleanText(
      json?.referenceImageName || json?.reference_image_name || json?.imageName
    ),
  };
}

async function uploadReferenceImage({
  file,
  reference,
  userId,
}: {
  file: File | null;
  reference: string;
  userId?: string;
}) {
  if (!file) {
    return {
      imageUrl: null,
      imageName: "",
    };
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed.");
  }

  if (file.size > maxImageSize) {
    throw new Error("Image size must be less than 5MB.");
  }

  const safeFileName = createSafeFileName(file.name || "reference-image.jpg");
  const folderName = userId || "guest";
  const filePath = `${folderName}/${reference}-${Date.now()}-${safeFileName}`;

  const { error } = await supabaseAdmin.storage
    .from(quoteImageBucket)
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabaseAdmin.storage
    .from(quoteImageBucket)
    .getPublicUrl(filePath);

  return {
    imageUrl: data.publicUrl,
    imageName: file.name || safeFileName,
  };
}

async function getOrCreateCustomerProfile({
  userId,
  fullName,
  email,
  whatsapp,
  country,
}: {
  userId?: string;
  fullName: string;
  email: string;
  whatsapp: string;
  country: string;
}) {
  if (!userId) {
    return null;
  }

  try {
    const { data: existingProfile } = await supabaseAdmin
      .from("customer_profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existingProfile?.id) {
      await supabaseAdmin
        .from("customer_profiles")
        .update({
          full_name: fullName,
          email,
          phone: whatsapp,
          country,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingProfile.id);

      return existingProfile.id as string;
    }

    const { data: newProfile } = await supabaseAdmin
      .from("customer_profiles")
      .insert({
        user_id: userId,
        full_name: fullName,
        email,
        phone: whatsapp,
        country,
      })
      .select("id")
      .single();

    return (newProfile?.id as string) || null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { fields, referenceImageFile, referenceImageName } =
      await readQuoteRequestBody(request);

    const fullName = pick(fields, ["fullName", "full_name", "name"]);
    const email = pick(fields, ["email", "customerEmail"]) || user?.email || "";
    const whatsapp = pick(fields, ["whatsapp", "phone", "mobile"]);
    const country = pick(fields, ["country"]);

    const productType = pick(fields, [
      "productType",
      "product_type",
      "product",
      "jewelleryType",
    ]);

    const metalType = pick(fields, ["metalType", "metal_type", "metal"]);
    const goldKarat = pick(fields, ["goldKarat", "gold_karat", "karat"]);
    const stoneType = pick(fields, ["stoneType", "stone_type", "stone"]);
    const size = pick(fields, ["size", "ringSize", "ring_size"]);
    const budget = pick(fields, ["budget", "budgetRange", "budget_range"]);
    const message = pick(fields, [
      "message",
      "additionalMessage",
      "additional_message",
      "notes",
    ]);

    if (!fullName || !email || !whatsapp || !country || !productType) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Full name, email, WhatsApp, country, and product type are required.",
        },
        { status: 400 }
      );
    }

    const reference = createReference();

    const uploadedImage = await uploadReferenceImage({
      file: referenceImageFile,
      reference,
      userId: user?.id,
    });

    const customerProfileId = await getOrCreateCustomerProfile({
      userId: user?.id,
      fullName,
      email,
      whatsapp,
      country,
    });

    const { data, error } = await supabaseAdmin
      .from("quote_requests")
      .insert({
        reference,
        customer_user_id: user?.id || null,
        customer_profile_id: customerProfileId,

        full_name: fullName,
        email,
        whatsapp,
        country,

        product: productType,
        product_type: productType,

        metal: metalType,
        metal_type: metalType,

        gold_karat: goldKarat,

        stone: stoneType,
        stone_type: stoneType,

        size,
        ring_size: size,

        budget,
        budget_range: budget,

        message,
        additional_message: message,

        reference_image_name:
          uploadedImage.imageName || referenceImageName || null,
        image_url: uploadedImage.imageUrl,

        status: "pending",
        quoted_price: null,
        admin_notes: null,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      reference,
      quote: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown server error.",
      },
      { status: 500 }
    );
  }
}