// js/visualization.js

// Menghitung total ukuran semua blok untuk penskalaan visual.
export function getMaxTotalSize(blocks) {
  return blocks.reduce((sum, b) => sum + b, 0);
}

// Membuat satu elemen div HTML untuk merepresentasikan blok memori.
export function createMemoryBlockElement(
  blockSize, allocatedSize, isAllocated, label, maxTotalSize, originalSize
) {
  // Menghitung persentase lebar blok dan bagian terisi/sisa.
  const pct = (originalSize / maxTotalSize) * 100;
  const allocPct = (allocatedSize / originalSize) * 100;
  const remPct = ((originalSize - allocatedSize) / originalSize) * 100;

  const div = document.createElement('div'); // Membuat div blok.
  div.className = 'relative flex flex-col items-center justify-center p-2 rounded-lg shadow-md border';
  div.style.width = `${pct}%`;
  div.style.minWidth = '50px';
  div.style.height = '80px';
  div.style.margin = '0 2px';
  div.title = `${label}: Asli ${originalSize} unit (Sisa: ${blockSize} unit)`; // Tooltip info blok.

  // Menentukan warna blok berdasarkan status alokasi.
  let borderColor = 'border-gray-400';
  let blockBg = 'bg-gray-300';
  let allocBg = 'bg-green-500';
  let remBg = 'bg-blue-500';

  if (isAllocated === 'unallocated') { // Merah jika tidak dialokasikan.
    blockBg = 'bg-red-300';
    allocBg = 'bg-red-500';
    remBg = 'bg-red-500';
  } else if (isAllocated === false) { // Abu-abu untuk status awal/kosong.
    blockBg = 'bg-gray-300';
    allocBg = 'bg-gray-300';
    remBg = 'bg-gray-300';
  }

  div.classList.add(borderColor);
  div.classList.add(blockBg);

  // Menambahkan label dan ukuran asli blok ke dalam div.
  const labelDiv = document.createElement('div');
  labelDiv.className = "text-sm font-semibold text-gray-800 z-10";
  labelDiv.textContent = label;
  div.appendChild(labelDiv);

  const sizeDiv = document.createElement('div');
  sizeDiv.className = "text-xs text-gray-600 z-10";
  sizeDiv.textContent = `${originalSize} unit`;
  div.appendChild(sizeDiv);

  // Menambahkan visualisasi bagian yang dialokasikan (hijau) dan sisa (biru).
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

  return div; // Mengembalikan elemen blok yang sudah dibuat.
}

// Merender seluruh hasil simulasi untuk satu algoritma.
export function renderSimulationResult(title, result, initialBlocks) {
  const container = document.createElement('div'); // Membuat kontainer hasil.
  container.className = 'bg-white p-6 rounded-xl shadow-lg mb-8';

  // Mengisi HTML dasar kontainer dengan judul, area blok awal, tabel, dan area blok akhir.
  container.innerHTML = `
    <h3 class="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-200">
      ${title}
    </h3>
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

  // Menggambar blok memori awal.
  const initialBlocksDiv = container.querySelector(`#${title.replace(/\s/g,'-')}-initial-blocks`);
  initialBlocks.forEach((size,i) => {
    initialBlocksDiv.appendChild(createMemoryBlockElement(size, 0, false, `B${i+1}`, maxTotalInitialSize, size));
  });

  // Mengisi tabel detail alokasi.
  const allocationsTableBody = container.querySelector(`#${title.replace(/\s/g,'-')}-table`);
  result.allocations.forEach(row => {
    const tr = document.createElement('tr');
    tr.className = 'border-b hover:bg-gray-100';
    tr.innerHTML = `
      <td class="py-3 px-6 whitespace-nowrap">${row.processId}</td>
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
    allocationsTableBody.appendChild(tr);
  });

  // Menggambar blok memori akhir.
  const finalBlocksDiv = container.querySelector(`#${title.replace(/\s/g,'-')}-final-blocks`);
  result.finalBlocks.forEach((size,i) => {
    const orig = initialBlocks[i];
    const alloc = orig - size;
    const used = result.allocations.some(a => a.blockIndex === i && a.blockId !== 'Unallocated');
    finalBlocksDiv.appendChild(createMemoryBlockElement(size, alloc, used, `B${i+1}`, maxTotalInitialSize, orig));
  });

  return container; // Mengembalikan kontainer hasil.
}