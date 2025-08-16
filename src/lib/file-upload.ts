import { put } from "@vercel/blob";

export interface FileUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadFile(
  file: File,
  fileName?: string
): Promise<FileUploadResult> {
  try {
    // Check if Vercel Blob token is available
    if (!process.env.VERCEL_BLOB_READ_WRITE_TOKEN) {
      console.error(
        "❌ VERCEL_BLOB_READ_WRITE_TOKEN not found in environment variables"
      );
      return {
        success: false,
        error:
          "Vercel Blob configuration missing. Please set VERCEL_BLOB_READ_WRITE_TOKEN environment variable.",
      };
    }

    // Generate a unique filename if not provided
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const finalFileName = fileName || `resume_${timestamp}_${sanitizedName}`;

    console.log(
      `📁 Attempting to upload file: ${finalFileName} (${file.size} bytes)`
    );
    console.log(
      `🔑 Vercel Blob token available: ${
        process.env.VERCEL_BLOB_READ_WRITE_TOKEN ? "YES" : "NO"
      }`
    );

    // Upload to Vercel Blob
    const blob = await put(finalFileName, file, {
      access: "public",
      addRandomSuffix: false,
    });

    console.log(`✅ File uploaded successfully: ${blob.url}`);

    return {
      success: true,
      url: blob.url,
    };
  } catch (error) {
    console.error("❌ Error uploading file:", error);

    // Provide more specific error messages
    let errorMessage = "Unknown error occurred during file upload";

    if (error instanceof Error) {
      if (error.message.includes("VERCEL_BLOB_READ_WRITE_TOKEN")) {
        errorMessage =
          "Vercel Blob configuration missing. Please set VERCEL_BLOB_READ_WRITE_TOKEN environment variable.";
      } else if (
        error.message.includes("unauthorized") ||
        error.message.includes("401")
      ) {
        errorMessage =
          "Unauthorized access to Vercel Blob. Please check your VERCEL_BLOB_READ_WRITE_TOKEN.";
      } else if (
        error.message.includes("network") ||
        error.message.includes("fetch")
      ) {
        errorMessage = "Network error during file upload. Please try again.";
      } else {
        errorMessage = error.message;
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function uploadFileFromFormData(
  formData: any,
  fieldName: string = "resume"
): Promise<FileUploadResult> {
  try {
    const file = formData.get(fieldName) as File | null;

    if (!file) {
      console.log("⚠️ No file provided in form data");
      return {
        success: false,
        error: "No file provided",
      };
    }

    console.log(
      `📁 Processing file: ${file.name} (${file.type}, ${file.size} bytes)`
    );

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      console.log(`❌ Invalid file type: ${file.type}`);
      return {
        success: false,
        error: "Invalid file type. Only PDF, DOC, and DOCX files are allowed.",
      };
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.log(
        `❌ File too large: ${file.size} bytes (max: ${maxSize} bytes)`
      );
      return {
        success: false,
        error: "File size too large. Maximum size is 5MB.",
      };
    }

    return await uploadFile(file);
  } catch (error) {
    console.error("❌ Error uploading file from form data:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
