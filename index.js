import MMU from './src/memoryManagingUnit.js';
import Process from './src/process.js';
import PhysicalPage from './src/physicalPage.js';
import VirtualPage from './src/virtualPage.js';

function simulation(
  quant,
  tacts,
  workingSetSize,
  changeWorkingSetTime,
  maxProcessCount,
  physicalPageCount,
  processCreatingTime,
  processTimeToLive
) {
  const physicalMemory = [];
  const processes = [];

  let processId = 0;

  const processCreationFrequency = 1 / processCreatingTime;

  for (let i = 0; i < physicalPageCount; i++) {
    physicalMemory.push(new PhysicalPage(null));
  }

  let pageFaultCount = 0;
  const mmu = new MMU(physicalMemory, () => pageFaultCount++);

  for (let i = 0; i < tacts; i++) {
    if (processes.length) {
      const process = processes[0];
      let processTime =
        process.timeToLive < quant ? process.timeToLeave : quant;

      while (processTime !== 0) {
        const setType = Math.random() < 0.9; // true - working set; false - other set
        const operationType = Math.random < 0.72; // true - read; false - write
        let virtualPage;

        if (setType) {
          virtualPage =
            process.workingSet[
              Math.floor(Math.random() * process.workingSetSize)
            ];
        } else {
          virtualPage =
            process.virtualPages[
              Math.floor(Math.random() * process.virtualPages.length)
            ];
        }

        if (operationType) {
          mmu.read(virtualPage);
        } else {
          mmu.write(virtualPage);
        }

        if (process.timeToLive % changeWorkingSetTime === 0) {
          process.changeWorkingSet();
        }

        process.timeToLive--;
        i++;
        processTime--;
        if (i >= tacts) {
          break;
        }
      }

      processes.shift();

      // Round Robin
      if (process.timeToLive > 0) {
        processes.push(process);
      } else {
        for (const page of process.virtualPages) {
          mmu.free(page);
        }
      }
    }

    if (
      Math.random() < processCreationFrequency &&
      processes.length < maxProcessCount
    ) {
      const virtualPages = [];
      const virtualPagesCount =
        Math.floor(
          Math.random() * (physicalPageCount * 3 - workingSetSize + 1)
        ) + workingSetSize; // [min; max]

      for (let j = 0; j < virtualPagesCount; j++) {
        virtualPages.push(new VirtualPage(false, false, false, null));
      }

      processes.push(
        new Process(
          processId++,
          workingSetSize,
          processTimeToLive,
          virtualPages
        )
      );
    }
  }

  return pageFaultCount;
}

const quant = 10;
const tacts = 100000;
//const workingSetSize = 20;
const changeWorkingSetTime = 5;
const maxProcessCount = 25;
const physicalPageCount = 100;
const processCreatingTime = 10;
const processTimeToLive = 300;

for (let workingSetSize = 1; workingSetSize < 20; workingSetSize++) {
  const pageFaultCount = simulation(
    quant,
    tacts,
    workingSetSize,
    changeWorkingSetTime,
    maxProcessCount,
    physicalPageCount,
    processCreatingTime,
    processTimeToLive
  );

  console.log(workingSetSize, pageFaultCount);
}
