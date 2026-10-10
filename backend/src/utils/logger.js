/**
 * Structured Terminal Logger with Color & Timestamps
 */
const colors = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  emerald: "\x1b[38;2;16;185;129m",
  amber: "\x1b[38;2;245;158;11m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
  bold: "\x1b[1m",
};

const formatTime = () => new Date().toISOString().substring(11, 19);

const logger = {
  info: (msg, meta = "") => {
    console.log(`${colors.dim}[${formatTime()}]${colors.reset} ${colors.cyan}ℹ INFO${colors.reset}  ${msg} ${meta ? colors.dim + JSON.stringify(meta) + colors.reset : ""}`);
  },
  success: (msg, meta = "") => {
    console.log(`${colors.dim}[${formatTime()}]${colors.reset} ${colors.emerald}✔ SUCCESS${colors.reset} ${colors.bold}${msg}${colors.reset} ${meta ? colors.dim + JSON.stringify(meta) + colors.reset : ""}`);
  },
  warn: (msg, meta = "") => {
    console.log(`${colors.dim}[${formatTime()}]${colors.reset} ${colors.amber}⚠ WARN${colors.reset}  ${msg} ${meta ? colors.dim + JSON.stringify(meta) + colors.reset : ""}`);
  },
  error: (msg, meta = "") => {
    console.log(`${colors.dim}[${formatTime()}]${colors.reset} ${colors.red}✖ ERROR${colors.reset} ${msg} ${meta ? colors.dim + JSON.stringify(meta) + colors.reset : ""}`);
  },
  healing: (msg, meta = "") => {
    console.log(`${colors.dim}[${formatTime()}]${colors.reset} ${colors.amber}⚡ HEALING${colors.reset} ${colors.bold}${msg}${colors.reset} ${meta ? colors.dim + JSON.stringify(meta) + colors.reset : ""}`);
  },
  chaos: (msg, meta = "") => {
    console.log(`${colors.dim}[${formatTime()}]${colors.reset} ${colors.magenta}💥 CHAOS${colors.reset} ${colors.bold}${msg}${colors.reset} ${meta ? colors.dim + JSON.stringify(meta) + colors.reset : ""}`);
  }
};

module.exports = logger;
