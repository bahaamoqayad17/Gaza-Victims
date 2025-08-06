import Case from "@/Models/Case";
import { uploadMultipleFilesToS3, uploadFileToS3 } from "@/Utils/s3-utils";

export const getAllCases = async () => {
  const cases = await Case.find();
  return cases;
};
export const createCaseWithFiles = async (caseData: any, files: any) => {
  try {
    // Create the case first
    const newCase = await Case.create(caseData);
    const caseId = newCase._id.toString();

    // Handle file uploads for different fields
    const uploadPromises = [];

    // Handle portrait photo
    if (files.portraitPhoto) {
      const arrayBuffer = await files.portraitPhoto.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResult = await uploadFileToS3(
        buffer,
        files.portraitPhoto.name,
        files.portraitPhoto.type,
        `${caseId}/portrait`
      );
      newCase.portraitPhoto = uploadResult.url;
    }

    // Handle additional photos
    if (files.additionalPhotos && files.additionalPhotos.length > 0) {
      const additionalUrls = await uploadMultipleFilesToS3(
        files.additionalPhotos,
        `${caseId}/additional`
      );
      newCase.additionalAttachments = additionalUrls.urls;
    }

    // Handle proof of ID
    if (files.proofOfId) {
      const arrayBuffer = await files.proofOfId.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResult = await uploadFileToS3(
        buffer,
        files.proofOfId.name,
        files.proofOfId.type,
        `${caseId}/proof-of-id`
      );
      newCase.proofOfId = uploadResult.url;
    }

    // Handle proof of death
    if (files.proofOfDeath) {
      const arrayBuffer = await files.proofOfDeath.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResult = await uploadFileToS3(
        buffer,
        files.proofOfDeath.name,
        files.proofOfDeath.type,
        `${caseId}/proof-of-death`
      );
      newCase.proofOfDeath = uploadResult.url;
    }

    // Handle additional evidence
    if (files.additionalEvidence) {
      const arrayBuffer = await files.additionalEvidence.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResult = await uploadFileToS3(
        buffer,
        files.additionalEvidence.name,
        files.additionalEvidence.type,
        `${caseId}/additional-evidence`
      );
      newCase.additionalEvidence = uploadResult.url;
    }

    // Save the case with uploaded file URLs
    await newCase.save();

    return newCase;
  } catch (error) {
    console.error("Error creating case with files:", error);
    throw error;
  }
};

export const getCasesLocations = async () => {
  const locations = await Case.find().select("location");
  return locations;
};

export const getCase = async (id: string) => {
  const caseData = await Case.findById(id);
  return caseData;
};
