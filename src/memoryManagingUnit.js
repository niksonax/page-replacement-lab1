export default class MMU {
  constructor(physicalMemory, onPageFault) {
    this.physicalMemory = physicalMemory; // RAM
    this.pageIndex = 0;
    this.onPageFault = onPageFault;
  }

  _getPhysicalPage(virtualPage) {
    if (virtualPage.physicalPageNumber !== null && virtualPage.presenceBit) {
      return this.physicalMemory[virtualPage.physicalPageNumber];
    } else {
      for (let i = 0; i < this.physicalMemory.length; i++) {
        const page =
          this.physicalMemory[this.pageIndex++ % this.physicalMemory.length];

        if (!page.inUse()) {
          page.virtualPage = virtualPage;
          virtualPage.physicalPageNumber = i;
          virtualPage.presenceBit = true;

          return page;
        } else if (!page.referenceBit) {
          this.onPageFault();

          page.virtualPage.presenceBit = false; // Swap (page fault)
          page.virtualPage.physicalPageNumber = null;
          page.virtualPage = virtualPage;
          virtualPage.physicalPageNumber = i;
          virtualPage.presenceBit = true;

          return page;
        } else {
          virtualPage.referenceBit = false;
        }

        this.pageIndex = this.pageIndex % this.physicalMemory.length;
      }
    }
  }

  read(virtualPage) {
    const physicalPage = this._getPhysicalPage(virtualPage);
    virtualPage.referenceBit = true;
  }

  write(virtualPage) {
    const physicalPage = this._getPhysicalPage(virtualPage);
    virtualPage.referenceBit = true;
    virtualPage.modificationBit = true;
  }

  free(virtualPage) {
    if (virtualPage.presenceBit) {
      const physicalPage = this.physicalMemory[virtualPage.physicalPageNumber];
      physicalPage.virtualPage = null;
    }
  }
}
