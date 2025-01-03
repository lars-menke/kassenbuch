// Firebase-Konfiguration
const firebaseConfig = {
    apiKey: "AIzaSyDcgwmt0ZsXay_-Rn_2mF0aVvB9mYlPXEU",
    authDomain: "kassenbuch-16f85.firebaseapp.com",
    databaseURL: "https://kassenbuch-16f85-default-rtdb.firebaseio.com",
    projectId: "kassenbuch-16f85",
    storageBucket: "kassenbuch-16f85.firebasestorage.app",
    messagingSenderId: "50657610211",
    appId: "1:50657610211:web:a74d5770ba6f060e7eb8d6",
    measurementId: "G-8GJW3NLPHF"
};

// Firebase initialisieren
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const form = document.getElementById('transactionForm');
const transactionsTable = document.getElementById('transactionsTable');

// Transaktionen laden
function loadTransactions() {
    firebase.database().ref('transactions').on('value', (snapshot) => {
        const transactions = snapshot.val() || {};
        transactionsTable.innerHTML = ''; // Tabelle leeren
        Object.values(transactions).forEach(addTransactionToTable);
        console.log("Geladene Transaktionen:", transactions);
    });
}

// Transaktion speichern
function saveTransaction(transaction) {
    console.log("Speichere Transaktion:", transaction);
    const newTransactionKey = firebase.database().ref().child('transactions').push().key;
    firebase.database().ref(`transactions/${newTransactionKey}`).set(transaction, (error) => {
        if (error) {
            console.error("Fehler beim Speichern der Transaktion:", error);
        } else {
            console.log("Transaktion erfolgreich gespeichert.");
        }
    });
}

// Transaktion zur Tabelle hinzufügen
function addTransactionToTable({ amount, category, description, timestamp }) {
    const row = document.createElement('tr');
    const formattedTimestamp = new Date(timestamp).toLocaleString();

    row.innerHTML = `
        <td>${amount.toFixed(2)}</td>
        <td>${category}</td>
        <td>${description}</td>
        <td>${formattedTimestamp}</td>
    `;
    transactionsTable.appendChild(row);
}

// Formular-Event-Listener
form.addEventListener('submit', (event) => {
    event.preventDefault();

    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    const timestamp = new Date().toISOString();

    const transaction = { amount, category, description, timestamp };
    saveTransaction(transaction);

    form.reset();
});

// Lade Transaktionen beim Start
loadTransactions();
