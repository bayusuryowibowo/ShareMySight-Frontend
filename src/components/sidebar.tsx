import { FunctionComponent } from "react";

interface Props {}

const Sidebar: FunctionComponent<Props> = () => {
    return (
        <div className="bg-beige h-screen w-[300px] p-5">
            <div>ShareMySight</div>
            <div>Live Call Assistance</div>
            <div>Live Chat Assistance</div>
            <div>Ask AI</div>
        </div>
    );
};

export default Sidebar;
