const payBtn = document.querySelector(".btn-buy");

payBtn.addEventListener("click", () => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    fetch("/stripe-checkout", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            items: cartItems,
        }),
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.url) {
            clearCart();
            location.href = data.url;
        } else {
            console.error("No URL found in the response:", data);
        }
    })
    .catch((err) => console.error("Error during checkout:", err));
});
