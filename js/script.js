
// Wait until the HTML document has fully loaded before running JavaScript.
document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. MOBILE NAVIGATION
    // ==========================================

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


    // ==========================================
    // 2. MENU SEARCH, CATEGORY FILTERS AND SORTING
    // ==========================================

    const menuSearch = document.getElementById("menuSearch");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const sortSelect = document.getElementById("menuSort");
    const menuItems = Array.from(document.querySelectorAll(".menu-card"));
    const menuNoResults = document.getElementById("menuNoResults");

    // Read the price from a menu item so that prices can be sorted.
    function getMenuPrice(item) {
        const priceElement = item.querySelector(".price");
        const priceText = priceElement ? priceElement.textContent : "0";
        const numericValue = priceText.replace(/[^\d,.-]/g, "").replace(",", ".");

        return Number.parseFloat(numericValue) || 0;
    }

    // Run the menu controls only on a page containing menu items.
    if (menuItems.length > 0) {

        let activeCategory = "all";
        let activeSearch = "";
        let activeSort = "default";

        // Show only the menu items matching the selected options.
        function applyMenuFilters() {

            let visibleItems = menuItems.filter(function (item) {

                const itemCategory = item.dataset.category;

                const matchesCategory =
                    activeCategory === "all" ||
                    itemCategory === activeCategory;

                const searchableText = item.textContent.toLowerCase();

                const matchesSearch =
                    searchableText.includes(activeSearch);

                return matchesCategory && matchesSearch;
            });

            // Sort menu items by price.
            if (activeSort === "low-high") {

                visibleItems.sort(function (a, b) {
                    return getMenuPrice(a) - getMenuPrice(b);
                });

            } else if (activeSort === "high-low") {

                visibleItems.sort(function (a, b) {
                    return getMenuPrice(b) - getMenuPrice(a);
                });
            }

            // Hide all menu items before showing the matching ones.
            menuItems.forEach(function (item) {
                item.style.display = "none";
            });

            // Show the matching items in the selected order.
            visibleItems.forEach(function (item) {
                item.style.display = "";
                item.parentNode.appendChild(item);
            });

            // Show a message if no matching items are found.
            if (menuNoResults) {
                menuNoResults.hidden = visibleItems.length > 0;
            }
        }

        // Search menu items as the customer types.
        if (menuSearch) {
            menuSearch.addEventListener("input", function (event) {
                activeSearch = event.target.value.trim().toLowerCase();
                applyMenuFilters();
            });
        }

        // Filter menu items when a category button is clicked.
        filterButtons.forEach(function (button) {

            button.addEventListener("click", function () {

                activeCategory = button.dataset.category || "all";

                // Highlight the selected category button.
                filterButtons.forEach(function (filterButton) {
                    filterButton.classList.toggle(
                        "active",
                        filterButton === button
                    );
                });

                applyMenuFilters();
            });
        });

        // Sort menu items when the sorting dropdown changes.
        if (sortSelect) {
            sortSelect.addEventListener("change", function (event) {
                activeSort = event.target.value;
                applyMenuFilters();
            });
        }

        // Display all menu items when the page first loads.
        applyMenuFilters();
    }


    // ==========================================
    // 3. IMAGE GALLERY LIGHTBOX
    // ==========================================

    const galleryImages = document.querySelectorAll(".gallery-image");

    galleryImages.forEach(function (image) {

        image.addEventListener("click", function () {

            // Create a background for the enlarged image.
            const lightbox = document.createElement("div");
            lightbox.className = "lightbox";
            lightbox.setAttribute("role", "dialog");
            lightbox.setAttribute("aria-label", "Expanded gallery image");

            // Display the selected image in a larger size.
            const largeImage = document.createElement("img");
            largeImage.src = image.src;
            largeImage.alt = image.alt;

            // Create a button to close the image preview.
            const closeButton = document.createElement("button");
            closeButton.type = "button";
            closeButton.className = "lightbox-close";
            closeButton.setAttribute("aria-label", "Close image preview");
            closeButton.textContent = "×";

            lightbox.appendChild(largeImage);
            lightbox.appendChild(closeButton);
            document.body.appendChild(lightbox);

            // Close and remove the image preview.
            function closeLightbox() {
                lightbox.remove();
                document.removeEventListener("keydown", handleEscape);
            }

            // Allow the Escape key to close the image preview.
            function handleEscape(event) {
                if (event.key === "Escape") {
                    closeLightbox();
                }
            }

            closeButton.addEventListener("click", closeLightbox);

            // Close the preview when the background is clicked.
            lightbox.addEventListener("click", function (event) {
                if (event.target === lightbox) {
                    closeLightbox();
                }
            });

            document.addEventListener("keydown", handleEscape);
        });
    });


    // ==========================================
    // 4. CONTACT FORM VALIDATION
    // ==========================================

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

            // Check that all required contact details have been entered.
            if (!name || !phone || !email || !messageType || !message) {
                contactStatus.textContent = "Please complete all required fields.";
                return;
            }

            // Check that the email address has a valid format.
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {
                contactStatus.textContent = "Please enter a valid email address.";
                return;
            }

            // Prepare the customer's message for the cafe.
            const subject = encodeURIComponent("Mush Cafe Contact: " + messageType);

            const body = encodeURIComponent(
                "Name: " + name +
                "\nPhone: " + phone +
                "\nEmail: " + email +
                "\nMessage type: " + messageType +
                "\n\nMessage:\n" + message
            );

            contactStatus.textContent =
                "Your email app will open so you can send your message.";

            // Open the visitor's email application with the message prepared.
            window.location.href =
                "mailto:info@mushcafe.com?subject=" + subject + "&body=" + body;
        });
    }


    // ==========================================
    // 5. ENQUIRY FORM VALIDATION
    // ==========================================

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

            // Check that all required enquiry fields are completed.
            if (!name || !email || !product || !quantity || !message) {
                enquiryStatus.textContent = "Please complete all required fields.";
                return;
            }

            // Check that the email address is valid.
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {
                enquiryStatus.textContent = "Please enter a valid email address.";
                return;
            }

            // Check that the requested quantity is a positive number.
            if (Number(quantity) < 1 || !Number.isFinite(Number(quantity))) {
                enquiryStatus.textContent = "Please enter a valid quantity.";
                return;
            }

            // Prepare the enquiry details for the cafe.
            const subject = encodeURIComponent("Mush Cafe Product Enquiry");

            const body = encodeURIComponent(
                "Name: " + name +
                "\nEmail: " + email +
                "\nProduct: " + product +
                "\nQuantity: " + quantity +
                "\n\nEnquiry:\n" + message
            );

            enquiryStatus.textContent =
                "Your email app will open so you can send your enquiry.";

            // Open the visitor's email application with the enquiry prepared.
            window.location.href =
                "mailto:info@mushcafe.com?subject=" + subject + "&body=" + body;
        });
    }

});

