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
