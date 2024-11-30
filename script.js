document.addEventListener('DOMContentLoaded', function () {
    const products = [];

    // Fonction pour générer un numéro de facture unique
    function generateInvoiceNumber() {
        return 'INV-' + Math.floor(Math.random() * 1000000);
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
        const warrantyDuration = 1;  // 1 semaine de garantie (modification ici)
        document.getElementById('warranty-duration').innerText = warrantyDuration;

        // Créer un objet html2pdf
        const element = document.getElementById('receipt-container');
        const opt = {
            margin: 0.5,
            filename: 'reçu_' + generateInvoiceNumber() + '.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 4 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' } // Format paysage
        };

        // Télécharger le PDF
        html2pdf().from(element).set(opt).save();
    });
});

