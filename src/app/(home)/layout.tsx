import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex">
            <Sidebar />
            <div className="grow flex flex-col">
                <Navbar />
                {children}
            </div>
        </div>
    );
}
