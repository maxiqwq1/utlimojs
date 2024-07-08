document.getElementById('convert').addEventListener('click', async () => {
    const amount = document.getElementById('cantidad').value;
    const currency = document.getElementById('currency').value;
    const resultDiv = document.getElementById('resultado');

    if (!amount) {
        resultDiv.textContent = 'Por favor, ingresa una cantidad en CLP.';
        return;
    }

    try {
        const response = await fetch('https://mindicador.cl/api');
        if (!response.ok) throw new Error('Error al extraer los datos de la API');

        const data = await response.json();
        const rate = data[currency].valor;
        const convertedAmount = (amount / rate).toFixed(2);
        resultDiv.textContent = `El equivalente de ${amount} CLP en ${currency} es ${convertedAmount}.`;

        // Obtener los últimos 10 valores
        const historyResponse = await fetch(`https://mindicador.cl/api/${currency}`);
        if (!historyResponse.ok) throw new Error('Error al obtener el historial de la moneda buscada');

        const historyData = await historyResponse.json();
        const labels = historyData.serie.slice(0, 10).map(item => item.fecha.split('T')[0]).reverse();
        const values = historyData.serie.slice(0, 10).map(item => item.valor).reverse();

        // Crear el gráfico
        const ctx = document.getElementById('chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `Historial de ${currency.toUpperCase()} (últimos 10 días)`,
                    data: values,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Fecha'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Valor'
                        }
                    }
                }
            }
        });
    } catch (error) {
        resultDiv.textContent = `Error: ${error.message}`;
    }
});
