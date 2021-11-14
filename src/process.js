export default class Process {
  constructor(processId, workingSetSize, timeToLive, virtualPages) {
    this.processId = processId;
    this.workingSetSize = workingSetSize;
    this.timeToLive = timeToLive;
    this.virtualPages = virtualPages;

    this.workingSet = [];
    this.changeWorkingSet();
  }

  changeWorkingSet() {
    const virtualPagesCopy = this.virtualPages.slice();
    virtualPagesCopy.sort(() => (Math.random() > 0.5 ? 1 : -1));
    this.workingSet = virtualPagesCopy.slice(0, this.workingSetSize);
  }
}
