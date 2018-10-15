import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
    palette: {
        primary: {
            light: '#62eeff',
            main: '#00bbd3',
            dark: '#008ba2',
            contrastText: '#fafafa',
        },
        secondary: {
            light: '#ffa040',
            main: '#ff6f00',
            dark: '#c43e00',
            contrastText: '#fafafa',
        },
        typography: {
            useNextVariants: true,
        },
    }
});