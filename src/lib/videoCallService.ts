import { apiClient } from "@/utils/axios";
import { VIDEO_CALL } from "./api-paths";
import ErrorHandler from "@/utils/errorHandling";

class VideoCallService {
  public getRandomVideoCallRoom = async () => {
    try {
      const response = apiClient.get(VIDEO_CALL);
    } catch (error: any) {
      ErrorHandler.handleError(error);
    }
  }
}