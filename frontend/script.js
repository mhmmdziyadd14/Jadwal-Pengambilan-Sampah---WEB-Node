// API Base URL
const API_URL = 'http://localhost:5000/api';

// Data storage
let rumahList = [];
let petugasList = [];
let jadwalList = [];
let deleteTarget = null;

// Calendar variables
let currentDate = new Date();

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load tab click handlers
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });

    // Load initial data
    loadRumah();
    loadPetugas();
    loadJadwal();
    renderCalendar();
}

// ===== TAB SWITCHING =====
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');

    // Add active to clicked button
    event.target.closest('.tab-btn').classList.add('active');

    // Reload data if needed
    if (tabName === 'jadwal') {
        renderCalendar();
    }
}

// ===== RUMAH FUNCTIONS =====
async function loadRumah() {
    try {
        const response = await fetch(`${API_URL}/rumah`);
        rumahList = await response.json();
        renderRumahTable();
        updateRumahSelect();
    } catch (error) {
        console.error('Error loading rumah:', error);
        showNotification('Gagal memuat data rumah', 'error');
    }
}

function renderRumahTable() {
    const tbody = document.getElementById('rumahTable');
    
    if (rumahList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Belum ada data rumah</td></tr>';
        return;
    }

    tbody.innerHTML = rumahList.map((rumah, index) => {
        const fotoHtml = rumah.foto_url ? 
            `<img src="${rumah.foto_url}" alt="Foto" style="width: 60px; height: 60px; border-radius: 4px; object-fit: cover;">` :
            '<span style="color: #ddd;">No Photo</span>';
        
        return `
        <tr>
            <td>${index + 1}</td>
            <td>${fotoHtml}</td>
            <td><strong>${rumah.nama_pemilik}</strong></td>
            <td>${rumah.alamat}</td>
            <td>${rumah.nomor_telepon}</td>
            <td><span class="badge badge-success">${rumah.zona_pengambilan}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-warning" onclick="editRumah(${rumah.id_rumah})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteRumah(${rumah.id_rumah})">Hapus</button>
                </div>
            </td>
        </tr>
    `}).join('');
}

function updateRumahSelect() {
    const select = document.getElementById('idRumah');
    select.innerHTML = '<option value="">-- Pilih Rumah --</option>' +
        rumahList.map(rumah => 
            `<option value="${rumah.id_rumah}">${rumah.nama_pemilik} - ${rumah.alamat}</option>`
        ).join('');
}

function openRumahModal() {
    document.getElementById('rumahId').value = '';
    document.getElementById('rumahForm').reset();
    document.getElementById('rumahModalTitle').textContent = 'Tambah Rumah';
    document.getElementById('rumahModal').classList.add('show');
}

function closeRumahModal() {
    document.getElementById('rumahModal').classList.remove('show');
}

function editRumah(id) {
    const rumah = rumahList.find(r => r.id_rumah === id);
    if (!rumah) return;

    document.getElementById('rumahId').value = rumah.id_rumah;
    document.getElementById('namaPemilik').value = rumah.nama_pemilik;
    document.getElementById('alamat').value = rumah.alamat;
    document.getElementById('nomorTelepon').value = rumah.nomor_telepon;
    document.getElementById('zona').value = rumah.zona_pengambilan;
    document.getElementById('rumahFotoUrl').value = rumah.foto_url || '';
    
    // Tampilkan preview foto jika ada
    const previewDiv = document.getElementById('rumahFotoPreview');
    if (rumah.foto_url) {
        previewDiv.innerHTML = `<img src="${rumah.foto_url}" alt="Foto" style="max-width: 150px; border-radius: 4px;">`;
    } else {
        previewDiv.innerHTML = '';
    }
    
    document.getElementById('rumahModalTitle').textContent = 'Edit Rumah';
    document.getElementById('rumahModal').classList.add('show');
}

