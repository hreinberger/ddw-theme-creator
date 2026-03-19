const THEME_NAME_PATTERN = /^[a-zA-Z0-9_]*$/

export const isValidThemeName = themeName => THEME_NAME_PATTERN.test(themeName)
