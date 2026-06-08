import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const PRODUCT_IMAGES_BUCKET = "product-images";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function cleanText(value: unknown) {
  return String(value || "").trim();
}

function makeSafeFileName(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getFileExtension(fileName: string, fileType: string) {
  const extensionFromName = fileName.split(".").pop();

  if (extensionFromName) {
    return extensionFromName.toLowerCase();
  }

  if (fileType === "image/png") return "png";
  if (fileType === "image/webp") return "webp";
  if (fileType === "image/gif") return "gif";

  return "jpg";
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");
    const rawSlug = cleanText(formData.get("slug"));

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Product image is required.",
        },
        { status: 400 }
      );
    }

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Only JPG, PNG, WEBP, and GIF images are allowed.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          ok: false,
          error: "Image size must be 5MB or less.",
        },
        { status: 400 }
      );
    }

    const safeSlug = makeSafeFileName(rawSlug || "product");
    const safeOriginalName = makeSafeFileName(file.name || "image");
    const extension = getFileExtension(safeOriginalName, file.type);
    const filePath = `${safeSlug}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${extension}`;

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabaseAdmin.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        {
          ok: false,
          error: uploadError.message,
        },
        { status: 500 }
      );
    }

    const { data } = supabaseAdmin.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .getPublicUrl(filePath);

    return NextResponse.json({
      ok: true,
      url: data.publicUrl,
      path: filePath,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to upload product image.",
      },
      { status: 500 }
    );
  }
}