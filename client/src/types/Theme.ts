import { RootState } from '../state/store';

type Font = {
  fontFamily: string;
  fontSize: number;
};

export default interface ITheme {
  palette: {
    mode: RootState['AppReducer']['mode'];
    primary: {
      dark: string;
      main: string;
      light: string;
    };
    neutral: {
      dark: string;
      main: string;
      mediumMain: string;
      medium: string;
      light: string;
    };
    background: {
      default: string;
      alt: string;
    };
  };
  typography: Font & {
    h1: Font;
    h2: Font;
    h3: Font;
    h4: Font;
    h5: Font;
    h6: Font;
  };
}
