import {
  FILE_SIZE_LIMIT,
  ALLOWED_FILE_TYPES,
} from "../constants/appConstants.js"

class FileValidator {
  validateFile(fileBuffer, filename, options = {}) {
    const maxSize = options.maxSize || FILE_SIZE_LIMIT;
    const allowedTypes = options.allowedTypes || ALLOWED_FILE_TYPES;

    // Check file size
    if (fileBuffer.length > maxSize) {
      return {
        isValid: false,
        error: `File size exceeds ${maxSize / (1024 * 1024)}MB limit`,
      };
    }

    // Check file extension
    const extension = filename.split(".").pop().toLowerCase();
    const allowedExtension = allowedTypes.find(
      (type) => type.ext === extension,
    );

    if (!allowedExtension) {
      return {
        isValid: false,
        error: `Invalid file type. Allowed: ${allowedTypes.map((t) => t.ext).join(", ")}`,
      };
    }

    // Check magic numbers (file signatures)
    const isValidMagicNumber = this.validateMagicNumber(fileBuffer, extension);
    if (!isValidMagicNumber) {
      return {
        isValid: false,
        error: "File content does not match extension",
      };
    }

    return {
      isValid: true,
      error: null,
      fileType: allowedExtension,
    };
  }

  validateMagicNumber(buffer, extension) {
    // Check PDF magic number (%PDF)
    if (extension === "pdf") {
      const header = buffer.toString("ascii", 0, 4);
      return header === "%PDF";
    }

    // Check DOCX magic number (PK)
    if (extension === "docx") {
      const header = buffer.toString("ascii", 0, 2);
      return header === "PK";
    }

    return true;
  }

  getFileInfo(buffer, filename) {
    const stats = {
      filename,
      size: buffer.length,
      sizeInMB: (buffer.length / (1024 * 1024)).toFixed(2),
      extension: filename.split(".").pop().toLowerCase(),
      mimeType: this.getMimeType(filename),
    };

    return stats;
  }

  getMimeType(filename) {
    const extension = filename.split(".").pop().toLowerCase();
    const mimeTypes = {
      pdf: "application/pdf",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      doc: "application/msword",
    };

    return mimeTypes[extension] || "application/octet-stream";
  }
}

export const fileValidator= new FileValidator();
