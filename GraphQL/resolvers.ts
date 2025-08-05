import User from "@/Models/User";
import Case from "@/Models/Case";
import {
  createCaseWithFiles,
  getCasesLocations,
} from "@/Controllers/CaseController";
import {
  register,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
} from "@/Controllers/AuthController";
export const resolvers: any = {
  Query: {
    users: async () => await User.find().select("-password -passwordConfirm"),
    user: async (_: any, args: { id: string }) =>
      await User.findById(args.id).select("-password -passwordConfirm"),
    cases: async () => await Case.find(),
    case: async (_: any, args: { id: string }) => await Case.findById(args.id),
    casesLocations: async () => await getCasesLocations(),
  },

  Mutation: {
    register: async (
      _: any,
      args: {
        input: {
          name: string;
          email: string;
          password: string;
          passwordConfirm: string;
        };
      }
    ) => {
      return await register(args.input);
    },

    login: async (
      _: any,
      args: {
        input: {
          email: string;
          password: string;
        };
      }
    ) => {
      return await login(args.input);
    },

    forgotPassword: async (
      _: any,
      args: {
        input: {
          email: string;
        };
      }
    ) => {
      return await forgotPassword(args.input);
    },

    verifyOTP: async (
      _: any,
      args: {
        input: {
          email: string;
          otp: string;
        };
      }
    ) => {
      return await verifyOTP(args.input);
    },

    resetPassword: async (
      _: any,
      args: {
        input: {
          email: string;
          password: string;
          passwordConfirm: string;
        };
      }
    ) => {
      return await resetPassword(args.input);
    },

    createUser: async (
      _: any,
      args: {
        input: {
          name: string;
          email: string;
          password: string;
          passwordConfirm: string;
        };
      }
    ) => {
      const user = await User.create(args);
      user.password = ""; // clear sensitive data
      return user;
    },

    createCase: async (_: any, args: any) => {
      const {
        caseData,
        portraitPhoto,
        additionalPhotos,
        proofOfId,
        proofOfDeath,
        additionalEvidence,
      } = args;

      // Prepare files object
      const files: any = {};
      if (portraitPhoto) files.portraitPhoto = portraitPhoto;
      if (additionalPhotos) files.additionalPhotos = additionalPhotos;
      if (proofOfId) files.proofOfId = proofOfId;
      if (proofOfDeath) files.proofOfDeath = proofOfDeath;
      if (additionalEvidence) files.additionalEvidence = additionalEvidence;

      // Create case with files
      const newCase = await createCaseWithFiles(caseData, files);
      return newCase;
    },
  },
};
