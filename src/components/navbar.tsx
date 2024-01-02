import { FunctionComponent } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

interface Props {}

const Navbar: FunctionComponent<Props> = () => {
    return (
        <nav className="px-[35px] pt-7 pb-2 text-right flex justify-end bg-[#F6F6F6]">
            <div className="bg-white px-8 py-3 rounded-[20px] flex gap-3 items-center shadow-card h-[54px]">
                <AccountCircleIcon className="text-3xl" />
                <p>Mega Mushroom</p>
            </div>
        </nav>
    );
};

export default Navbar;
