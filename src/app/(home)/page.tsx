<<<<<<< HEAD:src/app/page.tsx
import VideoCall from '@/components/videoCall'

const Page = ({ }: { home: React.ReactNode; login: React.ReactNode }) => {
    return (
        <div>
            <VideoCall />
        </div>
    );
=======
const Page = ({}: { home: React.ReactNode; login: React.ReactNode }) => {
    return <div className="p-8">test</div>;
>>>>>>> development:src/app/(home)/page.tsx
};

export default Page;
