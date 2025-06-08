// js/algorithms.js

/**
 * First Fit: mengalokasikan setiap proses di blok pertama yang muat.
 * @param {number[]} block_sizes - Array ukuran blok memori yang tersedia.
 * @param {number[]} process_sizes - Array ukuran proses yang akan dialokasikan.
 * @returns {{allocations: object[], finalBlocks: number[], blockStates: number[][]}}
 * Detail alokasi, status akhir blok, dan snapshot status blok.
 */
export function firstFit(block_sizes, process_sizes) {
  let available = [...block_sizes]; // Create a shallow copy to simulate memory state for this algorithm
  const allocations = []; // Stores details of each allocation (process, block, remaining size)
  const states = []; // 'states' variable is initialized here

  process_sizes.forEach((psize, i) => {
    let allocated = false;
    for (let j = 0; j < available.length; j++) {
      // Check if the current block is large enough for the process
      if (available[j] >= psize) {
        available[j] -= psize; // Allocate memory
        const allocationObject = {
          processId: `P${i+1}`,
          processSize: psize,
          blockId: `B${j+1}`,
          allocatedSize: psize, // Actual allocated size
          remainingBlockSize: available[j],
          blockIndex: j // Store original block index for visualization
        };
        // Mark as "pre-allocated" if this is the first process with size 80
        if (i === 0 && psize === 80) {
          allocationObject.isPreallocated = true;
        }
        allocations.push(allocationObject);
        allocated = true;
        break; // Move to the next process after finding the first fit
      }
    }
    if (!allocated) {
      // If no block was found, the process is unallocated
      const allocationObject = {
        processId: `P${i+1}`,
        processSize: psize,
        blockId: 'Unallocated'
      };
      // Mark as "pre-allocated" even if unallocated, if it's the specific initial process
      if (i === 0 && psize === 80) {
        allocationObject.isPreallocated = true;
      }
      allocations.push(allocationObject);
    }
    // Record the current state of blocks after this process's attempt
    states.push([...available]);
  });

  // Return object with 'blockStates' referring to the declared 'states' array
  return { allocations, finalBlocks: available, blockStates: states };
}

/**
 * Best Fit: mengalokasikan setiap proses di blok terkecil yang muat.
 * @param {number[]} block_sizes - Array ukuran blok memori yang tersedia.
 * @param {number[]} process_sizes - Array ukuran proses yang akan dialokasikan.
 * @returns {{allocations: object[], finalBlocks: number[], blockStates: number[][]}}
 * Detail alokasi, status akhir blok, dan snapshot status blok.
 */
export function bestFit(block_sizes, process_sizes) {
  let available = [...block_sizes];
  const allocations = [];
  const states = []; // 'states' variable is initialized here

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
 * Worst Fit: mengalokasikan setiap proses di blok terbesar yang muat.
 * @param {number[]} block_sizes - Array ukuran blok memori yang tersedia.
 * @param {number[]} process_sizes - Array ukuran proses yang akan dialokasikan.
 * @returns {{allocations: object[], finalBlocks: number[], blockStates: number[][]}}
 * Detail alokasi, status akhir blok, dan snapshot status blok.
 */
export function worstFit(block_sizes, process_sizes) {
  let available = [...block_sizes];
  const allocations = [];
  const states = []; // 'states' variable is initialized here

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
