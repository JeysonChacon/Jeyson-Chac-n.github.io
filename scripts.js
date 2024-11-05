const stripe = Stripe("pk_test_51QHVqdEPl0ilYsB6v0jRGludRDvrjiMcFlblSvHnwxKeECtsC1TdIAOD2JVu50ADdVFyaH4VBNdB3J12S3O2uBnc0085TiGx3J");

let carrito = [];
const listaCarrito = document.getElementById("lista-carrito");
const totalDisplay = document.getElementById("total");

function agregarAlCarrito(id, nombre, precio) {
    carrito.push({ id, nombre, precio });
    actualizarCarrito();
}

function actualizarCarrito() {
    listaCarrito.innerHTML = "";
    let total = 0;
    carrito.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = `${item.nombre} - $${item.precio}`;
        listaCarrito.appendChild(li);
        total += item.precio;
    });
    totalDisplay.textContent = `Total: $${total}`;
}

document.getElementById("pagar").addEventListener("click", async () => {
    try {
        const response = await fetch("/crear-sesion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ carrito })
        });
        const data = await response.json();
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (error) {
        console.error("Error al procesar el pago:", error);
    }
});
