
// Wait until the HTML document has fully loaded before running JavaScript.
document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // MOBILE NAVIGATION
    // ==========================================

    // Select the mobile menu button and the main navigation menu.
    const menuButton = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".main-nav");

    // Check that both navigation elements exist before adding click events.
    if (menuButton && navigation) {

        // Open or close the navigation menu when the mobile menu button is clicked.
        menuButton.addEventListener("click", function () {
            const isOpen = navigation.classList.toggle("active");

            // Update the accessibility attribute to show the current menu state.
            menuButton.setAttribute("aria-expanded", String(isOpen));
        });

        // Close the mobile navigation menu after a user selects a page link.
        navigation.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {

                // Automatically close the menu on smaller screens.
                if (window.innerWidth <= 600) {
                    navigation.classList.remove("active");
                    menuButton.setAttribute("aria-expanded", "false");
                }
            });
        });
    }


    // ==========================================
    // MENU SEARCH, FILTERS AND PRICE SORTING
    // ==========================================

    // Select the menu search field, category buttons, sorting option and menu cards.
    const menuSearch = document.getElementById("menuSearch");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const sortSelect = document.getElementById("menuSort");
    const menuItems = Array.from(document.querySelectorAll(".menu-card"));
    const menuNoResults = document.getElementById("menuNoResults");

    // Extract the price from a menu card and convert it into a number for sorting.
    const getMenuPrice = function (item) {
        const priceText = item.querySelector(".price")?.textContent || "R0";
        const numericValue = priceText.replace(/[^\d,.-]/g, "").replace(",", ".");
        return Number.parseFloat(numericValue) || 0;
    };

    // Activate the menu controls only when menu items and relevant controls exist.
    if ((menuSearch || filterButtons.length || sortSelect) && menuItems.length) {

        // Store the currently selected category, search text and sorting option.
        let activeCategory = "all";
        let activeSearch = "";
        let activeSort = "default";

        // Filter and sort menu cards according to the user's selected options.
        const applyMenuFilters = function () {

            // Find menu cards that match the selected category and search text.
            let visibleItems = menuItems.filter(function (item) {
                const matchesCategory = activeCategory === "all" || item.dataset.category === activeCategory;
                const searchableText = item.textContent.toLowerCase();
                const matchesSearch = searchableText.includes(activeSearch);

                return matchesCategory && matchesSearch;
            });

            // Sort matching menu cards from the lowest to the highest price.
            if (activeSort === "low-high") {
                visibleItems.sort(function (a, b) {
                    return getMenuPrice(a) - getMenuPrice(b);
                });

            // Sort matching menu cards from the highest to the lowest price.
            } else if (activeSort === "high-low") {
                visibleItems.sort(function (a, b) {
                    return getMenuPrice(b) - getMenuPrice(a);
                });
            }

            // Hide all menu cards before displaying the matching results.
            menuItems.forEach(function (item) {
                item.style.display = "none";
            });

            // Display matching cards and arrange them in the selected order.
            visibleItems.forEach(function (item) {
                item.style.display = "block";
                item.parentNode.appendChild(item);
            });

            // Display a message when no menu items match the selected filters.
            if (menuNoResults) {
                menuNoResults.hidden = visibleItems.length !== 0;
            }
        };

        // Update the search whenever the user types into the menu search field.
        if (menuSearch) {
            menuSearch.addEventListener("input", function (event) {
                activeSearch = event.target.value.trim().toLowerCase();
                applyMenuFilters();
            });
        }

        // Change the active category when a user clicks a filter button.
        filterButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                activeCategory = button.dataset.category;

                // Highlight the selected category button.
                filterButtons.forEach(function (filterButton) {
                    filterButton.classList.toggle("active", filterButton === button);
                });

                // Refresh the displayed menu items after selecting a category.
                applyMenuFilters();
            });
        });

        // Apply the selected price sorting option when the dropdown changes.
        if (sortSelect) {
            sortSelect.addEventListener("change", function (event) {
                activeSort = event.target.value;
                applyMenuFilters();
            });
        }

        // Display the menu using the default search, filter and sorting settings.
        applyMenuFilters();
    }


    // ==========================================
    // IMAGE GALLERY LIGHTBOX
    // ==========================================

    // Select all gallery images that can be opened in a larger preview.
    const galleryImages = document.querySelectorAll(".gallery-image");

    // Add a click event to each gallery image to create its enlarged preview.
    galleryImages.forEach(function (image) {
        image.addEventListener("click", function () {

            // Create the lightbox container and set its accessibility information.
            const lightbox = document.createElement("div");
            lightbox.className = "lightbox";
            lightbox.setAttribute("role", "dialog");
            lightbox.setAttribute("aria-label", "Expanded gallery image");

            // Create an enlarged image using the selected image's source and description.
            const largeImage = document.createElement("img");
            largeImage.src = image.src;
            largeImage.alt = image.alt;

            // Create a close button for the enlarged image preview.
            const closeButton = document.createElement("button");
            closeButton.type = "button";
            closeButton.className = "lightbox-close";
            closeButton.setAttribute("aria-label", "Close image preview");
            closeButton.textContent = "×";

            // Add the enlarged image and close button to the lightbox.
            lightbox.appendChild(largeImage);
            lightbox.appendChild(closeButton);
            document.body.appendChild(lightbox);

            // Remove the lightbox and keyboard event listener when it is closed.
            const closeLightbox = function () {
                lightbox.remove();
                document.removeEventListener("keydown", handleEscape);
            };

            // Allow users to close the image preview by pressing Escape.
            const handleEscape = function (event) {
                if (event.key === "Escape") {
                    closeLightbox();
                }
            };

            // Close the preview when the close button is clicked.
            closeButton.addEventListener("click", closeLightbox);

            // Close the preview when the user clicks outside the enlarged image.
            lightbox.addEventListener("click", function (event) {
                if (event.target === lightbox) {
                    closeLightbox();
                }
            });

            // Listen for the Escape key while the image preview is open.
            document.addEventListener("keydown", handleEscape);
        });
    });


    // ==========================================
    // CONTACT FORM VALIDATION AND EMAIL PREPARATION
    // ==========================================

    // Select the contact form and the element used to display feedback.
    const contactForm = document.getElementById("contactForm");
    const contactStatus = document.getElementById("contactFormStatus");

    // Add form submission functionality only when both elements exist.
    if (contactForm && contactStatus) {
        contactForm.addEventListener("submit", function (event) {

            // Prevent the browser from submitting the form before validation.
            event.prevent
