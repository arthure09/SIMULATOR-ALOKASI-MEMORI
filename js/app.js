// js/app.js

// Impor fungsi-fungsi yang diperlukan dari file lain.
import { firstFit, bestFit, worstFit } from './algorithms.js';
import { getMaxTotalSize, createMemoryBlockElement, renderSimulationResult } from './visualization.js';

// Dapatkan referensi ke elemen-elemen HTML di halaman.
const numBlocksInput    = document.getElementById('numBlocksInput');
const blockSizesInput   = document.getElementById('blockSizesInput');
const processSizesInput = document.getElementById('processSizesInput');
const runBtn            = document.getElementById('runSimulationBtn');
const resetBtn          = document.getElementById('resetSimulationBtn');
const errorDiv          = document.getElementById('error-message');
const errorText         = document.getElementById('error-text');
const resultsContainer  = document.getElementById('results-container');

let initialBlockSizes = []; // Ukuran blok memori awal.
let processSizes = []; // Ukuran proses yang akan dialokasikan.

/**
 * Membaca, mengurai, dan memvalidasi input pengguna.
 * Mengembalikan true jika valid, false jika ada error.
 */
function parseInputs() {
  errorDiv.classList.add('hidden'); // Sembunyikan error.
  errorText.textContent = '';

  try {
    const n = parseInt(numBlocksInput.value); // Ambil jumlah blok.
    if (isNaN(n) || n < 0) throw new Error('Jumlah blok harus ≥ 0'); // Validasi jumlah blok.

    const blocks = blockSizesInput.value
      .split(',').map(s => { // Urai ukuran blok.
        const v = parseInt(s.trim());
        if (isNaN(v) || v <= 0) throw new Error('Ukuran blok harus > 0'); // Validasi ukuran blok.
        return v;
      });

    if (n > 0) { // Jika 'n' diisi, sesuaikan atau buat blok acak.
      if (blocks.length !== n) {
        initialBlockSizes = Array.from({length:n},()=>Math.floor(Math.random()*500)+100); // Buat blok acak.
        blockSizesInput.value = initialBlockSizes.join(', '); // Perbarui input.
      } else {
        initialBlockSizes = blocks;
      }
    } else {
      initialBlockSizes = blocks;
    }

    processSizes = processSizesInput.value
      .split(',').map(s => { // Urai ukuran proses.
        const v = parseInt(s.trim());
        if (isNaN(v)||v<=0) throw new Error('Ukuran proses harus > 0'); // Validasi ukuran proses.
        return v;
      });

    if (initialBlockSizes.length === 0) throw new Error('Sediakan setidaknya satu blok'); // Pastikan ada blok.
    if (processSizes.length === 0) throw new Error('Sediakan setidaknya satu proses'); // Pastikan ada proses.

    return true; // Input valid.
  } catch(err) {
    errorText.textContent = err.message; // Tampilkan error.
    errorDiv.classList.remove('hidden');
    return false;
  }
}

/**
 * Menjalankan semua algoritma alokasi memori dan menampilkan hasilnya.
 */
function runSimulations() {
  if (!parseInputs()) return; // Hentikan jika input tidak valid.
  resultsContainer.innerHTML = ''; // Hapus hasil lama.

  // Jalankan dan tampilkan hasil First Fit.
  const ff = firstFit(initialBlockSizes, processSizes);
  resultsContainer.appendChild(renderSimulationResult('FIRST FIT', ff, initialBlockSizes));

  // Jalankan dan tampilkan hasil Best Fit.
  const bf = bestFit(initialBlockSizes, processSizes);
  resultsContainer.appendChild(renderSimulationResult('BEST FIT', bf, initialBlockSizes));

  // Jalankan dan tampilkan hasil Worst Fit.
  const wf = worstFit(initialBlockSizes, processSizes);
  resultsContainer.appendChild(renderSimulationResult('WORST FIT', wf, initialBlockSizes));
}

/**
 * Mengatur ulang semua input dan tampilan ke kondisi awal.
 */
function resetSimulation() {
  numBlocksInput.value = ''; // Kosongkan input.
  blockSizesInput.value = '';
  processSizesInput.value = '';
  errorDiv.classList.add('hidden'); errorText.textContent = ''; // Sembunyikan error.
  resultsContainer.innerHTML = `
    <p class="text-center text-gray-600 text-lg py-10">
      Masukkan ukuran blok memori dan proses di atas, lalu klik "Jalankan Simulasi".
    </p>
  `; // Pesan awal.
  parseInputs(); // Reset status internal.
}

// Menambahkan pemicu event ke tombol.
runBtn.addEventListener('click', runSimulations); // Klik "Jalankan" untuk simulasi.
resetBtn.addEventListener('click', resetSimulation); // Klik "Reset" untuk mengatur ulang.

// Membaca input saat halaman dimuat pertama kali.
document.addEventListener('DOMContentLoaded', parseInputs);