<script lang="ts">
import Giscus from "@giscus/svelte";
import { onDestroy, onMount } from "svelte";
import { commentConfig } from "@/config";

// ============================================================================
// 类型定义
// ============================================================================
type MappingType =
	| "url"
	| "title"
	| "og:title"
	| "specific"
	| "number"
	| "pathname";

type BooleanString = "0" | "1";
type InputPosition = "top" | "bottom";

type Theme =
	| "light"
	| "light_high_contrast"
	| "light_protanopia"
	| "dark"
	| "dark_high_contrast"
	| "dark_protanopia"
	| "dark_dimmed"
	| "transparent_dark"
	| "preferred_color_scheme"
	| string;

type AvailableLanguage =
	| "en"
	| "ar"
	| "ca"
	| "da"
	| "de"
	| "el"
	| "es"
	| "fi"
	| "fr"
	| "he"
	| "id"
	| "it"
	| "ja"
	| "ko"
	| "nl"
	| "pl"
	| "pt"
	| "ro"
	| "ru"
	| "th"
	| "tr"
	| "uk"
	| "vi"
	| "zh-CN"
	| "zh-TW";

type Loading = "lazy" | "eager";

// ============================================================================
// 配置验证
// ============================================================================
if (!commentConfig || !commentConfig.giscus) {
	throw new Error("Giscus comments are not configured");
}
const giscus = commentConfig.giscus;

if (
	!giscus.repo ||
	typeof giscus.repo !== "string" ||
	!giscus.repo.includes("/")
) {
	throw new Error("Giscus repo must be in format 'owner/repo'");
}

// ============================================================================
// 状态变量
// ============================================================================
let hue = 80;
let mode = "light";
let isClient = false;
let isLoading = true;
let giscusReady = false;

let giscus_base: string | null = null;
let giscus_dark: string | null = null;
let giscus_light: string | null = null;
let theme: string;

let giscus_iframe: HTMLIFrameElement | null = null;
let observer: MutationObserver | null = null;
let cleanupFunctions: (() => void)[] = [];

// ============================================================================
// 生命周期
// ============================================================================
onMount(async () => {
	isClient = true;
	initializeTheme();
	await loadStyles();
	setupObserver();
	findGiscusIframe();
});

onDestroy(() => {
	observer?.disconnect();
	cleanupFunctions.forEach((cleanup) => cleanup());
	cleanupFunctions = [];
});

// ============================================================================
// 初始化函数
// ============================================================================
function initializeTheme() {
	mode = document.documentElement.classList.contains("dark") ? "dark" : "light";
	hue = getHue();
}

async function loadStyles() {
	try {
		const [baseModule, darkModule, lightModule] = await Promise.all([
			import("@styles/giscus-base.css?raw"),
			import("@styles/giscus-dark.css?raw"),
			import("@styles/giscus-light.css?raw"),
		]);
		giscus_base = baseModule.default;
		giscus_dark = darkModule.default;
		giscus_light = lightModule.default;
		theme = getGiscusThemeValue();
	} catch (error) {
		console.error("Failed to load giscus styles:", error);
		theme = mode;
	}
}

function setupObserver() {
	observer = new MutationObserver(() => {
		const newHue = getHue();
		const newMode = document.documentElement.classList.contains("dark")
			? "dark"
			: "light";

		if (hue !== newHue || mode !== newMode) {
			hue = newHue;
			mode = newMode;
			updateGiscusTheme();
		}
	});

	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["class", "style"],
	});
}

// ============================================================================
// Giscus 核心功能
// ============================================================================
function findGiscusIframe(retries = 0, maxRetries = 20) {
	if (!isClient) return;

	giscus_iframe = document
		.getElementById("giscus-comments")
		?.shadowRoot?.querySelector("iframe") as HTMLIFrameElement;

	if (!giscus_iframe && retries < maxRetries) {
		setTimeout(
			() => findGiscusIframe(retries + 1, maxRetries),
			100 * 1.5 ** retries,
		);
	} else if (giscus_iframe) {
		setTimeout(() => updateGiscusTheme(), 100);
		setupHeightObserver();
		markAsReady();
	}
}

function setupHeightObserver() {
	if (!giscus_iframe) return;

	const messageHandler = (event: MessageEvent) => {
		if (event.source !== giscus_iframe?.contentWindow) return;
		if (typeof event.data === "object" && event.data?.giscus?.resize) {
			giscus_iframe.style.height = "auto";
			giscus_iframe.style.height = event.data.giscus.resize.height + "px";
		}
	};

	const checkHeight = () => {
		if (!giscus_iframe) return;
		try {
			const iframeDocument =
				giscus_iframe.contentDocument || giscus_iframe.contentWindow?.document;
			if (iframeDocument?.body) {
				const bodyHeight = iframeDocument.body.scrollHeight;
				if (bodyHeight > 0) {
					giscus_iframe.style.height = bodyHeight + 20 + "px";
				}
			}
		} catch (e) {
			// 跨域限制，正常情况
		}
	};

	const heightInterval = setInterval(checkHeight, 1000);

	const loadHandler = () => {
		markAsReady();
		setTimeout(() => updateGiscusTheme(), 300);
	};

	giscus_iframe.addEventListener("load", loadHandler);
	window.addEventListener("message", messageHandler);

	cleanupFunctions.push(() => {
		clearInterval(heightInterval);
		window.removeEventListener("message", messageHandler);
		if (giscus_iframe) {
			giscus_iframe.removeEventListener("load", loadHandler);
		}
	});
}

