import { apiClient } from "@/utils/axios";
import { VIDEO_CALL } from "../api-paths";
import ErrorHandler from "@/utils/errorHandling";

class VideoCallService {
  public getRandomVideoCallRoom = async () => {
    try {
      const { data } = await apiClient.get(VIDEO_CALL);
      return data.data;
    } catch (error: any) {
      if (error.response.status !== 404) {
        ErrorHandler.handleError(error);
      } else {
        return null;
      }
    }
  }

  public addGeneratedVideoCallRoom = async (roomId: string) => {
    try {
      const { data } = await apiClient.post(VIDEO_CALL, { roomId });
      console.log("post video call", data);
      return data.data;
    } catch (error: any) {
      ErrorHandler.handleError(error)
    }
  }
}

export default VideoCallService;