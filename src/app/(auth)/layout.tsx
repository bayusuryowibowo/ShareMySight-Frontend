export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <div className="h-screen overflow-hidden">
                <div className="flex min-h-screen flex-col items-center justify-between p-24 bg-dark-purple h-screen">
                    <div className="eye left-[35%]">
                        <div className="shut">
                            <span></span>
                        </div>
                        <div className="ball"></div>
                    </div>
                    <div className="eye left-[65%]">
                        <div className="shut">
                            <span></span>
                        </div>
                        <div className="ball"></div>
                    </div>
                </div>
                <div
                    className={
                        "w-full min-h-screen flex flex-col items-center justify-center bg-pale-purple overlay relative"
                    }
                    style={{ height: "100vh" }}
                >
                    <div className="blob">
                        <svg
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 310 350"
                        >
                            <path d="M156.4,339.5c31.8-2.5,59.4-26.8,80.2-48.5c28.3-29.5,40.5-47,56.1-85.1c14-34.3,20.7-75.6,2.3-111  c-18.1-34.8-55.7-58-90.4-72.3c-11.7-4.8-24.1-8.8-36.8-11.5l-0.9-0.9l-0.6,0.6c-27.7-5.8-56.6-6-82.4,3c-38.8,13.6-64,48.8-66.8,90.3c-3,43.9,17.8,88.3,33.7,128.8c5.3,13.5,10.4,27.1,14.9,40.9C77.5,309.9,111,343,156.4,339.5z" />
                        </svg>
                    </div>
                    <div className="absolute top-[50px]">
                        <div className="font-bold text-5xl text-dark-purple">
                            ShareMySight
                        </div>
                    </div>
                    <div className=" bg-white w-2/3 m-h-4/5 rounded-[30px] shadow-md p-8 flex mt-[50px]">
                        <p className="border-r-2 flex justify-center items-center">
                            <img
                                src="welcome.png"
                                alt="welcome"
                                className="object-fit-cover max-w-[500px]"
                            />
                        </p>
                        <div className="grow-[4] p-3">{children}</div>
                    </div>
                </div>
            </div>
        </>
    );
}
