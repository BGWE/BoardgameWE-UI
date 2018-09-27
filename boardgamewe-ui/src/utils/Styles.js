export class StyleUtils {
    static SMALL_SCREEN_MAX_WIDTH = 640
    static MEDIUM_SCREEN_MAX_WIDTH = 1007

    static isLargeScreen() {
        return window.innerWidth > StyleUtils.MEDIUM_SCREEN_MAX_WIDTH;
    }

    static isMediumScreen() {
        return window.innerWidth > StyleUtils.SMALL_SCREEN_MAX_WIDTH && window.innerWidth <= StyleUtils.SMALL_SCREEN_MAX_WIDTH;
    }

    static isSmallScreen() {
        return window.innerWidth < StyleUtils.SMALL_SCREEN_MAX_WIDTH;
    }

};