function markAsReady() {
	giscusReady = true;
	isLoading = false;
}

// ============================================================================
// 主题管理
// ============================================================================
function getHue(): number {
	const stored = localStorage.getItem("hue");
	if (stored) return Number.parseInt(stored, 10);

	if (!isClient) return 80;

	const configCarrier = document.getElementById("config-carrier");
	if (configCarrier?.dataset.hue) {
		return Number.parseInt(configCarrier.dataset.hue, 10);
	}

	const style = getComputedStyle(document.documentElement);
	const hueMatch = style.getPropertyValue("--hue");
	return hueMatch ? Number.parseInt(hueMatch, 10) : 80;
}

function getGiscusThemeValue(): string {
	if (!giscus_base || !giscus_dark || !giscus_light) {
		return mode;
	}

	const hueStyle = `main { --hue: ${hue}; }`;
	const css =
		mode === "dark"
			? hueStyle + giscus_dark + giscus_base
			: hueStyle + giscus_light + giscus_base;

	return `data:text/css;base64,${btoa(css)}`;
}

function updateGiscusTheme(retries = 0, maxRetries = 20) {
	if (!isClient) return;
	if (!giscus_iframe?.contentWindow) {
		if (retries < maxRetries) {
			setTimeout(
				() => updateGiscusTheme(retries + 1, maxRetries),
				100 * 1.5 ** retries,
			);
		}
		return;
	}

	const message = {
		giscus: { setConfig: { theme: getGiscusThemeValue() } },
	};

	giscus_iframe.contentWindow.postMessage(message, "*");

	// 双重发送确保样式应用
	if (retries === 0) {
		setTimeout(() => {
			giscus_iframe?.contentWindow?.postMessage(message, "*");
		}, 500);
	}
}
</script>

<div class="giscus-container">
	{#if isLoading}
		<div class="giscus-skeleton">
			<div class="skeleton-header">
				<div class="skeleton-avatar"></div>
				<div class="skeleton-text skeleton-title"></div>
			</div>
			<div class="skeleton-comment">
				<div class="skeleton-avatar"></div>
				<div class="skeleton-content">
					<div class="skeleton-text skeleton-name"></div>
					<div class="skeleton-text skeleton-line"></div>
					<div class="skeleton-text skeleton-line skeleton-line-short"></div>
				</div>
			</div>
			<div class="skeleton-comment">
				<div class="skeleton-avatar"></div>
				<div class="skeleton-content">
					<div class="skeleton-text skeleton-name"></div>
					<div class="skeleton-text skeleton-line"></div>
					<div class="skeleton-text skeleton-line skeleton-line-short"></div>
				</div>
			</div>
		</div>
	{/if}
	<div class:visible={!isLoading && giscusReady} class:giscus-hidden={isLoading || !giscusReady}>
		<Giscus
			id="giscus-comments"
			repo={giscus.repo as `${string}/${string}`}
			repoId={giscus.repoId as string}
			category={giscus.category as string}
			categoryId={giscus.categoryId as string}
			mapping={giscus.mapping as MappingType}
			term={giscus.term ? giscus.term : ""}
			strict={giscus.strict as BooleanString}
			reactionsEnabled={giscus.reactionsEnabled as BooleanString}
			emitMetadata={giscus.emitMetadata as BooleanString}
			inputPosition={giscus.inputPosition as InputPosition}
			theme={theme as Theme}
			lang={giscus.lang as AvailableLanguage}
			loading={giscus.loading as Loading}
		/>
	</div>
</div>

<style>
	.giscus-container {
		width: 100%;
		min-height: 400px;
		height: auto;
		position: relative;
	}

	/* 骨架屏样式 */
	.giscus-skeleton {
		width: 100%;
		padding: 1.5rem;
		background-color: var(--color-canvas-inset);
		border-radius: 1rem;
		animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	.skeleton-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--color-border-default);
	}

	.skeleton-comment {
		display: flex;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.skeleton-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background-color: var(--color-border-default);
		flex-shrink: 0;
	}

	.skeleton-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.skeleton-text {
		height: 16px;
		background-color: var(--color-border-default);
		border-radius: 4px;
	}

	.skeleton-title {
		width: 120px;
		height: 20px;
	}

	.skeleton-name {
		width: 100px;
	}

	.skeleton-line {
		width: 100%;
	}

	.skeleton-line-short {
		width: 60%;
	}

	@keyframes pulse {
		0%, 100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	/* Giscus 显示控制 */
	.giscus-hidden {
		opacity: 0;
		visibility: hidden;
		position: absolute;
	}

	.visible {
		opacity: 1;
		visibility: visible;
		position: relative;
		transition: opacity 0.3s ease;
	}
</style>
