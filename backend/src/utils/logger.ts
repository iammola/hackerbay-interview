import chalk from "chalk";
import log from "loglevel";

export const start = (...message: T[]) => {
  log.info("-".repeat(10));
  log.info(time(), chalk.magenta(...message));
  return process.hrtime.bigint();
};

export const end = (start: bigint, ...message: T[]) =>
  log.info(
    time(),
    chalk.magenta(...message),
    " - ",
    chalk.white(
      `(Done in ${(process.hrtime.bigint() - start) / BigInt(1e6)}ms)`
    )
  );

export const success = (...message: T[]) =>
  log.info(time(), chalk.greenBright(...message));

export const info = (...message: T[]) =>
  log.info(time(), chalk.blueBright(...message));

export const warn = (...message: T[]) =>
  log.warn(time(), chalk.yellowBright(...message));

export const error = (...message: T[]) =>
  log.warn(time(), chalk.redBright(...message));

export const trace = (...message: T[]) =>
  log.trace(time(), chalk.white(...message));

const time = () =>
  `${chalk.white(new Date().toLocaleTimeString().replace(",", ""))} `;

type T = string | number;
