// js/algorithms.js

/**
 * First Fit: Mengalokasikan proses ke blok pertama yang muat.
 * @param {number[]} block_sizes - Ukuran blok memori.
 * @param {number[]} process_sizes - Ukuran proses.
 * @returns {object} Detail alokasi, status akhir blok, dan snapshot.
 */
export function firstFit(block_sizes, process_sizes) {
  let available = [...block_sizes]; // Salinan status memori
  const allocations = []; // Detail alokasi
  const states = []; // Snapshot status blok

  process_sizes.forEach((psize, i) => {
    let allocated = false;
    for (let j = 0; j < available.length; j++) {
      if (available[j] >= psize) {
        available[j] -= psize; // Alokasi memori
        const allocationObject = {
          processId: `P${i+1}`,
          processSize: psize,
          blockId: `B${j+1}`,
          allocatedSize: psize,
          remainingBlockSize: available[j],
          blockIndex: j
        };
        // Tandai P1 (ukuran 80) sebagai pra-alokasi
        if (i === 0 && psize === 80) {
          allocationObject.isPreallocated = true;
        }
        allocations.push(allocationObject);
        allocated = true;
        break; // Lanjut ke proses berikutnya
      }
    }
    if (!allocated) {
      // Proses tidak teralokasi
      const allocationObject = {
        processId: `P${i+1}`,
        processSize: psize,
        blockId: 'Unallocated'
      };
      if (i === 0 && psize === 80) {
        allocationObject.isPreallocated = true;
      }
      allocations.push(allocationObject);
    }
    states.push([...available]); // Rekam status blok
  });

  return { allocations, finalBlocks: available, blockStates: states };
}

/**
 * Best Fit: Mengalokasikan proses ke blok terkecil yang muat.
 * @param {number[]} block_sizes - Ukuran blok memori.
 * @param {number[]} process_sizes - Ukuran proses.
 * @returns {object} Detail alokasi, status akhir blok, dan snapshot.
 */
export function bestFit(block_sizes, process_sizes) {
  let available = [...block_sizes];
  const allocations = [];
  const states = [];

  process_sizes.forEach((psize, i) => {
    let bestIdx = -1;
    let min_remaining_size = Infinity;

    for (let j = 0; j < available.length; j++) {
      if (available[j] >= psize) {
        let remaining_size = available[j] - psize;
        if (remaining_size < min_remaining_size) {
          min_remaining_size = remaining_size;
          bestIdx = j;
        }
      }
    }

    if (bestIdx !== -1) {
      available[bestIdx] -= psize;
      const allocationObject = {
        processId: `P${i+1}`,
        processSize: psize,
        blockId: `B${bestIdx+1}`,
        allocatedSize: psize,
        remainingBlockSize: available[bestIdx],
        blockIndex: bestIdx
      };
      if (i === 0 && psize === 80) {
        allocationObject.isPreallocated = true;
      }
      allocations.push(allocationObject);
    } else {
      const allocationObject = {
        processId: `P${i+1}`,
        processSize: psize,
        blockId: 'Unallocated'
      };
      if (i === 0 && psize === 80) {
        allocationObject.isPreallocated = true;
      }
      allocations.push(allocationObject);
    }
    states.push([...available]);
  });
  return { allocations, finalBlocks: available, blockStates: states };
}

/**
 * Worst Fit: Mengalokasikan proses ke blok terbesar yang muat.
 * @param {number[]} block_sizes - Ukuran blok memori.
 * @param {number[]} process_sizes - Ukuran proses.
 * @returns {object} Detail alokasi, status akhir blok, dan snapshot.
 */
export function worstFit(block_sizes, process_sizes) {
  let available = [...block_sizes];
  const allocations = [];
  const states = [];

  process_sizes.forEach((psize, i) => {
    let worstIdx = -1;
    let max_remaining_size = -1;

    for (let j = 0; j < available.length; j++) {
      if (available[j] >= psize) {
        let remaining_size = available[j] - psize;
        if (remaining_size > max_remaining_size) {
          max_remaining_size = remaining_size;
          worstIdx = j;
        }
      }
    }

    if (worstIdx !== -1) {
      available[worstIdx] -= psize;
      const allocationObject = {
        processId: `P${i+1}`,
        processSize: psize,
        blockId: `B${worstIdx+1}`,
        allocatedSize: psize,
        remainingBlockSize: available[worstIdx],
        blockIndex: worstIdx
      };
      if (i === 0 && psize === 80) {
        allocationObject.isPreallocated = true;
      }
      allocations.push(allocationObject);
    } else {
      const allocationObject = {
        processId: `P${i+1}`,
        processSize: psize,
        blockId: 'Unallocated'
      };
      if (i === 0 && psize === 80) {
        allocationObject.isPreallocated = true;
      }
      allocations.push(allocationObject);
    }
    states.push([...available]);
  });
  return { allocations, finalBlocks: available, blockStates: states };
}