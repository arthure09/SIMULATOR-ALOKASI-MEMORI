// js/visualization.js

/**
 * Menghitung total ukuran semua blok untuk penskalaan yang konsisten dalam visualisasi.
 * @param {number[]} blocks - Array ukuran blok.
 * @returns {number} Jumlah semua ukuran blok.
 */
export function getMaxTotalSize(blocks) {
  return blocks.reduce((sum, b) => sum + b, 0);
}

/**
 * Membangun elemen DOM tunggal yang mewakili blok memori.
 * @param {number} blockSize - Ukuran sisa blok saat ini.
 * @param {number} allocatedSize - Jumlah memori yang dialokasikan ke blok ini.
 * @param {boolean|string} isAllocated - True jika dialokasikan, false jika awal/kosong, 'unallocated' untuk proses yang tidak muat.
 * @param {string} label - Label untuk blok (misalnya, "B1").
 * @param {number} maxTotalSize - Ukuran total semua blok awal untuk penskalaan.
 * @param {number} originalSize - Ukuran asli blok ini sebelum alokasi.
 * @param {boolean} isPreallocatedVisual - True jika ini adalah visualisasi alokasi proses awal (80 unit).
 * @returns {HTMLElement} Elemen div yang dibuat untuk blok memori.
 */
export function createMemoryBlockElement(
  blockSize, allocatedSize, isAllocated, label, maxTotalSize, originalSize, isPreallocatedVisual = false
) {
  // Hitung lebar persentase berdasarkan ukuran blok asli relatif terhadap total memori awal
  const pct = (originalSize / maxTotalSize) * 100;
  // Hitung persentase ruang yang dialokasikan dalam blok spesifik ini
  const allocPct = (allocatedSize / originalSize) * 100;
  // Hitung persentase ruang sisa (bebas) dalam blok spesifik ini
  const remPct = ((originalSize - allocatedSize) / originalSize) * 100;

  const div = document.createElement('div');
  div.className = 'relative flex flex-col items-center justify-center p-2 rounded-lg shadow-md border';
  div.style.width = `${pct}%`; // Set width based on original size
  div.style.minWidth = '50px'; // Ensure minimum visibility for small blocks
  div.style.height = '80px';
  div.style.margin = '0 2px';
  // Add a title for hover information
  div.title = `${label}: Asli ${originalSize} unit (Sisa: ${blockSize} unit)`;

  // Tentukan warna untuk status yang berbeda
  let borderColor = 'border-gray-400';
  let blockBg = 'bg-gray-300'; // Default background for the entire block
  let allocBg = 'bg-green-500'; // Color for allocated portion
  let remBg = 'bg-blue-500'; // Color for remaining (free) portion

  // Sesuaikan warna berdasarkan status alokasi
  if (isAllocated === 'unallocated') {
    blockBg = 'bg-red-300'; // Indicate a block that couldn't be allocated to
    allocBg = 'bg-red-500';
    remBg = 'bg-red-500';
  } else if (isAllocated === false) {
    // For initial blocks or blocks that were never allocated to
    blockBg = 'bg-gray-300';
    allocBg = 'bg-gray-300'; // No distinct allocated part visually for initial state
    remBg = 'bg-gray-300'; // No distinct remaining part visually for initial state
  }

  // Jika ini adalah proses yang dialokasikan di awal (80 unit), warnai merah
  if (isPreallocatedVisual) {
      allocBg = 'bg-red-500'; // Gunakan warna merah untuk bagian yang dialokasikan
  }


  div.classList.add(borderColor);
  div.classList.add(blockBg); // Apply the main background color

  // Label (e.g., B1) and original size text
  const labelDiv = document.createElement('div');
  labelDiv.className = "text-sm font-semibold text-gray-800 z-10";
  labelDiv.textContent = label;
  div.appendChild(labelDiv);

  const sizeDiv = document.createElement('div');
  sizeDiv.className = "text-xs text-gray-600 z-10";
  sizeDiv.textContent = `${originalSize} unit`;
  div.appendChild(sizeDiv);

  // Memvisualisasikan bagian yang dialokasikan dan sisa sebagai div internal
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
 * Merender hasil simulasi untuk algoritma alokasi memori tertentu.
 * Membuat dan menambahkan elemen HTML untuk menampilkan status memori awal,
 * tabel alokasi, dan status memori akhir.
 * @param {string} title - Judul algoritma (misalnya, "Algoritma First Fit").
 * @param {object} result - Objek hasil dari algoritma alokasi (allocations, finalBlocks).
 * @param {number[]} initialBlocks - Ukuran blok memori awal untuk visualisasi yang konsisten.
 * @param {string} duration - Waktu eksekusi algoritma dalam milidetik.
 * @returns {HTMLElement} Elemen div kontainer yang menampung semua hasil untuk algoritma ini.
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
    // Menambahkan kelas CSS untuk warna merah pada ProcessId jika isPreallocated
    let processIdClass = '';
    if (row.isPreallocated) {
        processIdClass = 'text-red-600 font-bold'; // Gaya untuk P1 yang pre-allocated
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

    // Perbaikan di sini: Periksa apakah ADA alokasi ke blok ini yang ditandai sebagai 'isPreallocated'
    const isPreallocatedVisual = result.allocations.some(
      a => a.blockIndex === i && a.isPreallocated === true
    );

    // Tentukan apakah blok ini dialokasikan sama sekali (tidak harus oleh P1)
    const wasBlockAllocated = result.allocations.some(a => a.blockIndex === i && a.blockId !== 'Unallocated');

    finalBlocksDiv.appendChild(createMemoryBlockElement(size, alloc, wasBlockAllocated, `B${i+1}`, maxTotalInitialSize, orig, isPreallocatedVisual));
  });

  return container;
}
