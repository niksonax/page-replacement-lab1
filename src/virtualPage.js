export default class VirtualPage {
  constructor(presenceBit, referenceBit, modificationBit, physicalPageNumber) {
    this.presenceBit = presenceBit;
    this.referenceBit = referenceBit;
    this.modificationBit = modificationBit;
    this.physicalPageNumber = physicalPageNumber;
  }
}
