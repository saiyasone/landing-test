import { OutlinedInput, Select, useMediaQuery } from "@mui/material";
import { IoIosArrowDown } from "react-icons/io";

const ButtonSelectStyled = (props) => {
  const isMobile = useMediaQuery("(max-width:768px)");
  return (
    <Select
      displayEmpty
      input={<OutlinedInput sx={{ textAlign: "center" }} />}
      IconComponent={(props) => (
        <IoIosArrowDown
          {...{
            ...props,
            style: { textAlign: "center" },
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
        width: "100%",
        fontSize: "1rem",
        height: 40,
        backgroundColor: "#DEE7E7",
        fontWeight: 700,
        ...(isMobile && {
          width: 90,
          height: 30,
          fontSize: "0.7rem !important",
        }),
        color: () => "#17766B",
        ".css-1vv2qh4-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select":
          {
            textAlign: "center",
          },
        ".MuiOutlinedInput-notchedOutline": {
          borderColor: () => "#17766B",
          border: "none",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: () => "#17766B",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: () => "#17766B",
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

export default ButtonSelectStyled;
