const app = async () => {
  const saleForm = document.getElementById('saleForm');
  const salesTableBody = document.getElementById('salesTableBody');
  const totalSalesText = document.getElementById('totalSales');
  const totalRevenueText = document.getElementById('totalRevenue');
  const alertBox = document.getElementById('alertBox');

  const showAlert = (message, isError = false) => {
    alertBox.textContent = message;
    alertBox.style.display = 'block';
    alertBox.className = `alert ${isError ? 'alert-error' : 'alert-success'}`;
  };

  const formatCurrency = (value) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);

  const loadSummary = async () => {
    const response = await fetch('/api/summary');
    const data = await response.json();
    totalSalesText.textContent = data.totalSales;
    totalRevenueText.textContent = formatCurrency(data.totalRevenue);
  };

  const loadSales = async () => {
    const response = await fetch('/api/sales');
    const sales = await response.json();

    salesTableBody.innerHTML = '';

    sales.forEach((sale) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${sale.item}</td>
        <td>${sale.quantity}</td>
        <td>${formatCurrency(sale.price)}</td>
        <td>${formatCurrency(sale.quantity * sale.price)}</td>
        <td>${sale.date}</td>
      `;
      salesTableBody.appendChild(row);
    });
  };

  saleForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(saleForm);
    const payload = {
      item: formData.get('item'),
      quantity: formData.get('quantity'),
      price: formData.get('price')
    };

    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Unable to add sale.');
      }

      showAlert(`Sale added successfully: ${result.item}`);
      saleForm.reset();
      await loadSales();
      await loadSummary();
    } catch (error) {
      showAlert(error.message, true);
    }
  });

  await loadSales();
  await loadSummary();
};

app();
