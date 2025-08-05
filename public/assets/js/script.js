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
    const errors = [];
    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const dob = document.getElementById("dob").value.trim();
    const address = document.getElementById("address").value.trim();

    if (fullName.length < 3 || fullName.length > 50) {
        errors.push("Le nom complet doit contenir entre 3 et 50 caractères.");
    }

    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
        errors.push("Adresse email invalide.");
    }

    if (!/^[0-9]{9,12}$/.test(phone)) {
        errors.push("Numéro de téléphone invalide.");
    }

    if (!dob) {
        errors.push("Veuillez entrer une date de naissance.");
    }

    if (!address) {
        errors.push("L'adresse est obligatoire.");
    }

    if (errors.length > 0) {
        e.preventDefault();
        alert(errors.join("\\n"));
    }
});

//le multilangue(fracais anglais)
const translations = {
    fr: {
        "form-title": "Enregistrement Client",
        "label-fullName": "Nom complet",
        "label-email": "Email",
        "label-phone": "Téléphone",
        "label-dob": "Date de naissance",
        "label-address": "Adresse",
        "submit-btn": "Soumettre",
    },
    en: {
        "form-title": "Client Registration",
        "label-fullName": "Full name",
        "label-email": "Email",
        "label-phone": "Phone",
        "label-dob": "Date of birth",
        "label-address": "Address",
        "submit-btn": "Submit",
    },
};

function setLang(lang) {
    const dict = translations[lang] || translations["fr"];
    Object.keys(dict).forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.textContent = dict[id];
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const langSwitcher = document.getElementById("lang-switcher");

    const savedLang = localStorage.getItem("lang") || "fr";
    langSwitcher.value = savedLang;
    setLang(savedLang);

    langSwitcher.addEventListener("change", (e) => {
        const lang = e.target.value;
        setLang(lang);
        localStorage.setItem("lang", lang);
    });
});
