/**
 * Global function to update all i18n elements based on current language
 * This avoids duplicating the same logic in multiple components
 */
export function updateI18nElements() {
	// Get current language from localStorage or fallback to default
	const currentLang = localStorage.getItem("language") || "zh_CN";

	// Import and use the existing i18n system
	import("../i18n/translation.js")
		.then(({ getTranslation }) => {
			// Get the translation object for the current language
			const translations = getTranslation(currentLang);

			// Update all elements with data-i18n-key attribute
			document.querySelectorAll("[data-i18n-key]").forEach((element) => {
				const key = element.getAttribute("data-i18n-key");
				if (key && key in translations) {
					const translationText =
						translations[key as keyof typeof translations];
					if (translationText) {
						element.textContent = translationText;
					}
				}
			});
		})
		.catch((err) => {
			console.error("Failed to load translation module:", err);
		});
}

/**
 * Special function to update search input placeholders
 */
export function updateSearchPlaceholders() {
	// Get current language from localStorage or fallback to default
	const currentLang = localStorage.getItem("language") || "zh_CN";

	// Import and use the existing i18n system
	import("../i18n/translation.js")
		.then(({ getTranslation }) => {
			const translations = getTranslation(currentLang);

			// Update search input placeholders
			const searchInputs = document.querySelectorAll(
				"#search-bar input, #search-bar-inside input",
			);
			const searchKey = "search";

			if (searchKey in translations) {
				const placeholderText =
					translations[searchKey as keyof typeof translations];
				searchInputs.forEach((input) => {
					(input as HTMLInputElement).placeholder = placeholderText;
				});
			}
		})
		.catch((err) => {
			console.error("Failed to load translation module:", err);
		});
}

/**
 * Special function to update navigation links text
 */
export function updateNavigationLinks() {
	// Get current language from localStorage or fallback to default
	const currentLang = localStorage.getItem("language") || "zh_CN";

	// Import and use the existing i18n system
	import("../i18n/translation.js")
		.then(({ getTranslation }) => {
			const translations = getTranslation(currentLang);

			// Mapping from URL to translation key
			const urlToKeyMap = {
				"/": "home",
				"/about/": "about",
				"/archive/": "archive",
				"/writing/": "writing", // Custom link - won't be translated dynamically
			};

			// Update all navigation links with translated text
			document.querySelectorAll("[data-link-preset]").forEach((link) => {
				const url = link.getAttribute("data-link-preset");
				// Check if url is not null and is a valid key in urlToKeyMap
				if (url && url in urlToKeyMap) {
					const key = urlToKeyMap[url as keyof typeof urlToKeyMap];

					// Get the nav-link-text element before checking the key
					const navLinkTextElement = link.querySelector(".nav-link-text");

					if (key && navLinkTextElement && key in translations) {
						const translationText =
							translations[key as keyof typeof translations];
						if (translationText) {
							navLinkTextElement.textContent = translationText;
						}
					}
				}
			});
		})
		.catch((err) => {
			console.error("Failed to load translation module:", err);
		});
}

// Set up global language change listener once
if (typeof window !== "undefined") {
	// Define global functions that will be called by individual components
	const setupGlobalI18nListeners = () => {
		// Remove existing listeners to prevent duplicates
		window.removeEventListener("languagechange", updateI18nElements);
		window.removeEventListener("languagechange", updateSearchPlaceholders);
		window.removeEventListener("languagechange", updateNavigationLinks);
		document.removeEventListener("DOMContentLoaded", updateI18nElements);
		document.removeEventListener("DOMContentLoaded", updateSearchPlaceholders);
		document.removeEventListener("DOMContentLoaded", updateNavigationLinks);

		// Add new listeners
		window.addEventListener("languagechange", () => {
			updateI18nElements();
			updateSearchPlaceholders();
			updateNavigationLinks();
		});
		document.addEventListener("DOMContentLoaded", () => {
			updateI18nElements();
			updateSearchPlaceholders();
			updateNavigationLinks();
		});
	};

	// Initialize listeners immediately if DOM is already loaded
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", setupGlobalI18nListeners);
	} else {
		setupGlobalI18nListeners();
	}
}
