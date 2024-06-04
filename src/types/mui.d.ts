import { Theme, ThemeOptions } from "@mui/material";
import {
  PaletteOptions as MuiPaletteOptions,
  Palette as MuiPallete,
} from "@mui/material/styles/createPalette";

declare module "@mui/material/styles/createPalette" {
  interface Palette extends MuiPallete {
    primaryTheme: { main: string };
  }

  interface PaletteOptions extends MuiPaletteOptions {
    primaryTheme?: { main: string };
  }
}

declare module "@mui/material/styles" {
  interface CustomTheme extends Theme {}
  interface CustomThemeOptions extends ThemeOptions {}
  export function createTheme(options?: CustomThemeOptions): CustomTheme;
}

declare module "@mui/material/CircularProgress" {
  export interface CircularProgressPropsColorOverrides {
    primaryTheme: true;
  }
}
