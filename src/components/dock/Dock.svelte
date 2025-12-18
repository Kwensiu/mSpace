<script lang="ts">
import Icon from "@iconify/svelte";
import { url } from "@utils/url-utils.ts";
import { onMount } from "svelte";
import DockSearch from "./DockSearch.svelte";

// 状态管理
let isScrolled = false;
let lastScrollY = 0;
let scrollThreshold = 50;
let showDock = false;

// 组件挂载后监听滚动事件
onMount(() => {
	// 初始状态 - dock是半掩半透明的
	handleScroll();

	// 监听滚动事件
	window.addEventListener("scroll", handleScroll, { passive: true });

	// 清理事件监听
	return () => {
		window.removeEventListener("scroll", handleScroll);
	};
});

// 滚动处理函数 - 决定是否显示dock
function handleScroll() {
	const currentScrollY = window.scrollY;

	// 只要不在顶部（滚动位置大于0）就显示dock
	if (currentScrollY > 100) {
		if (!showDock) {
			showDock = true;
		}
	}
	// 向下滚动或接近顶部时隐藏dock
	else if (currentScrollY > lastScrollY || currentScrollY <= 100) {
		if (showDock) {
			showDock = false;
		}
	}

	lastScrollY = currentScrollY;
}

function navigateHome(event: Event) {
	event.preventDefault();
	if (window.swup) {
		window.swup.navigate(url("/"));
	}
}

// 回到顶部功能
function scrollToTop(e: Event) {
	// 阻止事件冒泡，避免触发其他点击事件
	e.stopPropagation();
	window.scrollTo({
		top: 0,
		behavior: "smooth",
	});
}

// 导航到归档页面
function navigateToArchive(event: Event) {
	event.preventDefault();
	if (window.swup) {
		window.swup.navigate(url("/archive/"));
	}
}

// 导航到关于页面
function navigateToAbout(event: Event) {
	event.preventDefault();
	if (window.swup) {
		window.swup.navigate(url("/about/"));
	}
}
</script>

<!-- Docker组件 - 底部悬浮dock -->
<div
  id="docker"
  role="toolbar"
  tabindex="0"
  class="fixed left-1/2 z-50 transition-all duration-300 ease-out"
  class:bottom-6={showDock}
  class:-bottom-6={!showDock}
  class:opacity-100={showDock}
  class:min-w-48={showDock}
  class:min-w-40={!showDock}
  class:h-18={showDock}
  class:h-14={!showDock}
  class:cursor-pointer={!showDock}
  class:cursor-default={showDock}
  class:show={showDock}
>
  <!-- 背景模糊效果 - 半掩状态也有模糊 -->
  <div
    class="absolute inset-0 bg-white/60 dark:bg-neutral-500/60 backdrop-blur-xs rounded-full shadow-lg border border-black/10 dark:border-white/20"
  ></div>

  <!-- 按钮容器 -->
  <div class="relative flex items-center justify-center h-full px-6 will-change-transform">
    <!-- 半掩状态下显示所有按钮但半透明 -->
    {#if !showDock}
      <!-- 搜索按钮 -->
      <DockSearch />

      <!-- 主页按钮 -->
      <a
        href={url("/")}
        class="btn-plain scale-animation rounded-3xl w-11 h-11 active:scale-90"
        aria-label="主页"
        on:click={navigateHome}
      >
        <Icon icon="material-symbols:home-outline-rounded" class="text-[1.5rem]"
        ></Icon>
      </a>

      <!-- 回到顶部按钮 - 中间突出显示 -->
      <button
        class="btn-docker-primary opacity-90 flex items-center justify-center mx-1"
        on:click={scrollToTop}
        aria-label="回到顶部"
      >
        <Icon
          icon="material-symbols:keyboard-arrow-up-rounded"
          class="text-[1.5rem]"
        ></Icon>
      </button>

      <!-- 归档页面按钮 -->
      <a
        href={url("/archive/")}
        class="btn-plain scale-animation rounded-3xl w-11 h-11 active:scale-90"
        aria-label="归档"
        on:click={navigateToArchive}
      >
        <Icon icon="material-symbols:inventory-2-outline-rounded" class="text-[1.5rem]"
        ></Icon>
      </a>

      <!-- 关于页面按钮 -->
      <a
        href={url("/about/")}
        class="btn-plain scale-animation rounded-3xl w-11 h-11 active:scale-90"
        aria-label="关于"
        on:click={navigateToAbout}
      >
        <Icon icon="material-symbols:info-outline-rounded" class="text-[1.5rem]"
        ></Icon>
      </a>
    {:else}
      <!-- 搜索按钮 -->
      <DockSearch />

      <!-- 主页按钮 -->
      <a
        href={url("/")}
        class="btn-plain scale-animation rounded-3xl w-11 h-11 active:scale-90"
        aria-label="主页"
        on:click={navigateHome}
      >
        <Icon icon="material-symbols:home-outline-rounded" class="text-[1.5rem]"
        ></Icon>
      </a>

      <!-- 回到顶部按钮 - 中间突出显示 -->
      <button
        class="btn-docker-primary items-center justify-center mx-1"
        on:click={scrollToTop}
        aria-label="回到顶部"
      >
        <Icon
          icon="material-symbols:keyboard-arrow-up-rounded"
          class="text-[1.5rem]"
        ></Icon>
      </button>

      <!-- 归档页面按钮 -->
      <a
        href={url("/archive/")}
        class="btn-plain scale-animation rounded-3xl w-11 h-11 active:scale-90"
        aria-label="归档"
        on:click={navigateToArchive}
      >
        <Icon icon="material-symbols:inventory-2-outline-rounded" class="text-[1.5rem]"
        ></Icon>
      </a>

      <!-- 关于页面按钮 -->
      <a
        href={url("/about/")}
        class="btn-plain scale-animation rounded-3xl w-11 h-11 active:scale-90"
        aria-label="关于"
        on:click={navigateToAbout}
      >
        <Icon icon="material-symbols:info-outline-rounded" class="text-[1.5rem]"
        ></Icon>
      </a>
    {/if}
  </div>
</div>

<style>
  /* Docker容器样式 */
  #docker {
    transform: translateX(-50%);
  }

  /* 半掩状态 */
  #docker:not(.expanded):not(.show) {
    transform: translateX(-50%) translateY(2rem) scale(0.9);
  }

  /* Docker按钮基础样式 */
  .btn-docker-item {
    @apply w-10 h-10 rounded-full flex items-center justify-center 
               transition-all duration-200 hover:bg-black/10 dark:hover:bg-white/20 
               text-black/80 dark:text-white/90 hover:text-[var(--primary)];
    margin: 0 2px;
  }

  /* Docker主要按钮样式 */
  .btn-docker-primary {
    @apply w-12 h-12 rounded-full flex items-center justify-center 
               bg-[var(--primary)] text-white shadow-md 
               transition-all duration-200 hover:opacity-80 hover:scale-105;
  }

  /* 为所有dock按钮添加固定宽度，防止显示/隐藏时产生偏移 */
  #docker .btn-plain {
    @apply w-11 h-11 flex items-center justify-center;
  }

  /* 动画效果 */
  @keyframes dockerBounce {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
    }
    100% {
      transform: translateY(0);
    }
  }
</style>