async function saveRumah(event) {
    event.preventDefault();

    const id = document.getElementById('rumahId').value;
    const formData = new FormData();
    
    formData.append('nama_pemilik', document.getElementById('namaPemilik').value);
    formData.append('alamat', document.getElementById('alamat').value);
    formData.append('nomor_telepon', document.getElementById('nomorTelepon').value);
    formData.append('zona_pengambilan', document.getElementById('zona').value);
    
    // Tambah foto jika ada file baru
    const fotoFile = document.getElementById('rumahFoto').files[0];
    if (fotoFile) {
        formData.append('foto', fotoFile);
    } else if (id) {
        // Jika edit tapi tidak upload foto baru, kirim foto lama
        const existingFotoUrl = document.getElementById('rumahFotoUrl').value;
        if (existingFotoUrl) {
            formData.append('foto_url', existingFotoUrl);
        }
    }

    try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_URL}/rumah/${id}` : `${API_URL}/rumah`;

        const response = await fetch(url, {
            method: method,
            body: formData
        });

        if (response.ok) {
            showNotification(id ? 'Data rumah berhasil diupdate' : 'Data rumah berhasil ditambahkan', 'success');
            closeRumahModal();
            loadRumah();
        } else {
            throw new Error('Gagal menyimpan data');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Gagal menyimpan data rumah', 'error');
    }
}

function deleteRumah(id) {
    deleteTarget = { type: 'rumah', id: id };
    const rumah = rumahList.find(r => r.id_rumah === id);
    document.getElementById('confirmMessage').textContent = 
        `Apakah Anda yakin ingin menghapus data rumah milik ${rumah.nama_pemilik}?`;
    document.getElementById('confirmModal').classList.add('show');
}

// ===== PETUGAS FUNCTIONS =====
async function loadPetugas() {
    try {
        const response = await fetch(`${API_URL}/petugas`);
        petugasList = await response.json();
        renderPetugasTable();
        updatePetugasSelect();
    } catch (error) {
        console.error('Error loading petugas:', error);
        showNotification('Gagal memuat data petugas', 'error');
    }
}

function renderPetugasTable() {
    const tbody = document.getElementById('petugasTable');
    
    if (petugasList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Belum ada data petugas</td></tr>';
        return;
    }

    tbody.innerHTML = petugasList.map((petugas, index) => {
        const fotoHtml = petugas.foto_url ? 
            `<img src="${petugas.foto_url}" alt="Foto" style="width: 60px; height: 60px; border-radius: 4px; object-fit: cover;">` :
            '<span style="color: #ddd;">No Photo</span>';
        
        return `
        <tr>
            <td>${index + 1}</td>
            <td>${fotoHtml}</td>
            <td><strong>${petugas.nama_petugas}</strong></td>
            <td>${petugas.nomor_telepon}</td>
            <td><span class="badge badge-success">${petugas.zona_wilayah}</span></td>
            <td><span class="status-${petugas.status}">${petugas.status === 'aktif' ? '✓ Aktif' : '✗ Nonaktif'}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-warning" onclick="editPetugas(${petugas.id_petugas})">Edit</button>
                    <button class="btn btn-danger" onclick="deletePetugas(${petugas.id_petugas})">Hapus</button>
                </div>
            </td>
        </tr>
    `}).join('');
}

function updatePetugasSelect() {
    const select = document.getElementById('idPetugas');
    select.innerHTML = '<option value="">-- Pilih Petugas --</option>' +
        petugasList.filter(p => p.status === 'aktif').map(petugas => 
            `<option value="${petugas.id_petugas}">${petugas.nama_petugas} (${petugas.zona_wilayah})</option>`
        ).join('');
}

function openPetugasModal() {
    document.getElementById('petugasId').value = '';
    document.getElementById('petugasForm').reset();
    document.getElementById('petugasModalTitle').textContent = 'Tambah Petugas';
    document.getElementById('petugasModal').classList.add('show');
}

function closePetugasModal() {
    document.getElementById('petugasModal').classList.remove('show');
}

function editPetugas(id) {
    const petugas = petugasList.find(p => p.id_petugas === id);
    if (!petugas) return;

    document.getElementById('petugasId').value = petugas.id_petugas;
    document.getElementById('namaPetugas').value = petugas.nama_petugas;
    document.getElementById('noTeleponPetugas').value = petugas.nomor_telepon;
    document.getElementById('zonaWilayah').value = petugas.zona_wilayah;
    document.getElementById('status').value = petugas.status;
    document.getElementById('petugasFotoUrl').value = petugas.foto_url || '';
    
    // Tampilkan preview foto jika ada
    const previewDiv = document.getElementById('petugasFotoPreview');
    if (petugas.foto_url) {
        previewDiv.innerHTML = `<img src="${petugas.foto_url}" alt="Foto" style="max-width: 150px; border-radius: 4px;">`;
    } else {
        previewDiv.innerHTML = '';
    }
    
    document.getElementById('petugasModalTitle').textContent = 'Edit Petugas';
    document.getElementById('petugasModal').classList.add('show');
}

async function savePetugas(event) {
    event.preventDefault();

    const id = document.getElementById('petugasId').value;
    const formData = new FormData();
    
    formData.append('nama_petugas', document.getElementById('namaPetugas').value);
    formData.append('nomor_telepon', document.getElementById('noTeleponPetugas').value);
    formData.append('zona_wilayah', document.getElementById('zonaWilayah').value);
    formData.append('status', document.getElementById('status').value);
    
    // Tambah foto jika ada file baru
    const fotoFile = document.getElementById('petugasFoto').files[0];
    if (fotoFile) {
        formData.append('foto', fotoFile);
    } else if (id) {
        // Jika edit tapi tidak upload foto baru, kirim foto lama
        const existingFotoUrl = document.getElementById('petugasFotoUrl').value;
        if (existingFotoUrl) {
            formData.append('foto_url', existingFotoUrl);
        }
    }

    try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_URL}/petugas/${id}` : `${API_URL}/petugas`;

        const response = await fetch(url, {
            method: method,
            body: formData
        });

        if (response.ok) {
            showNotification(id ? 'Data petugas berhasil diupdate' : 'Data petugas berhasil ditambahkan', 'success');
            closePetugasModal();
            loadPetugas();
        } else {
            throw new Error('Gagal menyimpan data');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Gagal menyimpan data petugas', 'error');
    }
}

