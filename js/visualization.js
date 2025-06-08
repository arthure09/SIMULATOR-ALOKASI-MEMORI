// js/visualization.js

/**
 * Menghitung total ukuran semua blok untuk penskalaan visualisasi.
 * @param {number[]} blocks - Ukuran blok.
 * @returns {number} Jumlah semua ukuran blok.
 */
export function getMaxTotalSize(blocks) {
  return blocks.reduce((sum, b) => sum + b, 0);
}

/**
 * Membangun elemen DOM untuk blok memori.
 * @param {number} blockSize - Ukuran sisa blok.
 * @param {number} allocatedSize - Memori yang dialokasikan.
 * @param {boolean|string} isAllocated - Status alokasi.
 * @param {string} label - Label blok.
 * @param {number} maxTotalSize - Ukuran total semua blok awal.
 * @param {number} originalSize - Ukuran asli blok.
 * @param {boolean} isPreallocatedVisual - True jika ini visualisasi alokasi proses awal (80 unit).
 * @returns {HTMLElement} Elemen div blok memori.
 */
export function createMemoryBlockElement(
  blockSize, allocatedSize, isAllocated, label, maxTotalSize, originalSize, isPreallocatedVisual = false
) {
  const pct = (originalSize / maxTotalSize) * 100; // Lebar persentase
  const allocPct = (allocatedSize / originalSize) * 100; // Persentase ruang teralokasi
  const remPct = ((originalSize - allocatedSize) / originalSize) * 100; // Persentase ruang sisa

  const div = document.createElement('div');
  div.className = 'relative flex flex-col items-center justify-center p-2 rounded-lg shadow-md border';
  div.style.width = `${pct}%`;
  div.style.minWidth = '50px';
  div.style.height = '80px';
  div.style.margin = '0 2px';
  div.title = `${label}: Asli ${originalSize} unit (Sisa: ${blockSize} unit)`;

  let borderColor = 'border-gray-400';
  let blockBg = 'bg-gray-300'; // Latar belakang default
  let allocBg = 'bg-green-500'; // Warna bagian teralokasi
  let remBg = 'bg-blue-500'; // Warna bagian sisa

  // Sesuaikan warna berdasarkan status alokasi
  if (isAllocated === 'unallocated') {
    blockBg = 'bg-red-300';
    allocBg = 'bg-red-500';
    remBg = 'bg-red-500';
  } else if (isAllocated === false) {
    blockBg = 'bg-gray-300';
    allocBg = 'bg-gray-300';
    remBg = 'bg-gray-300';
  }

  // Jika proses awal teralokasi (80 unit), warnai merah
  if (isPreallocatedVisual) {
      allocBg = 'bg-red-500';
  }

  div.classList.add(borderColor);
  div.classList.add(blockBg);

  // Label dan ukuran asli
  const labelDiv = document.createElement('div');
  labelDiv.className = "text-sm font-semibold text-gray-800 z-10";
  labelDiv.textContent = label;
  div.appendChild(labelDiv);

  const sizeDiv = document.createElement('div');
  sizeDiv.className = "text-xs text-gray-600 z-10";
  sizeDiv.textContent = `${originalSize} unit`;
  div.appendChild(sizeDiv);

  // Visualisasi bagian teralokasi dan sisa
  if (isAllocated && allocatedSize > 0) {
    const allocatedPart = document.createElement('div');
    allocatedPart.className = `absolute top-0 left-0 h-full ${allocBg} rounded-lg`;
    allocatedPart.style.width = `${allocPct}%`;
    div.appendChild(allocatedPart);
  }

  if (isAllocated && (originalSize - allocatedSize) > 0) {
    const remainingPart = document.createElement('div');
    remainingPart.className = `absolute top-0 right-0 h-full ${remBg} rounded-lg`;
    remainingPart.style.width = `${remPct}%`;
    div.appendChild(remainingPart);
  }

  return div;
}

/**
 * Merender hasil simulasi algoritma alokasi memori.
 * @param {string} title - Judul algoritma.
 * @param {object} result - Objek hasil alokasi.
 * @param {number[]} initialBlocks - Ukuran blok memori awal.
 * @param {string} duration - Waktu eksekusi algoritma.
 * @returns {HTMLElement} Kontainer div hasil algoritma.
 */
