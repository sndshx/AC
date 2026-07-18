import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/shared/auth";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || ""
});

function uploadBuffer(buffer: Buffer, folder: string, resourceType: "auto" | "image" | "video" | "raw" = "auto") {
  return new Promise<{ secure_url: string; public_id: string; resource_type: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        overwrite: false
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Upload failed"));
          return;
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          resource_type: result.resource_type
        });
      }
    );

    stream.end(buffer);
  });
}

const MAX_FILE_SIZE = 100 * 1024 * 1024; // Align with frontend limit of 100MB (Cloudinary may fail, but local fallback supports it)

function getResourceType(fileName: string, mimeType: string): "image" | "raw" {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  const isImg = ['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext) || mimeType.startsWith('image/');
  return isImg ? 'image' : 'raw';
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const folder = String(formData.get("folder") ?? "ai-marketing-command");
  const useLocal = !process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET;

  // ── Multi-file upload (task submissions send key "files") ──────────────────
  const multipleFiles = formData.getAll("files");
  if (multipleFiles.length > 0) {
    const files = multipleFiles.filter((f): f is File => f instanceof File);

    if (files.length === 0) {
      return NextResponse.json({ error: "No valid files found in the 'files' field." }, { status: 400 });
    }

    for (const f of files) {
      if (f.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File "${f.name}" exceeds the 100 MB limit.` },
          { status: 400 }
        );
      }
    }

    if (useLocal) {
      // Local fallback
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filesData = [];
      for (const f of files) {
        const buffer = Buffer.from(await f.arrayBuffer());
        const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${f.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const filePath = path.join(uploadDir, safeName);
        fs.writeFileSync(filePath, buffer);

        const fileUrl = `/uploads/${safeName}`;
        filesData.push({
          url: fileUrl,
          publicId: safeName,
          resourceType: "raw",
          uploadedBy: session.id,
          name: f.name,
          fileSize: f.size,
          mimeType: f.type || "application/octet-stream"
        });
      }

      return NextResponse.json({
        urls: filesData.map((fd) => fd.url),
        files: filesData
      });
    }

    // Cloudinary upload
    try {
      const uploads = await Promise.all(
        files.map(async (f) => {
          const buffer = Buffer.from(await f.arrayBuffer());
          const resourceType = getResourceType(f.name, f.type);
          return { result: await uploadBuffer(buffer, folder, resourceType), file: f };
        })
      );

      return NextResponse.json({
        urls: uploads.map((u) => u.result.secure_url),
        files: uploads.map((u) => ({
          url: u.result.secure_url,
          publicId: u.result.public_id,
          resourceType: u.result.resource_type,
          uploadedBy: session.id,
          name: u.file.name,
          fileSize: u.file.size,
          mimeType: u.file.type || "application/octet-stream"
        }))
      });
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return NextResponse.json({ error: "Cloudinary upload failed." }, { status: 500 });
    }
  }

  // ── Single-file upload (profile pictures, etc. send key "file") ────────────
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Upload a file using the 'file' or 'files' field." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Files must be 100MB or smaller." }, { status: 400 });
  }

  if (useLocal) {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(uploadDir, safeName);
    fs.writeFileSync(filePath, buffer);

    const fileUrl = `/uploads/${safeName}`;
    return NextResponse.json({
      file: {
        url: fileUrl,
        publicId: safeName,
        resourceType: "raw",
        uploadedBy: session.id
      }
    });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const resourceType = getResourceType(file.name, file.type);
    const upload = await uploadBuffer(buffer, folder, resourceType);

    return NextResponse.json({
      file: {
        url: upload.secure_url,
        publicId: upload.public_id,
        resourceType: upload.resource_type,
        uploadedBy: session.id
      }
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json({ error: "Cloudinary upload failed." }, { status: 500 });
  }
}

