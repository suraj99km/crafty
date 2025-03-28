import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import supabase from "@/lib/supabase-db/supabaseClient";

let ffmpegInstance: any = null;

const loadFFmpeg = async () => {
  if (!ffmpegInstance) {
    ffmpegInstance = createFFmpeg({ log: true });
    await ffmpegInstance.load();
  }
  return ffmpegInstance;
};

/**
 * Compresses a video aggressively to ensure it's under 100KB.
 */
const compressVideo = async (file: File): Promise<File | null> => {
  try {
    const ffmpeg = await loadFFmpeg();
    const inputFileName = "input.mp4";
    const outputFileName = "output.mp4";

    await ffmpeg.FS("writeFile", inputFileName, await fetchFile(file));

    // Compression settings
    const resolution = "480p"; // Adaptive resolution scaling
    const compressionSettings = { crf: 28, preset: "medium" };  // Adjusted CRF and preset

    await ffmpeg.run(
      "-i", inputFileName,
      "-c:v", "libx265",
      "-preset", compressionSettings.preset,
      "-crf", `${compressionSettings.crf}`,
      "-movflags", "+faststart",
      "-vf", `scale=${resolution},format=yuv420p`,
      "-c:a", "aac",
      "-b:a", "128k", // Adaptive audio bitrate
      outputFileName
    );

    const data = ffmpeg.FS("readFile", outputFileName);
    const blob = new Blob([data.buffer], { type: "video/mp4" });
    const compressedFile = new File([blob], file.name, { type: "video/mp4" });

    if (compressedFile.size <= 100 * 1024) {
      return compressedFile;
    }

    console.error("❌ Compression failed, file too large.");
    return null;
  } catch (error) {
    console.error("❌ Error in video compression:", error);
    return null;
  } finally {
    const ffmpeg = await loadFFmpeg();
    ["input.mp4", "output.mp4"].forEach((file) => {
      try {
        ffmpeg.FS("unlink", file);
      } catch {}
    });
  }
};

/**
 * Uploads a compressed video (under 100KB) to Supabase Storage.
 */
export async function uploadVideo(file: File, folder: string): Promise<string | null> {
  if (!file) {
    console.error("❌ No file provided for upload.");
    return null;
  }

  try {
    const compressedFile = await compressVideo(file);

    if (!compressedFile) {
      console.error("❌ Compression failed. File not uploaded.");
      return null;
    }

    const timestamp = Date.now();
    const processedFileName = `compressed_${timestamp}.${compressedFile.type.split("/")[1]}`;
    const filePath = `${folder}/${processedFileName}`;

    const { data, error } = await supabase.storage
      .from("craftid.in-images")
      .upload(filePath, compressedFile, {
        cacheControl: "31536000",
        contentType: compressedFile.type,
        upsert: true,
      });

    if (error) {
      console.error("❌ Upload error:", error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("craftid.in-images")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error("❌ Error in upload process:", error);
    return null;
  }
}