import { OutlinedInput, Select, useMediaQuery } from "@mui/material";
import { IoIosArrowDown } from "react-icons/io";

const SelectStyled = (props) => {
  const isMobile = useMediaQuery("(max-width:768px)");
  return (
    <Select
      displayEmpty
      input={<OutlinedInput />}
      IconComponent={(props) => (
        <IoIosArrowDown
          {...{
            ...props,
          }}
          fill="#4B465C"
        />
      )}
      MenuProps={{
        PaperProps: {
          sx: {
            boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 5px",
          },
        },
      }}
      {...props}
      sx={{
        width: 100,
        height: 30,
        fontWeight: 600,
        ...(isMobile && {
          width: 90,
          height: 30,
          fontSize: "0.7rem !important",
        }),
        color: () => "#4B465C",
        ".MuiOutlinedInput-notchedOutline": {
          borderColor: () => "none",
          border: "none",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: () => "none",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: () => "none",
        },
        ".MuiSvgIcon-root ": {
          fill: "white !important",
        },
        ...props.sx,
      }}
    >
      {props.children}
    </Select>
  );
};

export default SelectStyled;