function deletePetugas(id) {
    deleteTarget = { type: 'petugas', id: id };
    const petugas = petugasList.find(p => p.id_petugas === id);
    document.getElementById('confirmMessage').textContent = 
        `Apakah Anda yakin ingin menghapus data petugas ${petugas.nama_petugas}?`;
    document.getElementById('confirmModal').classList.add('show');
}

// ===== JADWAL FUNCTIONS =====
async function loadJadwal() {
    try {
        const response = await fetch(`${API_URL}/jadwal`);
        jadwalList = await response.json();
        renderJadwalTable();
    } catch (error) {
        console.error('Error loading jadwal:', error);
        showNotification('Gagal memuat data jadwal', 'error');
    }
}

async function loadJadwalByMonth() {
    const monthInput = document.getElementById('filterBulan').value;
    if (!monthInput) {
        loadJadwal();
        return;
    }

    const [tahun, bulan] = monthInput.split('-');
    try {
        const response = await fetch(`${API_URL}/jadwal/bulan/${tahun}/${bulan}`);
        jadwalList = await response.json();
        renderJadwalTable();
        renderCalendar();
    } catch (error) {
        console.error('Error loading jadwal by month:', error);
        showNotification('Gagal memuat data jadwal', 'error');
    }
}

function renderJadwalTable() {
    const tbody = document.getElementById('jadwalTable');
    
    if (jadwalList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Belum ada jadwal pengambilan</td></tr>';
        return;
    }

    tbody.innerHTML = jadwalList.map((jadwal, index) => `
        <tr>
            <td>${index + 1}</td>
            <td><strong>${formatDate(jadwal.tanggal_pengambilan)}</strong></td>
            <td>${jadwal.nama_pemilik || '-'}</td>
            <td>${jadwal.alamat || '-'}</td>
            <td>${jadwal.nama_petugas || '-'}</td>
            <td>${jadwal.keterangan || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-warning" onclick="editJadwal(${jadwal.id_jadwal})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteJadwal(${jadwal.id_jadwal})">Hapus</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openJadwalModal() {
    document.getElementById('jadwalId').value = '';
    document.getElementById('jadwalForm').reset();
    document.getElementById('jadwalModalTitle').textContent = 'Tambah Jadwal';
    document.getElementById('jadwalModal').classList.add('show');
}

function closeJadwalModal() {
    document.getElementById('jadwalModal').classList.remove('show');
}

function editJadwal(id) {
    const jadwal = jadwalList.find(j => j.id_jadwal === id);
    if (!jadwal) return;

    document.getElementById('jadwalId').value = jadwal.id_jadwal;
    document.getElementById('idRumah').value = jadwal.id_rumah;
    document.getElementById('idPetugas').value = jadwal.id_petugas;
    document.getElementById('tanggalPengambilan').value = jadwal.tanggal_pengambilan;
    document.getElementById('keterangan').value = jadwal.keterangan || '';
    document.getElementById('jadwalModalTitle').textContent = 'Edit Jadwal';
    document.getElementById('jadwalModal').classList.add('show');
}

async function saveJadwal(event) {
    event.preventDefault();

    const id = document.getElementById('jadwalId').value;
    const data = {
        id_rumah: document.getElementById('idRumah').value,
        id_petugas: document.getElementById('idPetugas').value,
        tanggal_pengambilan: document.getElementById('tanggalPengambilan').value,
        keterangan: document.getElementById('keterangan').value
    };

    try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_URL}/jadwal/${id}` : `${API_URL}/jadwal`;

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showNotification(id ? 'Data jadwal berhasil diupdate' : 'Data jadwal berhasil ditambahkan', 'success');
            closeJadwalModal();
            loadJadwal();
            renderCalendar();
        } else {
            throw new Error('Gagal menyimpan data');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Gagal menyimpan data jadwal', 'error');
    }
}

