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
 * @param file - The original video file.
 * @returns {Promise<File | null>} - Compressed video file under 100KB or null if failed.
 */
const compressVideo = async (file: File): Promise<File | null> => {
  try {
    console.log(`📌 Starting compression: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
    const ffmpeg = await loadFFmpeg();
    const inputFileName = "input.mp4";
    const outputFileName = "output.mp4";

    await ffmpeg.FS("writeFile", inputFileName, await fetchFile(file));

    // Compression settings
    const compressionOptions = [
      { bitrate: 30, scale: "256:144", fps: 10, crf: 38 },
      { bitrate: 20, scale: "192:108", fps: 8, crf: 40 },
      { bitrate: 15, scale: "128:72", fps: 5, crf: 42 },
      { bitrate: 10, scale: "96:54", fps: 3, crf: 45 },
      { bitrate: 5, scale: "64:36", fps: 2, crf: 48 }
    ];

    for (const [index, { bitrate, scale, fps, crf }] of compressionOptions.entries()) {
      console.log(`Attempt ${index + 1}: Bitrate=${bitrate}k, Scale=${scale}, FPS=${fps}, CRF=${crf}`);

      try {
        ffmpeg.FS("unlink", outputFileName);
      } catch {}

      await ffmpeg.run(
        "-i", inputFileName,
        "-vf", `scale=${scale},fps=${fps}`,
        "-c:v", "libx264",
        "-preset", "slow",
        "-crf", `${crf}`,
        "-b:v", `${bitrate}k`,
        "-maxrate", `${bitrate}k`,
        "-bufsize", `${bitrate * 2}k`,
        "-movflags", "+faststart",
        "-profile:v", "baseline",
        "-level", "3.0",
        "-pix_fmt", "yuv420p",
        "-an",
        "-t", "5",
        outputFileName
      );

      const data = ffmpeg.FS("readFile", outputFileName);
      const blob = new Blob([data.buffer], { type: "video/mp4" });
      const compressedFile = new File([blob], file.name, { type: "video/mp4" });

      console.log(`✅ Attempt ${index + 1}: Compressed size = ${(compressedFile.size / 1024).toFixed(2)} KB`);

      if (compressedFile.size <= 100 * 1024) {
        console.log(`✅ Compression successful: ${(compressedFile.size / 1024).toFixed(2)} KB`);
        return compressedFile;
      }
    }

    console.error("❌ All MP4 compression attempts failed. Trying GIF fallback...");
    return await convertToGIF(file, ffmpeg);
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
 * Converts the video to a low-quality GIF if MP4 compression fails.
 */
const convertToGIF = async (file: File, ffmpeg: any): Promise<File | null> => {
  try {
    const inputFileName = "input.mp4";
    const outputFileName = "output.gif";

    await ffmpeg.run(
      "-i", inputFileName,
      "-vf", "fps=5,scale=96:-1:flags=lanczos",
      "-loop", "0",
      "-t", "5",
      outputFileName
    );

    const data = ffmpeg.FS("readFile", outputFileName);
    const blob = new Blob([data.buffer], { type: "image/gif" });
    const compressedFile = new File([blob], file.name.replace(".mp4", ".gif"), { type: "image/gif" });

    console.log(`✅ GIF conversion successful: ${(compressedFile.size / 1024).toFixed(2)} KB`);

    if (compressedFile.size <= 100 * 1024) {
      return compressedFile;
    }

    console.error("❌ GIF conversion failed. Falling back to static JPEG.");
    return await convertToJPEG(file, ffmpeg);
  } catch (error) {
    console.error("❌ Error in GIF conversion:", error);
    return null;
  }
};

/**
 * Converts the first frame of the video to a static JPEG if all else fails.
 */
const convertToJPEG = async (file: File, ffmpeg: any): Promise<File | null> => {
  try {
    const inputFileName = "input.mp4";
    const outputFileName = "output.jpg";

    await ffmpeg.run(
      "-i", inputFileName,
      "-vf", "scale=96:-1",
      "-q:v", "31",
      "-frames:v", "1",
      outputFileName
    );

    const data = ffmpeg.FS("readFile", outputFileName);
    const blob = new Blob([data.buffer], { type: "image/jpeg" });
    const compressedFile = new File([blob], file.name.replace(".mp4", ".jpg"), { type: "image/jpeg" });

    console.log(`✅ JPEG fallback successful: ${(compressedFile.size / 1024).toFixed(2)} KB`);
    return compressedFile;
  } catch (error) {
    console.error("❌ Error in JPEG conversion:", error);
    return null;
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

  console.log(`📌 Processing file: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);

  try {
    const compressedFile = await compressVideo(file);

    if (!compressedFile) {
      console.error("❌ Compression failed. File not uploaded.");
      return null;
    }

    if (compressedFile.size > 100 * 1024) {
      console.error(`❌ Compression unsuccessful: File is still ${(compressedFile.size / 1024).toFixed(2)} KB`);
      return null;
    }

    console.log(`✅ Ready for upload: ${(compressedFile.size / 1024).toFixed(2)} KB`);

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

    console.log("✅ Upload successful:", data);

    const { data: urlData } = supabase.storage
      .from("craftid.in-images")
      .getPublicUrl(filePath);

    console.log("✅ Public URL:", urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error("❌ Error in upload process:", error);
    return null;
  }
}