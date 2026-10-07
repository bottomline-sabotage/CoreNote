class Color {
    static get RESET() { return "\x1b[0m"; }
    static get RED() { return "\x1b[31m"; }
    static get ORANGE() { return "\x1b[38;5;214m"; }
    static get GREEN() { return "\x1b[32m"; }
    static get YELLOW() { return "\x1b[33m"; }
    static get BLUE() { return "\x1b[34m"; }
    static get MAGENTA() { return "\x1b[35m"; }
    static get CYAN() { return "\x1b[36m"; }
    static get WHITE() { return "\x1b[37m"; }
    static get LIGHT_GRAY() { return "\x1b[37;1m"; }
    static get DARK_GRAY() { return "\x1b[90m"; }
    static get BG_RESET() { return "\x1b[49m"; }
    static get BG_RED() { return "\x1b[41m"; }
    static get BG_GREEN() { return "\x1b[42m"; }
    static get BG_YELLOW() { return "\x1b[43m"; }
    static get BG_BLUE() { return "\x1b[44m"; }
    static get BG_MAGENTA() { return "\x1b[45m"; }
    static get BG_CYAN() { return "\x1b[46m"; }
    static get BG_WHITE() { return "\x1b[47m"; }
    static get BOLD() { return "\x1b[1m"; }
    static get UNDERLINE() { return "\x1b[4m"; }
    static get REVERSED() { return "\x1b[7m"; }
}

module.exports = Color;