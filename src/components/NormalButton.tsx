import { SxProps, Theme, styled as muiStyled } from "@mui/material";
import React from "react";

const NormalButtonContainer = muiStyled("button")({
  cursor: "pointer",
  display: "flex",
  padding: 0,
  border: "none",
  borderRadius: "6px",
  fontSize: "inherit",
  fontFamily: "inherit",
  width: "100%",
  height: "100%",
  background: "transparent",
});

type NormalButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  sx: SxProps<Theme> | undefined;
};

const NormalButton = React.forwardRef<HTMLButtonElement, NormalButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <NormalButtonContainer ref={ref} type="button" {...props}>
        {children}
      </NormalButtonContainer>
    );
  },
);

export default NormalButton;
