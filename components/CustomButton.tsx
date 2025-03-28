import React, { ReactNode } from "react";

export interface CustomButtonProps {
  title: string;
  btnType: "button" | "submit";
  containerStyles?: string;
  handleClick?: () => void;
  textStyles?: string;
  rightIcon?: ReactNode; // Add this line to support the rightIcon prop
  isDisabled?: boolean;
}

const CustomButton = ({
  title,
  btnType,
  containerStyles,
  handleClick,
  textStyles,
  rightIcon, // Add this to the destructuring
  isDisabled = false,
}: CustomButtonProps) => {
  return (
    <button
      disabled={isDisabled}
      type={btnType === "button" ? "button" : "submit"}
      className={`${containerStyles}`}
      onClick={handleClick}
    >
      <span className={`flex items-center ${textStyles}`}>
        {title}
        {rightIcon && rightIcon} {/* Render the rightIcon if provided */}
      </span>
    </button>
  );
};

export default CustomButton;
