const hour = new Date().getHours();
if (hour >= 6 && hour < 18) {
    document.body.classList.add("day-mode");
} else {
    document.body.classList.add("night-mode");
}

const dob = document.getElementById("dob");
dob.max = new Date().toISOString().split("T")[0];

const addressInput = document.getElementById("address");
const suggestions = document.getElementById("address-suggestions");

addressInput.addEventListener("input", async () => {
    const query = addressInput.value;
    if (query.length < 3) return;

    const res = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lang=fr`
    );
    const data = await res.json();

    suggestions.innerHTML = "";
    data.features.slice(0, 5).forEach((loc) => {
        const props = loc.properties;
        let label = props.name || "";
        if (props.city) label += ", " + props.city;
        if (props.country) label += ", " + props.country;

        const li = document.createElement("li");
        li.textContent = label;
        li.onclick = () => {
            addressInput.value = label;
            suggestions.innerHTML = "";
        };
        suggestions.appendChild(li);
    });
});

document.getElementById("client-form").addEventListener("submit", function (e) {
    document.querySelectorAll(".error").forEach((el) => el.remove());

    let hasErrors = false;

    const showError = (fieldId, message) => {
        const field = document.getElementById(fieldId);
        const error = document.createElement("div");
        error.className = "error";
        error.textContent = message;
        field.insertAdjacentElement("afterend", error);
        hasErrors = true;
    };

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const dob = document.getElementById("dob").value.trim();
    const address = document.getElementById("address").value.trim();

    if (fullName.length < 3 || fullName.length > 50) {
        showError(
            "fullName",
            "Le nom complet doit contenir entre 3 et 50 caractères."
        );
    }

    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
        showError("email", "Adresse email invalide.");
    }

    if (!/^[0-9]{9,12}$/.test(phone)) {
        showError("phone", "Numéro de téléphone invalide.");
    }

    if (!dob) {
        showError("dob", "Veuillez entrer une date de naissance.");
    }

    if (!address) {
        showError("address", "L'adresse est obligatoire.");
    }

    if (hasErrors) {
        e.preventDefault();

        setTimeout(() => {
            document.querySelectorAll(".error").forEach((el) => el.remove());
        }, 5000);
    }
});
