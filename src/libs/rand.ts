const Rand = {
  rtlb: ["right", "top", "left", "bottom"] as const,
  randomIntInRange: function (max: number, min = 0) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  randomChoice: function <T>(choices: T[]): T {
    return choices[this.randomIntInRange(choices.length - 1)];
  },
  randomDirection: function () {
    return this.rtlb[this.randomIntInRange(this.rtlb.length - 1)];
  },
  throwEvent: function (percentage: number, fn: () => void) {
    if (this.randomIntInRange(100) < percentage) {
      fn();
    }
  },
  throwEventInRange: function (
    num: number,
    range: [number, number],
    percentage: number,
    fn: () => void
  ) {
    if (num < range[0] || num > range[1]) return;

    this.throwEvent(percentage, fn);
  },
};

export default Rand;
