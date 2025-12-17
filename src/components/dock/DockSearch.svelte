<script lang="ts">
// 库和模块导入
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import { url } from "@utils/url-utils.ts";
import { onMount, onDestroy } from "svelte";
import type { SearchResult } from "@/global";

// 状态定义
let keyword = "";
let result: SearchResult[] = [];
let isSearching = false;
let pagefindLoaded = false;
let initialized = false;
let isVisible = false;

// 常量定义
const fakeResult: SearchResult[] = [
	{
		url: url("/"),
		meta: {
			title: "Never Gonna Give You Up",
		},
		excerpt:
			"Because the search cannot work in the <mark>dev</mark> environment.",
	},
	{
		url: url("/"),
		meta: {
			title: "If You Want to Test the Search",
		},
		excerpt: "Try running <mark>npm build && npm preview</mark> instead.",
	},
];

// UI 交互函数
function toggleVisibility(): void {
	isVisible = !isVisible;
	if (isVisible) {
		// 稍微延迟聚焦，确保DOM已经渲染
		setTimeout(() => {
			const input = document.querySelector(
				"#dock-search-input",
			) as HTMLInputElement;
			if (input) {
				input.focus();
			}
		}, 10);
	} else {
		// 隐藏时清除搜索结果
		result = [];
		keyword = "";
	}
}

function hide(): void {
	isVisible = false;
	result = [];
	keyword = "";
}

function navigateToResult(event: Event, itemUrl: string): void {
	event.preventDefault();
	hide(); // 隐藏搜索面板
	if (window.swup) {
		// 使用 Swup 进行平滑导航
		window.swup.navigate(itemUrl);
	} else {
		// 备用方案：如果 Swup 不可用，使用普通导航
		window.location.href = itemUrl;
	}
}

// 事件处理函数
function handleClickOutside(event: Event): void {
	const target = event.target as HTMLElement;
	const panel = document.getElementById("dock-search-panel");
	const button = document.getElementById("dock-search-button");

	if (panel && button && !panel.contains(target) && !button.contains(target)) {
		isVisible = false;
		result = [];
		keyword = "";
	}
}

// 搜索处理函数
async function search(): Promise<void> {
	if (!keyword) {
		result = [];
		return;
	}

	if (!initialized) {
		return;
	}

	isSearching = true;

	try {
		let searchResults: SearchResult[] = [];

		if (import.meta.env.PROD && pagefindLoaded && window.pagefind) {
			const response = await window.pagefind.search(keyword);
			searchResults = await Promise.all(
				response.results.map((item) => item.data()),
			);
		} else if (import.meta.env.DEV) {
			searchResults = fakeResult;
		} else {
			searchResults = [];
			console.error("Pagefind is not available in production environment.");
		}

		result = searchResults;
	} catch (error) {
		console.error("Search error:", error);
		result = [];
	} finally {
		isSearching = false;
	}
}

$: hasResults = result.length > 0;

// 计算搜索面板宽度
let panelWidth = "30rem"; // 默认宽度

// 响应式更新面板宽度
$: {
	// 未搜索状态 - 保持较短的宽度
	if (!keyword || keyword.trim() === "") {
		panelWidth = "30rem";
	}
	// 有搜索结果状态 - 根据内容长度调整宽度
	else if (hasResults) {
		// 计算最长标题的估算宽度
		let maxLength = 0;
		for (const item of result) {
			// 标题长度 + 摘要长度的加权计算
			const estimatedLength =
				item.meta.title.length * 1.2 + (item.excerpt?.length || 0) * 0.3;
			maxLength = Math.max(maxLength, estimatedLength);
		}

		// 根据内容长度计算宽度，设置最小和最大限制
		const minWidth = 35; // rem
		const maxWidth = 55; // rem
		const calculatedWidth = Math.min(
			Math.max(minWidth, maxLength / 10),
			maxWidth,
		);
		panelWidth = `${calculatedWidth}rem`;
	}
	// 正在搜索中或无结果状态 - 中等宽度
	else {
		panelWidth = "35rem";
	}
}

// 设置CSS变量
$: {
	if (typeof document !== "undefined") {
		document.documentElement.style.setProperty(
			"--search-panel-width",
			panelWidth,
		);
	}
}

