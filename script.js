// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Variables globales
    const addSupplyBtn = document.getElementById('addSupplyBtn');
    const suppliesSection = document.getElementById('suppliesSection');
    const totalSuppliesElem = document.getElementById('totalSupplies');

    const addDoctorBtn = document.getElementById('addDoctorBtn');
    const doctorsSection = document.getElementById('doctorsSection');
    const totalDoctorsElem = document.getElementById('totalDoctors');

    const hospitalizationCostInput = document.getElementById('hospitalizationCost');
    const bedCostInput = document.getElementById('bedCost');
    const otherCostsInput = document.getElementById('otherCosts');

    const totalCostElem = document.getElementById('totalCost');

    // Inicializar totales
    let totalSuppliesCost = 0;
    let totalDoctorsCost = 0;
    let totalAdditionalCosts = 0;

    // Función para actualizar el costo total
    function updateTotalCost() {
        // Calcular total de insumos
        totalSuppliesCost = 0;
        document.querySelectorAll('.supply').forEach(supply => {
            const quantity = parseFloat(supply.querySelector('.supplyQuantity').value) || 0;
            const cost = parseFloat(supply.querySelector('.supplyCost').value) || 0;
            totalSuppliesCost += quantity * cost;
        });
        totalSuppliesElem.textContent = totalSuppliesCost.toFixed(2);

        // Calcular total de honorarios médicos
        totalDoctorsCost = 0;
        document.querySelectorAll('.doctor').forEach(doctor => {
            const fee = parseFloat(doctor.querySelector('.doctorFee').value) || 0;
            totalDoctorsCost += fee;
        });
        totalDoctorsElem.textContent = totalDoctorsCost.toFixed(2);

        // Calcular costos adicionales
        const hospitalizationCost = parseFloat(hospitalizationCostInput.value) || 0;
        const bedCost = parseFloat(bedCostInput.value) || 0;
        const otherCosts = parseFloat(otherCostsInput.value) || 0;
        totalAdditionalCosts = hospitalizationCost + bedCost + otherCosts;

        // Calcular total general
        const total = totalSuppliesCost + totalDoctorsCost + totalAdditionalCosts;
        totalCostElem.textContent = total.toFixed(2);
    }

    // Agregar insumo
    addSupplyBtn.addEventListener('click', () => {
        const supplyDiv = document.createElement('div');
        supplyDiv.classList.add('dynamic-section', 'supply');
        supplyDiv.innerHTML = `
            <input type="text" class="supplyName" placeholder="Nombre del insumo" required>
            <input type="number" class="supplyQuantity" placeholder="Cantidad" required>
            <input type="number" class="supplyCost" placeholder="Costo unitario" required>
            <button type="button" class="removeBtn">Eliminar</button>
        `;
        suppliesSection.appendChild(supplyDiv);
    });

    // Eliminar insumo
    suppliesSection.addEventListener('click', (e) => {
        if (e.target.classList.contains('removeBtn')) {
            e.target.parentElement.remove();
            updateTotalCost();
        }
    });

    // Agregar médico
    addDoctorBtn.addEventListener('click', () => {
        const doctorDiv = document.createElement('div');
        doctorDiv.classList.add('dynamic-section', 'doctor');
        doctorDiv.innerHTML = `
            <input type="text" class="doctorName" placeholder="Nombre del médico" required>
            <input type="number" class="doctorFee" placeholder="Honorarios" required>
            <button type="button" class="removeBtn">Eliminar</button>
        `;
        doctorsSection.appendChild(doctorDiv);
    });

    // Eliminar médico
    doctorsSection.addEventListener('click', (e) => {
        if (e.target.classList.contains('removeBtn')) {
            e.target.parentElement.remove();
            updateTotalCost();
        }
    });

    // Actualizar costos al cambiar valores
    document.addEventListener('input', (e) => {
        if (
            e.target.matches('.supplyQuantity') ||
            e.target.matches('.supplyCost') ||
            e.target.matches('.doctorFee') ||
            e.target === hospitalizationCostInput ||
            e.target === bedCostInput ||
            e.target === otherCostsInput
        ) {
            updateTotalCost();
        }
    });

    // Generar PDF
    document.getElementById('generatePdfBtn').addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Encabezado con logo
        doc.setFontSize(18);
        doc.text('Hospital Santa Ines', 20, 20);
        const img = new Image();
        img.src = 'logo.jpeg';
        doc.addImage(img, 'jpeg', 150, 5, 50, 50);

        // Datos del paciente
        const patientName = document.getElementById('patientName').value;
        const patientAge = document.getElementById('patientAge').value;
        const patientGender = document.getElementById('patientGender').value;
        const patientAddress = document.getElementById('patientAddress').value;
        const patientPhone = document.getElementById('patientPhone').value;
        const diagnosis = document.getElementById('diagnosis').value;

        doc.setFontSize(10);
        let y = 40;
        doc.text(`Nombre del Paciente: ${patientName}`, 20, y);
        doc.text(`Edad: ${patientAge}`, 20, y + 5);
        doc.text(`Género: ${patientGender}`, 20, y + 10);
        doc.text(`Dirección: ${patientAddress}`, 20, y + 15);
        doc.text(`Teléfono: ${patientPhone}`, 20, y + 20);
        doc.text(`Diagnóstico: ${diagnosis}`, 20, y + 25);

        y += 40;

        // Insumos
        doc.setFontSize(10);
        doc.text('Insumos Utilizados', 20, y);
        y += 5;
        doc.setFontSize(8);
        document.querySelectorAll('.supply').forEach(supply => {
            const name = supply.querySelector('.supplyName').value;
            const quantity = supply.querySelector('.supplyQuantity').value;
            const cost = supply.querySelector('.supplyCost').value;
            doc.text(`- ${name}, Cantidad: ${quantity}, Costo Unitario: Q${cost}`, 20, y);
            y += 5;
        });
        doc.text(`Total Insumos: Q${totalSuppliesCost.toFixed(2)}`, 20, y);
        y += 10;

        // Costos Adicionales
        doc.setFontSize(10);
        doc.text('Costos Adicionales', 20, y);
        y += 5;
        doc.setFontSize(8);
        doc.text(`Hospitalización: Q${parseFloat(hospitalizationCostInput.value).toFixed(2)}`, 20, y);
        y += 5;
        doc.text(`Camilla: Q${parseFloat(bedCostInput.value).toFixed(2)}`, 20, y);
        y += 5;
        doc.text(`Otros Costos: Q${parseFloat(otherCostsInput.value).toFixed(2)}`, 20, y);
        y += 5;
        doc.text(`Total Costos Adicionales: Q${totalAdditionalCosts.toFixed(2)}`, 20, y);
        y += 10;

        // Honorarios Médicos
        doc.setFontSize(10);
        doc.text('Honorarios Médicos', 20, y);
        y += 5;
        doc.setFontSize(8);
        document.querySelectorAll('.doctor').forEach(doctor => {
            const name = doctor.querySelector('.doctorName').value;
            const fee = doctor.querySelector('.doctorFee').value;
            doc.text(`- Dr. ${name}, Honorarios: Q${fee}`, 20, y);
            y += 5;
        });
        doc.text(`Total Honorarios Médicos: Q${totalDoctorsCost.toFixed(2)}`, 20, y);
        y += 10;

        // Total General
        doc.setFontSize(12);
        doc.text(`Total a Pagar: Q${(totalSuppliesCost + totalDoctorsCost + totalAdditionalCosts).toFixed(2)}`, 20, y);

        // Pie de página
        doc.setFontSize(10);
        doc.text('Hospital Santa Ines | Teléfono: 2305-1205 | Dirección: 4 calle 3-45, Boulevar Principal San Cristóbal, Mixco, Guatemala', 10, 280);

        doc.save('estado_de_cuenta.pdf');
    });
});
