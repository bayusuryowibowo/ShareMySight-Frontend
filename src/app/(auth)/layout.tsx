export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div
            className={
                "w-full min-h-screen flex justify-center items-center bg-beige"
            }
            style={{ height: "100vh" }}
        >
            {children}
        </div>
    );
}