export function renderSimulationResult(title, result, initialBlocks, duration) {
  const container = document.createElement('div');
  container.className = 'bg-white p-6 rounded-xl shadow-lg mb-8';

  container.innerHTML = `
    <h3 class="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-200">
      ${title}
    </h3>
    <p class="text-md text-gray-700 mb-4">
      Waktu Eksekusi: <span class="font-semibold text-blue-600">${duration} ms</span>
    </p>
    <div class="mb-4">
      <h4 class="text-lg font-semibold text-gray-700 mb-2">Status Memori Awal:</h4>
      <div id="${title.replace(/\s/g,'-')}-initial-blocks" class="flex flex-wrap justify-center items-end bg-gray-100 p-3 rounded-md min-h-[100px]"></div>
    </div>
    <div class="mb-4">
      <h4 class="text-lg font-semibold text-gray-700 mb-2">Alokasi:</h4>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white rounded-lg shadow-sm">
          <thead>
            <tr class="bg-blue-100 text-blue-800 uppercase text-sm">
              <th class="py-3 px-6 text-left">Proses</th>
              <th class="py-3 px-6 text-left">Ukuran</th>
              <th class="py-3 px-6 text-left">Dialokasikan Ke</th>
              <th class="py-3 px-6 text-left">Ukuran Blok Sisa</th>
            </tr>
          </thead>
          <tbody id="${title.replace(/\s/g,'-')}-table" class="text-gray-700 text-sm"></tbody>
        </table>
      </div>
    </div>
    <div>
      <h4 class="text-lg font-semibold text-gray-700 mb-2">Status Memori Akhir:</h4>
      <div id="${title.replace(/\s/g,'-')}-final-blocks" class="flex flex-wrap justify-center items-end bg-gray-100 p-3 rounded-md min-h-[100px]"></div>
    </div>
  `;

  const maxTotalInitialSize = getMaxTotalSize(initialBlocks);

  const initialBlocksDiv = container.querySelector(`#${title.replace(/\s/g,'-')}-initial-blocks`);
  initialBlocks.forEach((size,i) => {
    initialBlocksDiv.appendChild(createMemoryBlockElement(size, 0, false, `B${i+1}`, maxTotalInitialSize, size));
  });

  const tbody = container.querySelector(`#${title.replace(/\s/g,'-')}-table`);
  result.allocations.forEach(row => {
    const tr = document.createElement('tr');
    tr.className = 'border-b hover:bg-gray-100';
    let processIdClass = '';
    if (row.isPreallocated) {
        processIdClass = 'text-red-600 font-bold';
    }
    tr.innerHTML = `
      <td class="py-3 px-6 whitespace-nowrap ${processIdClass}">${row.processId}</td>
      <td class="py-3 px-6">${row.processSize}</td>
      <td class="py-3 px-6">
        ${row.blockId === 'Unallocated'
          ? `<span class="text-red-600 font-medium">${row.blockId}</span>`
          : row.blockId}
      </td>
      <td class="py-3 px-6">
        ${row.blockId === 'Unallocated' ? '-' : row.remainingBlockSize}
      </td>
    `;
    tbody.appendChild(tr);
  });

  const finalBlocksDiv = container.querySelector(`#${title.replace(/\s/g,'-')}-final-blocks`);
  result.finalBlocks.forEach((size,i) => {
    const orig = initialBlocks[i];
    const alloc = orig - size;

    // Periksa alokasi 'isPreallocated' ke blok ini
    const isPreallocatedVisual = result.allocations.some(
      a => a.blockIndex === i && a.isPreallocated === true
    );

    // Tentukan apakah blok ini dialokasikan
    const wasBlockAllocated = result.allocations.some(a => a.blockIndex === i && a.blockId !== 'Unallocated');

    finalBlocksDiv.appendChild(createMemoryBlockElement(size, alloc, wasBlockAllocated, `B${i+1}`, maxTotalInitialSize, orig, isPreallocatedVisual));
  });

  return container;
}