export default class PhysicalPage {
  constructor(virtualPage) {
    this.virtualPage = virtualPage;
  }

  inUse() {
    return this.virtualPage !== null;
  }
}
