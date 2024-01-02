import Notifications from "@/components/notifications";
import Options from "@/components/options";
import VideoPlayer from "@/components/videoPlayer";
import { Box, Container, Heading } from "@chakra-ui/react";

const VideoCallPage = () => {
  return (
    <Box>
      <Container maxW="1200px" mt="8">
        <Heading as="h2" size="2xl">
          {" "}
          Video Chat App{" "}
        </Heading>
        <VideoPlayer />
        <Options />
        <Notifications />
      </Container>
    </Box>
  )
}

export default VideoCallPage;