function deleteJadwal(id) {
    deleteTarget = { type: 'jadwal', id: id };
    document.getElementById('confirmMessage').textContent = 
        `Apakah Anda yakin ingin menghapus jadwal pengambilan ini?`;
    document.getElementById('confirmModal').classList.add('show');
}

// ===== CALENDAR FUNCTIONS =====
function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Update header
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                       'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;

    // Set filter input
    const monthStr = String(month + 1).padStart(2, '0');
    document.getElementById('filterBulan').value = `${year}-${monthStr}`;

    // Get first day and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    // Add day headers
    const dayHeaders = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.style.fontWeight = 'bold';
        header.style.textAlign = 'center';
        header.textContent = day;
        calendar.appendChild(header);
    });

    // Add previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const dayEl = createCalendarDay(day, true);
        calendar.appendChild(dayEl);
    }

    // Add current month days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayEl = createCalendarDay(day, false, year, month, day);
        calendar.appendChild(dayEl);
    }

    // Add next month days
    const totalCells = calendar.children.length - 7; // Exclude header
    const remainingCells = 42 - totalCells;
    for (let day = 1; day <= remainingCells; day++) {
        const dayEl = createCalendarDay(day, true);
        calendar.appendChild(dayEl);
    }
}

function createCalendarDay(day, isOtherMonth, year = null, month = null, dayNum = null) {
    const dayEl = document.createElement('div');
    dayEl.className = 'calendar-day';
    
    if (isOtherMonth) {
        dayEl.classList.add('other-month');
        dayEl.textContent = day;
        return dayEl;
    }

    // Check if today
    const today = new Date();
    if (year === today.getFullYear() && month === today.getMonth() && dayNum === today.getDate()) {
        dayEl.classList.add('today');
    }

    // Check for events on this date
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    const events = jadwalList.filter(j => j.tanggal_pengambilan === dateStr);

    if (events.length > 0) {
        dayEl.classList.add('has-event');
        dayEl.innerHTML = `<div class="calendar-day-number">${dayNum}</div>
                          <div class="calendar-day-event">${events.length} jadwal</div>`;
    } else {
        dayEl.textContent = dayNum;
    }

    return dayEl;
}

function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

function loadRumahDetails() {
    // This can be used to show details when rumah is selected
}

// ===== DELETE CONFIRMATION =====
function cancelDelete() {
    document.getElementById('confirmModal').classList.remove('show');
    deleteTarget = null;
}

async function confirmDelete() {
    if (!deleteTarget) return;

    try {
        const endpoint = deleteTarget.type === 'rumah' ? 'rumah' : 
                        deleteTarget.type === 'petugas' ? 'petugas' : 'jadwal';
        
        const response = await fetch(`${API_URL}/${endpoint}/${deleteTarget.id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showNotification('Data berhasil dihapus', 'success');
            document.getElementById('confirmModal').classList.remove('show');
            
            if (deleteTarget.type === 'rumah') {
                loadRumah();
            } else if (deleteTarget.type === 'petugas') {
                loadPetugas();
            } else {
                loadJadwal();
                renderCalendar();
            }
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Gagal menghapus data', 'error');
    }

    deleteTarget = null;
}

// ===== UTILITY FUNCTIONS =====
function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('id-ID', options);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        font-weight: 600;
    `;

    if (type === 'success') {
        notification.style.background = '#d5f4e6';
        notification.style.color = '#27ae60';
    } else if (type === 'error') {
        notification.style.background = '#f5b7b1';
        notification.style.color = '#e74c3c';
    } else {
        notification.style.background = '#d6eaf8';
        notification.style.color = '#2980b9';
    }

    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Close modals when clicking outside
document.addEventListener('click', function(event) {
    const rumahModal = document.getElementById('rumahModal');
    const petugasModal = document.getElementById('petugasModal');
    const jadwalModal = document.getElementById('jadwalModal');
    const confirmModal = document.getElementById('confirmModal');

    if (event.target === rumahModal) {
        rumahModal.classList.remove('show');
    }
    if (event.target === petugasModal) {
        petugasModal.classList.remove('show');
    }
    if (event.target === jadwalModal) {
        jadwalModal.classList.remove('show');
    }
    if (event.target === confirmModal) {
        confirmModal.classList.remove('show');
    }
});
