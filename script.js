document.addEventListener('DOMContentLoaded', function () {
    const products = [];

    // Fonction pour générer un numéro de facture unique
    function generateInvoiceNumber() {
        return 'INV-' + Math.floor(Math.random() * 1000000);
    }

    // Fonction pour calculer la durée de la garantie
    function calculateWarranty(total) {
        if (total <= 15000) {
            return 1; // 1 semaine de garantie
        } else if (total <= 30000) {
            return 2; // 2 semaines de garantie
        } else if (total <= 50000) {
            return 3; // 3 semaines de garantie
        } else {
            return 4; // Plus de 50,000 FCFA, 4 semaines de garantie
        }
    }

    // Calcul des totaux du reçu
    function calculateTotals() {
        let totalBeforeDiscount = 0;
        let totalDiscount = 0;
        let finalTotal = 0;

        products.forEach(product => {
            totalBeforeDiscount += product.itemPrice * product.itemQuantity;
            totalDiscount += product.itemDiscount;
            finalTotal += product.totalAfterDiscount;
        });

        document.getElementById('total-before-discount').innerText = totalBeforeDiscount.toFixed(2);
        document.getElementById('total-discount').innerText = totalDiscount.toFixed(2);
        document.getElementById('final-total').innerText = finalTotal.toFixed(2);

        // Calcul de la garantie en fonction du prix total
        const warrantyDuration = calculateWarranty(finalTotal);
        document.getElementById('warranty-duration').innerText = warrantyDuration;
    }

    // Afficher la date actuelle
    const currentDate = new Date().toLocaleDateString();
    document.getElementById('current-date').innerText = currentDate;

    // Ajouter un produit au reçu
    document.getElementById('receipt-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const itemName = document.getElementById('item-name').value;
        const itemPrice = parseFloat(document.getElementById('item-price').value);
        const itemQuantity = parseInt(document.getElementById('item-quantity').value);
        const itemDiscount = parseFloat(document.getElementById('item-discount').value);
        
        const totalAfterDiscount = (itemPrice * itemQuantity) - itemDiscount;

        // Ajouter le produit au tableau
        products.push({
            itemName,
            itemPrice,
            itemQuantity,
            itemDiscount,
            totalAfterDiscount
        });

        // Mettre à jour la table de prévisualisation
        const tableBody = document.querySelector('#receipt-table tbody');
        const newRow = document.createElement('tr');

        newRow.innerHTML = `
            <td>${itemName}</td>
            <td>${itemPrice} FCFA</td>
            <td>${itemQuantity}</td>
            <td>${itemDiscount} FCFA</td>
            <td>${totalAfterDiscount.toFixed(2)} FCFA</td>
        `;
        tableBody.appendChild(newRow);

        // Mettre à jour les totaux
        calculateTotals();

        // Réinitialiser le formulaire
        document.getElementById('item-name').value = '';
        document.getElementById('item-price').value = '';
        document.getElementById('item-quantity').value = '';
        document.getElementById('item-discount').value = '0';

        // Afficher la section du reçu
        document.getElementById('receipt-container').style.display = 'block';

        // Mettre à jour le numéro de facture et le nom de l'acheteur
        document.getElementById('invoice-number').innerText = generateInvoiceNumber();
        document.getElementById('buyer-name-receipt').innerText = document.getElementById('buyer-name').value;
    });

    // Télécharger le reçu en PDF
    document.getElementById('download-receipt').addEventListener('click', function () {
        const receiptContent = document.getElementById('receipt-container');

        // Options pour le téléchargement PDF
        const options = {
            filename: 'reçu_achat.pdf',
            margin: 5,
            html2canvas: {
                scale: 3,
                logging: false,
                dpi: 300,
                letterRendering: true
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait',
                compressPdf: true
            }
        };

        // Télécharger le PDF
        html2pdf().from(receiptContent).set(options).save();
    });
});

