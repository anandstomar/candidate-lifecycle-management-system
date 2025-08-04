import fs from "fs";
import path from "path";
import Resume from "../models/Resume.js";
import upload from "../middleware/uploadMiddleware.js";

export const uploadResumeImages = async (req, res) => {
  try {
    upload.fields([{ name: "thumbnail" }, { name: "profileImage" }])(
      req,
      res,
      async (err) => {
    if (err) {
          return res
            .status(400)
            .json({ message: "File upload failed", error: err.message });
        }

        const resumeId = req.params.id;
        const resume = await Resume.findOne({
          _id: resumeId,
          userId: req.user._id,
        });

        if (!resume) {
          return res
            .status(404)
            .json({ message: "Resume not found or unauthorized" });
        }

        const uploadsFolder = path.join(process.cwd(), "uploads");
        const baseUrl = `${req.protocol}://${req.get("host")}`;

        const newThumbnail = req.files?.thumbnail?.[0];
        const newProfileImage = req.files?.profileImage?.[0];

        // Handle Thumbnail
        if (newThumbnail) {
          if (resume.thumbnailLink) {
            const oldThumbPath = path.join(
              uploadsFolder,
              path.basename(resume.thumbnailLink)
            );
            if (fs.existsSync(oldThumbPath)) fs.unlinkSync(oldThumbPath);
          }
          resume.thumbnailLink = `${baseUrl}/uploads/${newThumbnail.filename}`;
        }

        
        if (newProfileImage) {
          if (resume.profileInfo?.profilePreviewUrl) {
            const oldProfilePath = path.join(
              uploadsFolder,
              path.basename(resume.profileInfo.profilePreviewUrl)
            );
            if (fs.existsSync(oldProfilePath)) fs.unlinkSync(oldProfilePath);
          }

          const profileImageUrl = `${baseUrl}/uploads/${newProfileImage.filename}`;
          resume.profileInfo.profilePreviewUrl = profileImageUrl; // ✅ Save URL
        }

        await resume.save();

        res.status(200).json({
          message: "Images uploaded successfully",
          thumbnailLink: resume.thumbnailLink,
          profilePreviewUrl: resume.profileInfo.profilePreviewUrl,
        });
      }
    );
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
