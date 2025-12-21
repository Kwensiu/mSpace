<script lang="ts">
import {
	getCurrentLanguage,
	getTranslation,
	type Translation,
} from "@i18n/translation";
import Icon from "@iconify/svelte";
import { setLanguage } from "@utils/setting-utils";
import { onMount } from "svelte";

let currentLang = $state(getCurrentLanguage());
let translation: Translation;
let buttonLabel = $state("Language Settings");

// Language options with display names
const languages = [
	{ code: "zh_CN", name: "中文", flag: "🇨🇳" },
	// { code: "zh_TW", name: "繁體", flag: "🇹🇼" }, // Commented out: Only Simplified Chinese is used
	{ code: "en", name: "English", flag: "🇺🇸" },
	{ code: "ja", name: "日本語", flag: "🇯🇵" },
	{ code: "ko", name: "한국어", flag: "🇰🇷" },
	{ code: "th", name: "ไทย", flag: "🇹🇭" },
	{ code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
	{ code: "id", name: "Bahasa", flag: "🇮🇩" },
	{ code: "tr", name: "Türkçe", flag: "🇹🇷" },
];

onMount(() => {
	updateButtonLabel();
});

function switchLanguage(langCode: string) {
	setLanguage(langCode);
	currentLang = langCode;
	translation = getTranslation(langCode);
	updateButtonLabel();

	// Dispatch custom event for language change
	window.dispatchEvent(
		new CustomEvent("languagechange", { detail: { language: langCode } }),
	);

	// Close the panel
	hidePanel();
}

function updateButtonLabel() {
	const currentLanguage = languages.find((lang) => lang.code === currentLang);
	buttonLabel = currentLanguage
		? `${currentLanguage.flag} ${currentLanguage.name}`
		: "Language Settings";
}

// Initialize translation
// translation = getTranslation(currentLang);

// Listen for language changes from other sources
if (typeof window !== "undefined") {
	window.addEventListener("languagechange", (event: any) => {
		currentLang = event.detail.language;
		translation = getTranslation(currentLang);
		updateButtonLabel();
	});
}

let isPanelVisible = $state(false);

function togglePanel() {
	isPanelVisible = !isPanelVisible;
	const panel = document.querySelector("#language-panel");
	if (panel) {
		if (isPanelVisible) {
			panel.classList.remove("float-panel-closed");
		} else {
			panel.classList.add("float-panel-closed");
		}
	}
}

function showPanel() {
	isPanelVisible = true;
	const panel = document.querySelector("#language-panel");
	if (panel) {
		panel.classList.remove("float-panel-closed");
	}
}

function hidePanel() {
	isPanelVisible = false;
	const panel = document.querySelector("#language-panel");
	if (panel) {
		panel.classList.add("float-panel-closed");
	}
}
</script>

<!-- z-50 make the panel higher than other float panels -->
<div class="relative z-50" role="menu" tabindex="-1" onmouseleave={hidePanel}>
	<button
		id="language-switch"
		aria-label={buttonLabel}
		role="menuitem"
		class="btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90 flex items-center justify-center"
		onmouseenter={showPanel}
		onclick={togglePanel}
	>
		<Icon icon="material-symbols:language" class="text-[1.25rem]" />
	</button>

	<div
		id="language-panel"
		class="absolute transition float-panel-closed top-11 pt-5 z-50 lg:-right-2 right-0"
	>
		<div class="card-base float-panel p-2 min-w-48">
			<div class="font-bold text-neutral-900 dark:text-neutral-100 px-3 py-1 mb-1">
				Languages
			</div>
			{#each languages as lang}
				<button
					class="flex transition whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95 mb-0.5 z-100 {currentLang === lang.code ? '!bg-[var(--primary)] text-white' : ''}"
					onclick={() => switchLanguage(lang.code)}
				>
					<span class="text-lg mr-3">{lang.flag}</span>
					<span>{lang.name}</span>
				</button>
			{/each}
		</div>
	</div>
</div>