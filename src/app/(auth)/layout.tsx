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
            <div className=" bg-white w-2/3 m-h-4/5 rounded-[30px] shadow-md p-8 flex">
                <p className="border-2 border-blue-500 grow-[4]">
                    Ini gambar maskot kita ntar nyusul
                </p>
                <div className="grow-[3] p-8">{children}</div>
            </div>
        </div>
    );
}