// 生命周期管理
onMount(() => {
	document.addEventListener("click", handleClickOutside);

	// 初始化CSS变量
	if (typeof document !== "undefined") {
		document.documentElement.style.setProperty(
			"--search-panel-width",
			panelWidth,
		);
	}

	const initializeSearch = (): void => {
		initialized = true;
		pagefindLoaded =
			typeof window !== "undefined" &&
			!!window.pagefind &&
			typeof window.pagefind.search === "function";
		console.log("Pagefind status on init:", pagefindLoaded);
		if (keyword) search();
	};

	if (import.meta.env.DEV) {
		console.log(
			"Pagefind is not available in development mode. Using mock data.",
		);
		initializeSearch();
	} else {
		document.addEventListener("pagefindready", () => {
			console.log("Pagefind ready event received.");
			initializeSearch();
		});
		document.addEventListener("pagefindloaderror", () => {
			console.warn(
				"Pagefind load error event received. Search functionality will be limited.",
			);
			initializeSearch(); // Initialize with pagefindLoaded as false
		});

		// Fallback in case events are not caught or pagefind is already loaded by the time this script runs
		setTimeout(() => {
			if (!initialized) {
				console.log("Fallback: Initializing search after timeout.");
				initializeSearch();
			}
		}, 2000); // Adjust timeout as needed
	}

	// 清理函数
	return () => {
		document.removeEventListener("click", handleClickOutside);
	};
});

onDestroy(() => {
	document.removeEventListener("click", handleClickOutside);
});

// 响应式搜索
$: if (initialized && keyword) {
	(async () => {
		await search();
	})();
}
</script>

<button
  id="dock-search-button"
  class="btn-plain scale-animation rounded-3xl w-11 h-11 active:scale-90"
  on:click|stopPropagation={toggleVisibility}
  aria-label="Search"
>
  <Icon icon="material-symbols:search" class="text-[1.5rem]" />
</button>

<div
  class="fixed transition-all duration-300 ease-in-out"
  class:opacity-0={!isVisible}
  class:opacity-100={isVisible}
  class:pointer-events-none={!isVisible}
  class:-z-10={!isVisible}
  class:z-50={isVisible}
  style="bottom: 6rem; left: 50%; transform: translateX(-50%); width: calc(100% - 0rem); max-width: var(--search-panel-width, 30rem);"
>
  <div
    id="dock-search-panel"
    class="rounded-3xl shadow-xl p-1 max-h-[70vh] overflow-y-auto border border-black/5 dark:border-white/5"
    class:bg-white={true}
    class:dark:bg-black={true}
    class:bg-opacity-80={true}
    class:dark:bg-opacity-80={true}
    class:backdrop-blur-xs={true}
    class:scale-100={isVisible}
  >
    <!-- 搜索结果 -->
    {#if result.length > 0}
      <div class="max-h-[50vh] overflow-y-auto mb-2">
        {#each result as item}
          <div
            role="button"
            tabindex="0"
            class="transition first-of-type:mt-1 group block rounded-3xl text-lg px-3 py-2 hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)] cursor-pointer"
            on:click={(e) => navigateToResult(e, item.url)}
            on:keydown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigateToResult(e, item.url);
              }
            }}
          >
            <div
              class="transition text-90 inline-flex font-bold group-hover:text-[var(--primary)]"
            >
              {item.meta.title}
              <Icon
                icon="fa6-solid:chevron-right"
                class="transition text-[0.75rem] translate-x-1 my-auto text-[var(--primary)]"
              ></Icon>
            </div>
            <div class="transition text-sm text-50">
              {@html item.excerpt}
            </div>
          </div>
        {/each}
      </div>
    {:else if keyword && !isSearching}
      <div class="py-4 text-center text-50 mb-2">No results found</div>
    {/if}

    <!-- 搜索框 -->
    <div
      class="relative transition-all items-center h-11 rounded-3xl
    bg-black/[0.04] hover:bg-black/[0.06] focus-within:bg-black/[0.06]
    dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10"
    >
      <Icon
        icon="material-symbols:search"
        class="absolute text-[1.25rem] pointer-events-none ml-3 mt-3 transition my-auto text-black/30 dark:text-white/30"
      ></Icon>
      <input
        id="dock-search-input"
        placeholder={i18n(I18nKey.search)}
        bind:value={keyword}
        class="pl-10 pr-8 py-2 text-sm bg-transparent outline-0 w-full h-full rounded-3xl"
      />
      {#if keyword}
        <button
          on:click|stopPropagation={() => {
            keyword = "";
            result = [];
          }}
          class="absolute right-2 top-1/2 transform -translate-y-1/2 text-black/30 dark:text-white/30 hover:text-black/50 dark:hover:text-white/50"
          aria-label="Clear search"
        >
          <Icon icon="material-symbols:close" class="text-[1rem]" />
        </button>
      {/if}
    </div>
  </div>
</div>

<style>
  /* 隐藏滚动条但是保留功能 */
  #dock-search-panel::-webkit-scrollbar {
    width: 6px;
  }

  #dock-search-panel::-webkit-scrollbar-track {
    background: transparent;
  }

  #dock-search-panel::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }

  .dark #dock-search-panel::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
  }

  /* 添加宽度过渡效果 */
  #dock-search-panel {
    transition: max-width 0.3s ease-in-out;
    max-width: var(--search-panel-width, 30rem);
  }

  /* 淡入淡出和缩放动画 */
  .transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 200ms;
  }
</style>
