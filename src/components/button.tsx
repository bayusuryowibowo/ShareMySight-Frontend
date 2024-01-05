import { ReactNode } from "react";

type Button = {
  text: string;
  className: string;
  onClick: () => void;
  icon: ReactNode;
  disabled: boolean;
};

export default function Button(props: Button) {
  return (
    <button disabled={props.disabled} onClick={props.onClick} className={props.className}>
      {props.icon}
      {props.text}
    </button>
  );
}
