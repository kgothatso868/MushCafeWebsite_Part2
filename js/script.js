document.addEventListener("DOMContentLoaded", function () {

    // Mobile navigation
    const menuButton = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".main-nav");

    if (menuButton && navigation) {
        menuButton.addEventListener("click", function () {
            const isOpen = navigation.classList.toggle("active");
            menuButton.setAttribute("aria-expanded", String(isOpen));
        });

        navigation.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                if (window.innerWidth <= 600) {
                    navigation.classList.remove("active");
                    menuButton.setAttribute("aria-expanded", "false");
                }
            });
        });
    }

    // Menu search, filters and sorting
    const menuSearch = document.getElementById("menuSearch");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const sortSelect = document.getElementById("menuSort");
    const menuItems = Array.from(document.querySelectorAll(".menu-card"));
    const menuNoResults = document.getElementById("menuNoResults");

    const getMenuPrice = function (item) {
        const priceText = item.querySelector(".price")?.textContent || "R0";
        const numericValue = priceText.replace(/[^\d,.-]/g, "").replace(",", ".");
        return Number.parseFloat(numericValue) || 0;
    };

    if ((menuSearch || filterButtons.length || sortSelect) && menuItems.length) {
        let activeCategory = "all";
        let activeSearch = "";
        let activeSort = "default";

        const applyMenuFilters = function () {
            let visibleItems = menuItems.filter(function (item) {
                const matchesCategory = activeCategory === "all" || item.dataset.category === activeCategory;
                const searchableText = item.textContent.toLowerCase();
                const matchesSearch = searchableText.includes(activeSearch);
                return matchesCategory && matchesSearch;
            });

            if (activeSort === "low-high") {
                visibleItems.sort(function (a, b) {
                    return getMenuPrice(a) - getMenuPrice(b);
                });
            } else if (activeSort === "high-low") {
                visibleItems.sort(function (a, b) {
                    return getMenuPrice(b) - getMenuPrice(a);
                });
            }

            menuItems.forEach(function (item) {
                item.style.display = "none";
            });

            visibleItems.forEach(function (item) {
                item.style.display = "block";
                item.parentNode.appendChild(item);
            });

            if (menuNoResults) {
                menuNoResults.hidden = visibleItems.length !== 0;
            }
        };

        if (menuSearch) {
            menuSearch.addEventListener("input", function (event) {
                activeSearch = event.target.value.trim().toLowerCase();
                applyMenuFilters();
            });
        }

        filterButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                activeCategory = button.dataset.category;

                filterButtons.forEach(function (filterButton) {
                    filterButton.classList.toggle("active", filterButton === button);
                });

                applyMenuFilters();
            });
        });

        if (sortSelect) {
            sortSelect.addEventListener("change", function (event) {
                activeSort = event.target.value;
                applyMenuFilters();
            });
        }

        applyMenuFilters();
    }

    // Image gallery lightbox
    const galleryImages = document.querySelectorAll(".gallery-image");

    galleryImages.forEach(function (image) {
        image.addEventListener("click", function () {
            const lightbox = document.createElement("div");
            lightbox.className = "lightbox";
            lightbox.setAttribute("role", "dialog");
            lightbox.setAttribute("aria-label", "Expanded gallery image");

            const largeImage = document.createElement("img");
            largeImage.src = image.src;
            largeImage.alt = image.alt;

            const closeButton = document.createElement("button");
            closeButton.type = "button";
            closeButton.className = "lightbox-close";
            closeButton.setAttribute("aria-label", "Close image preview");
            closeButton.textContent = "×";

            lightbox.appendChild(largeImage);
            lightbox.appendChild(closeButton);
            document.body.appendChild(lightbox);

            const closeLightbox = function () {
                lightbox.remove();
                document.removeEventListener("keydown", handleEscape);
            };

            const handleEscape = function (event) {
                if (event.key === "Escape") {
                    closeLightbox();
                }
            };

            closeButton.addEventListener("click", closeLightbox);
            lightbox.addEventListener("click", function (event) {
                if (event.target === lightbox) {
                    closeLightbox();
                }
            });
            document.addEventListener("keydown", handleEscape);
        });
    });

    // Contact form validation and mailto preparation
    const contactForm = document.getElementById("contactForm");
    const contactStatus = document.getElementById("contactFormStatus");

    if (contactForm && contactStatus) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("contactName")?.value.trim() || "";
            const phone = document.getElementById("contactPhone")?.value.trim() || "";
            const email = document.getElementById("contactEmail")?.value.trim() || "";
            const messageType = document.getElementById("messageType")?.value || "";
            const message = document.getElementById("contactMessage")?.value.trim() || "";

            if (!name || !phone || !email || !messageType || !message) {
                contactStatus.textContent = "Please complete all required contact details before submitting.";
                contactStatus.className = "form-status error";
                return;
            }

            const preparedMessage = [
                "Name: " + name,
                "Contact number: " + phone,
                "Email: " + email,
                "Message type: " + messageType,
                "",
                "Message:",
                message
            ].join("\n");

            const subject = encodeURIComponent("Website contact message - " + messageType);
            const body = encodeURIComponent(preparedMessage);

            contactStatus.textContent = "Your message has been prepared in your email app. Please review it before sending.";
            contactStatus.className = "form-status success";
            window.location.href = "mailto:info@mushcafe.com?subject=" + subject + "&body=" + body;
        });
    }

    // Enquiry form validation and feedback
    const enquiryForm = document.getElementById("enquiryForm");
    const enquiryStatus = document.getElementById("enquiryFormStatus");

    if (enquiryForm && enquiryStatus) {
        enquiryForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("enquiryName")?.value.trim() || "";
            const email = document.getElementById("enquiryEmail")?.value.trim() || "";
            const product = document.getElementById("enquiryProduct")?.value || "";
            const quantity = document.getElementById("enquiryQuantity")?.value.trim() || "";
            const message = document.getElementById("enquiryMessage")?.value.trim() || "";

            if (!name || !email || !product || !quantity || !message) {
                enquiryStatus.textContent = "Please complete all required enquiry fields before submitting.";
                enquiryStatus.className = "form-status error";
                return;
            }

            enquiryStatus.textContent = "Thank you, " + name + ". Your enquiry for " + product + " has been received. Our team will contact you soon to confirm details and pricing.";
            enquiryStatus.className = "form-status success";
            enquiryForm.reset();
        });
    }
});