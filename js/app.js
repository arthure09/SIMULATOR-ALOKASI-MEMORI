// js/app.js

// Impor fungsi
import { firstFit, bestFit, worstFit } from './algorithms.js';
import { renderSimulationResult } from './visualization.js';

// Dapatkan elemen DOM
const numBlocksInput    = document.getElementById('numBlocksInput');
const blockSizesInput   = document.getElementById('blockSizesInput');
const processSizesInput = document.getElementById('processSizesInput');
const runBtn            = document.getElementById('runSimulationBtn');
const resetBtn          = document.getElementById('resetSimulationBtn');
const errorDiv          = document.getElementById('error-message');
const errorText         = document.getElementById('error-text');
const resultsContainer  = document.getElementById('results-container');

let initialBlockSizes = [];
let processSizes = [];

/**
 * Mengurai dan memvalidasi input pengguna.
 * @returns {boolean} True jika input valid, false jika tidak.
 */
function parseInputs() {
  errorDiv.classList.add('hidden'); // Sembunyikan kesalahan sebelumnya
  errorText.textContent = '';

  try {
    const n = parseInt(numBlocksInput.value);
    // Validasi jumlah blok
    if (numBlocksInput.value !== '' && (isNaN(n) || n < 0)) throw new Error('Jumlah blok harus ≥ 0 atau kosong');

    const blocks = blockSizesInput.value
      .split(',').map(s => {
        const v = parseInt(s.trim());
        if (isNaN(v) || v <= 0) throw new Error('Ukuran blok harus > 0');
        return v;
      });

    if (n > 0) {
      if (blocks.length !== n) {
        // Hasilkan blok acak jika jumlah tidak cocok
        initialBlockSizes = Array.from({length:n},()=>Math.floor(Math.random()*1000)+100);
        blockSizesInput.value = initialBlockSizes.join(', '); // Perbarui input
      } else {
        initialBlockSizes = blocks;
      }
    } else { // n adalah 0 atau kosong
      initialBlockSizes = blocks;
    }

    processSizes = processSizesInput.value
      .split(',').map(s => {
        const v = parseInt(s.trim());
        if (isNaN(v)||v<=0) throw new Error('Ukuran proses harus > 0');
        return v;
      });

    // Periksa input kosong tapi tidak valid
    if (initialBlockSizes.length === 0 && blockSizesInput.value !== '') throw new Error('Sediakan setidaknya satu blok atau kosongkan bidang ukuran blok');
    if (processSizes.length === 0 && processSizesInput.value !== '') throw new Error('Sediakan setidaknya satu proses atau kosongkan bidang ukuran proses');

    return true;
  } catch(err) {
    errorText.textContent = err.message;
    errorDiv.classList.remove('hidden');
    return false;
  }
}

/**
 * Menjalankan ketiga algoritma dan merender hasilnya.
 */
function runSimulations() {
  if (!parseInputs()) return; // Hentikan jika input tidak valid
  resultsContainer.innerHTML = ''; // Hapus hasil sebelumnya

  // Jalankan First Fit
  const startFf = performance.now();
  const ff = firstFit(initialBlockSizes, processSizes);
  const endFf = performance.now();
  const durationFf = (endFf - startFf).toFixed(2);
  resultsContainer.appendChild(renderSimulationResult('Algoritma First Fit', ff, initialBlockSizes, durationFf));

  // Jalankan Best Fit
  const startBf = performance.now();
  const bf = bestFit(initialBlockSizes, processSizes);
  const endBf = performance.now();
  const durationBf = (endBf - startBf).toFixed(2);
  resultsContainer.appendChild(renderSimulationResult('Algoritma Best Fit', bf, initialBlockSizes, durationBf));

  // Jalankan Worst Fit
  const startWf = performance.now();
  const wf = worstFit(initialBlockSizes, processSizes);
  const endWf = performance.now();
  const durationWf = (endWf - startWf).toFixed(2);
  resultsContainer.appendChild(renderSimulationResult('Algoritma Worst Fit', wf, initialBlockSizes, durationWf));
}

/**
 * Mengatur ulang input ke nilai default.
 */
function resetSimulation() {
  numBlocksInput.value = '1000';
  blockSizesInput.value = '100, 500, 200, 300, 600';
  processSizesInput.value = '212, 417, 112, 426, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300';
  errorDiv.classList.add('hidden');
  errorText.textContent = '';
  resultsContainer.innerHTML = `
    <p class="text-center text-gray-600 text-lg py-10">
      Masukkan ukuran blok memori dan proses di atas, lalu klik "Jalankan Simulasi".
    </p>
  `;
  parseInputs();
}

// Tambahkan event listener
runBtn.addEventListener('click', runSimulations);
resetBtn.addEventListener('click', resetSimulation);

// Uraikan input awal saat halaman dimuat
document.addEventListener('DOMContentLoaded', parseInputs);